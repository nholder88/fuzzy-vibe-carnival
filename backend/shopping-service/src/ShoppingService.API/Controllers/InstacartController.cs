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
    public class InstacartController : ControllerBase
    {
        private readonly IInstacartService _instacartService;
        private readonly ILogger<InstacartController> _logger;

        public InstacartController(IInstacartService instacartService, ILogger<InstacartController> logger)
        {
            _instacartService = instacartService ?? throw new ArgumentNullException(nameof(instacartService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet("orders/{householdId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<InstacartOrder>>> GetOrdersByHousehold(Guid householdId)
        {
            try
            {
                var orders = await _instacartService.GetOrdersByHouseholdAsync(householdId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving Instacart orders for household {HouseholdId}", householdId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpGet("orders/detail/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<InstacartOrder>> GetOrderById(Guid id)
        {
            try
            {
                var order = await _instacartService.GetOrderByIdAsync(id);
                if (order == null)
                {
                    return NotFound();
                }
                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving Instacart order {OrderId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpPost("orders")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<InstacartOrder>> CreateOrder(InstacartOrder order)
        {
            if (order == null)
            {
                return BadRequest();
            }

            try
            {
                var createdOrder = await _instacartService.CreateOrderAsync(order);
                return CreatedAtAction(nameof(GetOrderById), new { id = createdOrder.Id }, createdOrder);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating Instacart order for household {HouseholdId}", order.HouseholdId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpPatch("orders/{id}/status")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<InstacartOrder>> UpdateOrderStatus(Guid id, [FromBody] string status)
        {
            if (string.IsNullOrEmpty(status))
            {
                return BadRequest("Status cannot be null or empty");
            }

            // Validate the status
            if (status != "pending" && status != "in_progress" && status != "delivered")
            {
                return BadRequest("Invalid status. Status must be 'pending', 'in_progress', or 'delivered'");
            }

            try
            {
                var updatedOrder = await _instacartService.UpdateOrderStatusAsync(id, status);
                if (updatedOrder == null)
                {
                    return NotFound();
                }
                return Ok(updatedOrder);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating status for Instacart order {OrderId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpDelete("orders/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteOrder(Guid id)
        {
            try
            {
                var result = await _instacartService.DeleteOrderAsync(id);
                if (!result)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting Instacart order {OrderId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpPost("orders/{orderId}/items")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<InstacartOrder>> AddItemToOrder(Guid orderId, OrderItem item)
        {
            if (item == null)
            {
                return BadRequest();
            }

            try
            {
                var updatedOrder = await _instacartService.AddItemToOrderAsync(orderId, item);
                if (updatedOrder == null)
                {
                    return NotFound();
                }
                return Ok(updatedOrder);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding item to Instacart order {OrderId}", orderId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpDelete("orders/{orderId}/items/{itemId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RemoveItemFromOrder(Guid orderId, Guid itemId)
        {
            try
            {
                var result = await _instacartService.RemoveItemFromOrderAsync(orderId, itemId);
                if (!result)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing item from Instacart order {OrderId}", orderId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }

        [HttpPost("orders/from-shopping-list")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<InstacartOrder>> CreateOrderFromShoppingList([FromQuery] Guid householdId, [FromQuery] Guid userId)
        {
            try
            {
                var createdOrder = await _instacartService.CreateOrderFromShoppingListAsync(householdId, userId);
                if (createdOrder == null)
                {
                    return BadRequest("No pending shopping list items found for the specified household");
                }
                return CreatedAtAction(nameof(GetOrderById), new { id = createdOrder.Id }, createdOrder);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating Instacart order from shopping list for household {HouseholdId}", householdId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }
    }
}