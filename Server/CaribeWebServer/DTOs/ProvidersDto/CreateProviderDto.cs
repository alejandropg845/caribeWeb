namespace CaribeWebServer.DTOs.ProvidersDto
{
    public class CreateProviderDto
    {
        public string Name { get; set; } = string.Empty;
        public string Lat { get; set; } = string.Empty;
        public string Lng { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public long PhoneNumber { get; set; }
    }
}
