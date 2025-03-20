using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ShoppingService.API.Models;

namespace ShoppingService.API.Services
{
    public interface IShoppingListService
    {
        Task<IEnumerable<ShoppingListItem>> GetAllItemsAsync(Guid householdId);
        Task<ShoppingListItem> GetItemByIdAsync(Guid id);
        Task<ShoppingListItem> AddItemAsync(ShoppingListItem item);
        Task<ShoppingListItem> UpdateItemAsync(ShoppingListItem item);
        Task<bool> DeleteItemAsync(Guid id);
        Task<IEnumerable<ShoppingListItem>> GetCompletedItemsAsync(Guid householdId);
        Task<IEnumerable<ShoppingListItem>> GetPendingItemsAsync(Guid householdId);
        Task<bool> MarkItemAsCompletedAsync(Guid id);
    }
}