using System.ComponentModel.DataAnnotations.Schema;

namespace CaribeWebServer.Models
{
    public class Provider
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int ProductId { get; set; }
        public List<Product>? Products { get; set; }
        public List<string>? Position { get; set; } 
        public string Address { get; set; } = string.Empty;
        public int Phone {  get; set; }
    }
}
