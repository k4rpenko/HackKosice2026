using Microsoft.AspNetCore.Http;

namespace PostgresService
{
    public interface IPostgresService
    {
        Task<bool> IsSessionValidAsync(HttpRequest req);
        Task<Guid> GetUserIdAsync(HttpRequest req);
        Task<UserModel> GetUserDataAsync(HttpRequest req);
        Task<UserModel> GetUserDataByIdAsync(string userId, HttpRequest req);
    }
}
