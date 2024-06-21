using CaribeWebServer.DTOs.ProvidersDto;
using CaribeWebServer.Models;
using Microsoft.AspNetCore.Mvc;

namespace CaribeWebServer.Interfaces
{
    public interface IProviderRepository
    {
        Task<IReadOnlyList<Provider>> GetAllProvidersAsync(int ProductId);
        Task<Provider> GetProviderByIdAsync([FromRoute]int id);
        Task<Provider> AddProviderAsync([FromRoute] int productId, [FromBody]CreateProviderDto dto);
        Task<Provider> UpdateProviderAsync([FromRoute] int productId,[FromBody]UpdateProviderDto dto);
        Task<Provider> DeleteProviderAsync([FromRoute]int id);
    }
}
