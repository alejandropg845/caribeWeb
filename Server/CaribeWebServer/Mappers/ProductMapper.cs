using CaribeWebServer.DTOs.ProductDto;
using CaribeWebServer.Models;

namespace CaribeWebServer.Mappers
{
    public static class ProductMapper
    {
        public static ProductDTO ToProductDto(this Product product)
        {
            return new ProductDTO
            {
                Id = product.Id,
                Title = product.Title,
                Votes = product.Votes,
                Rating = product.Rating,
                ImageUrl = product.ImageUrl,
                Category = product.Category!.Name,
                Description = product.Description,
                Price = product.Price
            };
        }

        public static Product ToCreateProductDto(this CreateProductDto dto)
        {
            return new Product
            {
                Title = dto.Title,
                Description = dto.Description,
                Price = dto.Price,
                CategoryId = dto.CategoryId,
                ImageUrl = dto.ImageUrl,
            };
        }
    }
}
