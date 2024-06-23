using CaribeWebServer.DTOs.ProductDto;
using CaribeWebServer.Interfaces;
using CaribeWebServer.Mappers;
using CaribeWebServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CaribeWebServer.Repositories
{
    public class ProductsRepository:IProductsRepository
    {
        private readonly ApplicationDbContext _context;
        public ProductsRepository(ApplicationDbContext context) { _context = context; }
        public async Task<IReadOnlyList<Product>> GetProductsAsync()
        {
            var products = await _context.Products.Include(p => p.Providers).Include(p => p.Category).ToListAsync();
            return products;
        }
        public async Task<Product> GetProductByIdAsync(int id)
        {
            var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return null!;
            return product;
        }

        public async Task<Product> AddProductAsync(CreateProductDto dto)
        {
            var newProduct = dto.ToCreateProductDto();
            await _context.Products.AddAsync(newProduct);
            await _context.SaveChangesAsync();
            return newProduct;
        }

        public async Task<Product> UpdateProductAsync([FromRoute]int id,[FromBody]UpdateProductDto dto)
        {
            var product = await _context.Products
                .Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return null!;
            product.Id = id;
            product.Price = dto.Price;
            product.Description = dto.Description;
            product.CategoryId = dto.CategoryId;
            product.ImageUrl = dto.ImageUrl;
            product.Title = dto.Title;
            await _context.SaveChangesAsync();
            await _context.Entry(product).Reference(p => p.Category).LoadAsync();
            return product;
        }

        public async Task<Product> DeleteProductByIdAsync([FromRoute] int id)
        {

            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return null!;

            var providers = await _context.Providers
                        .Where(p => p.ProductId == id).ToListAsync();
            

            foreach (var provider in providers)
                _context.Providers.Remove(provider);
            
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product> RateProductAsync([FromRoute]int id, [FromBody] int rating)
        {
            var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id==id);
            if (product == null) return null!;
            product.Rating += rating;
            product.Votes++;
            await _context.SaveChangesAsync();
            return product;
        }
    }
}
