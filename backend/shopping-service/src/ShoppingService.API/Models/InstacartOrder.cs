using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShoppingService.API.Models
{
    public class InstacartOrder
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid UserId { get; set; }

        public Guid HouseholdId { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Range(0, double.MaxValue)]
        public decimal TotalPrice { get; set; }

        public DateTime? DeliveryTime { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "pending";

        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}