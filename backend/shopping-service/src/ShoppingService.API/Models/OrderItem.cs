using System;
using System.ComponentModel.DataAnnotations;

namespace ShoppingService.API.Models
{
    public class OrderItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid OrderId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        public int Quantity { get; set; }

        public string Unit { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal Subtotal { get; set; }

        public virtual InstacartOrder Order { get; set; }
    }
}