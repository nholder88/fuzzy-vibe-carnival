using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShoppingService.API.Models;
using ShoppingService.API.Services;

namespace ShoppingService.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ShoppingListController : ControllerBase
    {
        private readonly IShoppingListService _shoppingListService;
        private readonly ILogger<ShoppingListController> _logger;

        public ShoppingListController(IShoppingListService shoppingListService, ILogger<ShoppingListController> logger)
        {
            _shoppingListService = shoppingListService ?? throw new ArgumentNullException(nameof(shoppingListService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet("{householdId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<ShoppingListItem>>> GetAllItems(Guid householdId)
        {
            try
            {
                var items = await _shoppingListService.GetAllItemsAsync(householdId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving shopping list items for household {HouseholdId}", householdId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpGet("item/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ShoppingListItem>> GetItemById(Guid id)
        {
            try
            {
                var item = await _shoppingListService.GetItemByIdAsync(id);
                if (item == null)
                {
                    return NotFound();
                }
                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving shopping list item {ItemId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ShoppingListItem>> AddItem(ShoppingListItem item)
        {
            if (item == null)
            {
                return BadRequest();
            }

            try
            {
                var createdItem = await _shoppingListService.AddItemAsync(item);
                return CreatedAtAction(nameof(GetItemById), new { id = createdItem.Id }, createdItem);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding shopping list item");
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ShoppingListItem>> UpdateItem(Guid id, ShoppingListItem item)
        {
            if (item == null || id != item.Id)
            {
                return BadRequest();
            }

            try
            {
                var updatedItem = await _shoppingListService.UpdateItemAsync(item);
                if (updatedItem == null)
                {
                    return NotFound();
                }
                return Ok(updatedItem);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating shopping list item {ItemId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteItem(Guid id)
        {
            try
            {
                var result = await _shoppingListService.DeleteItemAsync(id);
                if (!result)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting shopping list item {ItemId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpGet("completed/{householdId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<ShoppingListItem>>> GetCompletedItems(Guid householdId)
        {
            try
            {
                var items = await _shoppingListService.GetCompletedItemsAsync(householdId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving completed shopping list items for household {HouseholdId}", householdId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpGet("pending/{householdId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<ShoppingListItem>>> GetPendingItems(Guid householdId)
        {
            try
            {
                var items = await _shoppingListService.GetPendingItemsAsync(householdId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving pending shopping list items for household {HouseholdId}", householdId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpPatch("complete/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> MarkItemAsCompleted(Guid id)
        {
            try
            {
                var result = await _shoppingListService.MarkItemAsCompletedAsync(id);
                if (!result)
                {
                    return NotFound();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking shopping list item {ItemId} as completed", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }
    }
}