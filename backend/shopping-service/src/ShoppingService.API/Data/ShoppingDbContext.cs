using Microsoft.EntityFrameworkCore;
using ShoppingService.API.Models;

namespace ShoppingService.API.Data
{
    public class ShoppingDbContext : DbContext
    {
        public ShoppingDbContext(DbContextOptions<ShoppingDbContext> options) : base(options) { }

        public DbSet<ShoppingListItem> ShoppingListItems { get; set; }
        public DbSet<InstacartOrder> InstacartOrders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure ShoppingListItem
            modelBuilder.Entity<ShoppingListItem>()
                .HasKey(s => s.Id);

            modelBuilder.Entity<ShoppingListItem>()
                .Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<ShoppingListItem>()
                .Property(s => s.Quantity)
                .IsRequired();

            // Configure InstacartOrder
            modelBuilder.Entity<InstacartOrder>()
                .HasKey(o => o.Id);

            modelBuilder.Entity<InstacartOrder>()
                .Property(o => o.TotalPrice)
                .HasColumnType("decimal(10,2)");

            modelBuilder.Entity<InstacartOrder>()
                .Property(o => o.Status)
                .IsRequired()
                .HasMaxLength(20);

            // Configure OrderItem
            modelBuilder.Entity<OrderItem>()
                .HasKey(oi => oi.Id);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId);
        }
    }
}