using System.ComponentModel.DataAnnotations.Schema;

namespace CaribeWebServer.Models
{
    public class Product
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        [Column(TypeName="decimal(18,2)")] public decimal Price { get; set; }
        public List<Provider>? Providers { get; set; }
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
        public string Description { get; set; } = string.Empty;

     }
}
