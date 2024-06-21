using CaribeWebServer.DTOs.ProvidersDto;
using CaribeWebServer.Interfaces;
using CaribeWebServer.Mappers;
using CaribeWebServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.JSInterop.Infrastructure;

namespace CaribeWebServer.Repositories
{
    
    public class ProviderRepository : IProviderRepository
    {
        private readonly ApplicationDbContext _context;

        public ProviderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<Provider>> GetAllProvidersAsync(int productId)
        {
            var providers = await _context.Providers.Where(p => p.ProductId == productId).ToListAsync();
            return providers;
        }
        public async Task<Provider> GetProviderByIdAsync([FromRoute] int id)
        {
            var provider = await _context.Providers.FirstOrDefaultAsync(p => p.Id == id);
            if (provider == null) return null!;
            return provider;
        }
        public async Task<Provider> AddProviderAsync([FromRoute] int productId, [FromRoute] CreateProviderDto dto)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
            if (product == null) return null!;
            var newProvider = dto.ToCreateProviderDto(productId);
            await _context.Providers.AddAsync(newProvider);
            await _context.SaveChangesAsync();
            return newProvider;
        }
        public async Task<Provider> UpdateProviderAsync([FromRoute] int providerId,[FromBody] UpdateProviderDto dto)
        {
            var provider = await _context.Providers.FirstOrDefaultAsync(p => p.Id == providerId);
            if (provider == null) return null!;

            provider.Id = provider.Id;
            provider.Phone = dto.PhoneNumber;
            provider.Address = dto.Address;
            provider.ProductId = provider.ProductId;
            provider.Name = dto.Name;
            provider.Lat = dto.Lat;
            provider.Lng = dto.Lng;
            await _context.SaveChangesAsync();
            return provider;
        }
        public async Task<Provider> DeleteProviderAsync([FromRoute] int id)
        {
            var provider = await _context.Providers.FirstOrDefaultAsync(p => p.Id == id);
            if (provider == null) return null!;
            _context.Remove(provider);
            await _context.SaveChangesAsync();
            return provider;
        }

    }
}
