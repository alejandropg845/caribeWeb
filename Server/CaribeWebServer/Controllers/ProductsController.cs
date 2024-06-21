using CaribeWebServer.DTOs.ProductDto;
using CaribeWebServer.Interfaces;
using CaribeWebServer.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace CaribeWebServer.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController:ControllerBase
    {
        private readonly IProductsRepository _productsRepo;
        public ProductsController(IProductsRepository productsRepo)
        {
            _productsRepo = productsRepo;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductDTO>>> GetAllProducts()
        {
            var products = await _productsRepo.GetProductsAsync();
            var productsDto = products.Select(p => p.ToProductDto()).ToList();
            return Ok(productsDto);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductDTO>> GetProductById([FromRoute]int id)
        {
            var product = await _productsRepo.GetProductByIdAsync(id);
            if(product == null) return NotFound(new {Message="No existe un producto con ese ID"});
            return Ok(product.ToProductDto());
        }

        [HttpPost]
        public async Task<ActionResult<int>> AddProduct([FromBody] CreateProductDto dto)
        {
            var newProduct = await _productsRepo.AddProductAsync(dto);
            return Ok(new {Message="Agregado correctamente", Id = newProduct.Id });
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ProductDTO>> UpdateProductAsync([FromRoute]int id ,[FromBody] UpdateProductDto dto)
        {
            var updatedProduct = await _productsRepo.UpdateProductAsync(id, dto);
            if (updatedProduct == null) return NotFound(new { Message = "El producto no existe" });
            return Ok(new {Message="Editado correctamente", Product = updatedProduct.ToProductDto() });
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteProductById(int id)
        {
            var product = await _productsRepo.DeleteProductByIdAsync(id);
            if (product == null) return NotFound(new { Message = "Producto no encontrado" });
            return Ok(new { Message = "Producto eiminado correctamente" });
        }
 
    }
}
