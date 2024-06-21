using CaribeWebServer.DTOs.ProvidersDto;
using CaribeWebServer.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace CaribeWebServer.DTOs.ProductDto
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        [Column(TypeName = "decimal(18,2)")] public decimal Price { get; set; }
        public string Category { get; set; } = string.Empty;
    }
}
