using System;
using System.ComponentModel.DataAnnotations;

namespace ShoppingService.API.Models
{
    public class ShoppingListItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        public int Quantity { get; set; }

        public string Unit { get; set; }

        public string Category { get; set; }

        public bool IsCompleted { get; set; } = false;

        public Guid HouseholdId { get; set; }

        public Guid? AddedByUserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}