using CaribeWebServer.DTOs.ProductDto;
using CaribeWebServer.Models;
using Microsoft.AspNetCore.Mvc;

namespace CaribeWebServer.Interfaces
{
    public interface IProductsRepository
    {
        Task<IReadOnlyList<Product>> GetProductsAsync();
        Task<Product> GetProductByIdAsync([FromRoute]int id);
        Task<Product> AddProductAsync([FromBody]CreateProductDto dto);
        Task<Product> UpdateProductAsync([FromRoute]int id,[FromBody]UpdateProductDto dto);
        Task<Product> DeleteProductByIdAsync([FromRoute] int id);
    }
}
