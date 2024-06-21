using CaribeWebServer.DTOs.ProvidersDto;
using CaribeWebServer.Interfaces;
using CaribeWebServer.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace CaribeWebServer.Controllers
{
    [ApiController]
    [Route("api/provider")]
    public class ProvidersController:ControllerBase
    {
        private readonly IProviderRepository _providerRepo;
        public ProvidersController(IProviderRepository repo)
        {
            _providerRepo = repo;
        }

        [HttpGet("/providers/{id:int}")]
        public async Task<ActionResult<IReadOnlyList<ProviderDTO>>> GetAllProductProviders(int id)
        {
            var providers = await _providerRepo.GetAllProvidersAsync(id);
            var providersDto = providers.Select(provs => provs.ToProviderDto());
            return Ok(providersDto);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProviderDTO>> GetProductProviderById(int id)
        {
            var provider = await _providerRepo.GetProviderByIdAsync(id);
            if (provider == null) return NotFound(new {Message="Producto no encontrado"});
            return Ok(provider.ToProviderDto());
        }

        [HttpPost("{id:int}")]
        public async Task<ActionResult<ProviderDTO>> AddProductProvider([FromRoute]int id,[FromBody]CreateProviderDto dto)
        {
            var provider = await _providerRepo.AddProviderAsync(id, dto);
            if (provider == null) return NotFound(new {Message="No se encontró el producto"});
            return Ok(new {Message="Producto y proveedores agregados correctamente", Provider = provider.ToProviderDto() });
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<ProviderDTO>> UpdateProductProvider([FromRoute]int id, [FromBody]UpdateProviderDto dto)
        {
            var provider = await _providerRepo.UpdateProviderAsync(id, dto);
            if (provider == null) return NotFound(new {Message="No se encontró el proveedor"});
            return Ok(new { Message = "Editado correctamente", Provider = provider.ToProviderDto() });

        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteProductProvider([FromRoute] int id)
        {
            var provider = await _providerRepo.DeleteProviderAsync(id);
            if (provider == null) return NotFound(new {Message="No se encontró el proveedor"});
            return Ok(new {Message="Proveedor eliminado correctamente"});
        }
    }
}
