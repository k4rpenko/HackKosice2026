using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using PGAdminDAL;

namespace PostgresService
{
    public class PostgresServiceImpl : IPostgresService
    {
        public readonly AppDbContext _context;
        public PostgresServiceImpl(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> GetUserIdAsync(HttpRequest req)
        {
            if (!req.Cookies.TryGetValue("_ASA", out string cookieValue)) return Guid.Empty;

            var session = await _context.Sessions.FirstOrDefaultAsync(u => u.KeyHash == cookieValue);

            if (session == null || session.LoginTime < DateTime.UtcNow)
            {
                if (session != null)
                {
                    _context.Sessions.Remove(session);
                    await _context.SaveChangesAsync();
                }
                return Guid.Empty;
            }

            return session.UserId;
        }

        public async Task<bool> IsSessionValidAsync(HttpRequest req)
        {
            var userId = await GetUserIdAsync(req);
            
            return userId != null;
        }

        public async Task<UserModel> GetUserDataAsync(HttpRequest req)
        {
            var userId = await GetUserIdAsync(req);

            if(userId == null) return null;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            return user;
        }

        public async Task<UserModel> GetUserDataByIdAsync(string userId, HttpRequest req)
        {
            if (!Guid.TryParse(userId, out var guid)) return null;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == guid);

            if (user == null) return null;
            
            return user;
        }



    }
}
