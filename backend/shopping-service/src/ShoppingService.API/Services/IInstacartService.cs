using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ShoppingService.API.Models;

namespace ShoppingService.API.Services
{
    public interface IInstacartService
    {
        Task<IEnumerable<InstacartOrder>> GetOrdersByHouseholdAsync(Guid householdId);
        Task<InstacartOrder> GetOrderByIdAsync(Guid id);
        Task<InstacartOrder> CreateOrderAsync(InstacartOrder order);
        Task<InstacartOrder> UpdateOrderStatusAsync(Guid id, string status);
        Task<bool> DeleteOrderAsync(Guid id);
        Task<InstacartOrder> AddItemToOrderAsync(Guid orderId, OrderItem item);
        Task<bool> RemoveItemFromOrderAsync(Guid orderId, Guid itemId);
        Task<InstacartOrder> CreateOrderFromShoppingListAsync(Guid householdId, Guid userId);
    }
}