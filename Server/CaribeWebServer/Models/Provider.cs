﻿using System.ComponentModel.DataAnnotations.Schema;

namespace CaribeWebServer.Models
{
    public class Provider
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int ProductId { get; set; }
        public List<Product>? Products { get; set; }
        public string Lat { get; set; } = string.Empty;
        public string Lng { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public long Phone {  get; set; }
    }
}
