using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShoppingService.API.Data;
using ShoppingService.API.Models;

namespace ShoppingService.API.Services
{
    public class InstacartService : IInstacartService
    {
        private readonly ShoppingDbContext _dbContext;
        private readonly ILogger<InstacartService> _logger;
        private readonly IShoppingListService _shoppingListService;

        public InstacartService(
            ShoppingDbContext dbContext,
            ILogger<InstacartService> logger,
            IShoppingListService shoppingListService)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _shoppingListService = shoppingListService ?? throw new ArgumentNullException(nameof(shoppingListService));
        }

        public async Task<IEnumerable<InstacartOrder>> GetOrdersByHouseholdAsync(Guid householdId)
        {
            try
            {
                return await _dbContext.InstacartOrders
                    .Where(o => o.HouseholdId == householdId)
                    .Include(o => o.OrderItems)
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving Instacart orders for household {HouseholdId}", householdId);
                throw;
            }
        }

        public async Task<InstacartOrder> GetOrderByIdAsync(Guid id)
        {
            try
            {
                return await _dbContext.InstacartOrders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving Instacart order {OrderId}", id);
                throw;
            }
        }

        public async Task<InstacartOrder> CreateOrderAsync(InstacartOrder order)
        {
            try
            {
                order.OrderDate = DateTime.UtcNow;
                _dbContext.InstacartOrders.Add(order);
                await _dbContext.SaveChangesAsync();
                return order;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating Instacart order for household {HouseholdId}", order.HouseholdId);
                throw;
            }
        }

        public async Task<InstacartOrder> UpdateOrderStatusAsync(Guid id, string status)
        {
            try
            {
                var order = await _dbContext.InstacartOrders.FindAsync(id);
                if (order == null)
                {
                    return null;
                }

                order.Status = status;

                if (status == "delivered")
                {
                    order.DeliveryTime = DateTime.UtcNow;
                }

                await _dbContext.SaveChangesAsync();
                return order;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating status for Instacart order {OrderId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteOrderAsync(Guid id)
        {
            try
            {
                var order = await _dbContext.InstacartOrders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    return false;
                }

                _dbContext.OrderItems.RemoveRange(order.OrderItems);
                _dbContext.InstacartOrders.Remove(order);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting Instacart order {OrderId}", id);
                throw;
            }
        }

        public async Task<InstacartOrder> AddItemToOrderAsync(Guid orderId, OrderItem item)
        {
            try
            {
                var order = await _dbContext.InstacartOrders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                {
                    return null;
                }

                item.OrderId = orderId;
                item.Subtotal = item.UnitPrice * item.Quantity;
                order.OrderItems.Add(item);

                // Update the total price
                order.TotalPrice = order.OrderItems.Sum(i => i.Subtotal);

                await _dbContext.SaveChangesAsync();
                return order;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding item to Instacart order {OrderId}", orderId);
                throw;
            }
        }

        public async Task<bool> RemoveItemFromOrderAsync(Guid orderId, Guid itemId)
        {
            try
            {
                var order = await _dbContext.InstacartOrders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                {
                    return false;
                }

                var item = order.OrderItems.FirstOrDefault(i => i.Id == itemId);
                if (item == null)
                {
                    return false;
                }

                order.OrderItems.Remove(item);

                // Update the total price
                order.TotalPrice = order.OrderItems.Sum(i => i.Subtotal);

                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing item from Instacart order {OrderId}", orderId);
                throw;
            }
        }

        public async Task<InstacartOrder> CreateOrderFromShoppingListAsync(Guid householdId, Guid userId)
        {
            try
            {
                // Get pending shopping list items
                var shoppingListItems = await _shoppingListService.GetPendingItemsAsync(householdId);

                if (!shoppingListItems.Any())
                {
                    return null;
                }

                // Create a new order
                var order = new InstacartOrder
                {
                    HouseholdId = householdId,
                    UserId = userId,
                    Status = "pending",
                    TotalPrice = 0
                };

                _dbContext.InstacartOrders.Add(order);
                await _dbContext.SaveChangesAsync();

                // Add items to the order
                foreach (var item in shoppingListItems)
                {
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        Name = item.Name,
                        Quantity = item.Quantity,
                        Unit = item.Unit,
                        UnitPrice = 0, // Price will be determined by Instacart
                        Subtotal = 0
                    };

                    order.OrderItems.Add(orderItem);

                    // Mark shopping list item as completed
                    await _shoppingListService.MarkItemAsCompletedAsync(item.Id);
                }

                await _dbContext.SaveChangesAsync();
                return order;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating Instacart order from shopping list for household {HouseholdId}", householdId);
                throw;
            }
        }
    }
}