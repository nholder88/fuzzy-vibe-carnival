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
    public class ShoppingListService : IShoppingListService
    {
        private readonly ShoppingDbContext _dbContext;
        private readonly ILogger<ShoppingListService> _logger;

        public ShoppingListService(ShoppingDbContext dbContext, ILogger<ShoppingListService> logger)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<ShoppingListItem>> GetAllItemsAsync(Guid householdId)
        {
            try
            {
                return await _dbContext.ShoppingListItems
                    .Where(item => item.HouseholdId == householdId)
                    .OrderBy(item => item.Category)
                    .ThenBy(item => item.Name)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving shopping list items for household {HouseholdId}", householdId);
                throw;
            }
        }

        public async Task<ShoppingListItem> GetItemByIdAsync(Guid id)
        {
            try
            {
                return await _dbContext.ShoppingListItems.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving shopping list item {ItemId}", id);
                throw;
            }
        }

        public async Task<ShoppingListItem> AddItemAsync(ShoppingListItem item)
        {
            try
            {
                item.CreatedAt = DateTime.UtcNow;
                _dbContext.ShoppingListItems.Add(item);
                await _dbContext.SaveChangesAsync();
                return item;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding shopping list item {ItemName} for household {HouseholdId}",
                    item.Name, item.HouseholdId);
                throw;
            }
        }

        public async Task<ShoppingListItem> UpdateItemAsync(ShoppingListItem item)
        {
            try
            {
                var existingItem = await _dbContext.ShoppingListItems.FindAsync(item.Id);
                if (existingItem == null)
                {
                    return null;
                }

                existingItem.Name = item.Name;
                existingItem.Quantity = item.Quantity;
                existingItem.Unit = item.Unit;
                existingItem.Category = item.Category;
                existingItem.IsCompleted = item.IsCompleted;
                existingItem.UpdatedAt = DateTime.UtcNow;

                await _dbContext.SaveChangesAsync();
                return existingItem;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating shopping list item {ItemId}", item.Id);
                throw;
            }
        }

        public async Task<bool> DeleteItemAsync(Guid id)
        {
            try
            {
                var item = await _dbContext.ShoppingListItems.FindAsync(id);
                if (item == null)
                {
                    return false;
                }

                _dbContext.ShoppingListItems.Remove(item);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting shopping list item {ItemId}", id);
                throw;
            }
        }

        public async Task<IEnumerable<ShoppingListItem>> GetCompletedItemsAsync(Guid householdId)
        {
            try
            {
                return await _dbContext.ShoppingListItems
                    .Where(item => item.HouseholdId == householdId && item.IsCompleted)
                    .OrderBy(item => item.Category)
                    .ThenBy(item => item.Name)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving completed shopping list items for household {HouseholdId}", householdId);
                throw;
            }
        }

        public async Task<IEnumerable<ShoppingListItem>> GetPendingItemsAsync(Guid householdId)
        {
            try
            {
                return await _dbContext.ShoppingListItems
                    .Where(item => item.HouseholdId == householdId && !item.IsCompleted)
                    .OrderBy(item => item.Category)
                    .ThenBy(item => item.Name)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving pending shopping list items for household {HouseholdId}", householdId);
                throw;
            }
        }

        public async Task<bool> MarkItemAsCompletedAsync(Guid id)
        {
            try
            {
                var item = await _dbContext.ShoppingListItems.FindAsync(id);
                if (item == null)
                {
                    return false;
                }

                item.IsCompleted = true;
                item.UpdatedAt = DateTime.UtcNow;
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking shopping list item {ItemId} as completed", id);
                throw;
            }
        }
    }
}