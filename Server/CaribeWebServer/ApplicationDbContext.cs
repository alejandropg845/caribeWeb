using CaribeWebServer.Models;
using Microsoft.EntityFrameworkCore;

namespace CaribeWebServer
{
    public class ApplicationDbContext:DbContext
    {
        public ApplicationDbContext(DbContextOptions options):base(options)
        {
            
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Provider> Providers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Category>().HasData(
                new { Id=1, Name = "Sopas" },
                new { Id=2, Name = "Bebidas artesanales" },
                new { Id=3, Name = "Productos artesanales" },
                new { Id=4, Name = "Ropa o vestimenta" }
            );
        }
    }
}
