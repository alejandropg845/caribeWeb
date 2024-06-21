using CaribeWebServer.DTOs.ProvidersDto;
using CaribeWebServer.Models;

namespace CaribeWebServer.Mappers
{
    public static class ProvidersMapper
    {
        public static ProviderDTO ToProviderDto(this Provider provider)
        {
            return new ProviderDTO
            {
                Id = provider.Id,
                ProductId = provider.ProductId,
                Address = provider.Address,
                Lat = provider.Lat,
                Lng = provider.Lng,
                Name = provider.Name,
                Phone = provider.Phone,
            };
        }
        
        public static Provider ToCreateProviderDto(this CreateProviderDto dto, int productId)
        {
            return new Provider
            {
                Name = dto.Name,
                Phone = dto.PhoneNumber,
                Address = dto.Address,
                Lat = dto.Lat,
                Lng = dto.Lng,
                ProductId = productId,
            };
        }
    }
}
