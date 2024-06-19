using CaribeWebServer.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace CaribeWebServer.DTOs.ProductDto
{
    public class CreateProductDto
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        [Column(TypeName = "decimal(18,2)")] public decimal Price { get; set; }
        public int CategoryId { get; set; }
    }
}
