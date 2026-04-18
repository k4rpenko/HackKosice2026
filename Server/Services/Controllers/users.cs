using Logger;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PGAdminDAL;
using PostgresService;

namespace Services.Controllers
{
    public class users : ControllerBase
    {
        private readonly IPostgresService postgresService;
        private readonly AppDbContext context;
        private readonly IAppLogger<users> logger;

        public users(IPostgresService postgresService, AppDbContext context, IAppLogger<users> logger)
        {
            this.postgresService = postgresService;
            this.context = context;
            this.logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var user = await postgresService.GetUserDataAsync(Request);
            if (user == null) return Unauthorized();

            

            return Ok(user.Know);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await postgresService.GetUserDataAsync(Request);
            if (user == null) return Unauthorized();

            var know = await context.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.Avatar,
                    u.Know
                })
                .FirstOrDefaultAsync();

            return Ok(new { data = know });
        }

        [HttpGet("{id:guid}/friends")]
        public async Task<IActionResult> GetFriends(Guid id)
        {
            var user = await postgresService.GetUserDataAsync(Request);
            if (user == null) return Unauthorized();

            var know = await context.Users
                .Where(u => u.Role == "friend" && u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.Avatar,
                    u.Know
                })
                .FirstOrDefaultAsync();

            return Ok(new { data = know });
        }

        [HttpGet("{id:guid}/family")]
        public async Task<IActionResult> GetFamily(Guid id)
        {
            var user = await postgresService.GetUserDataAsync(Request);
            if (user == null) return Unauthorized();

            var know = await context.Users
                .Where(u => u.Role == "family" && u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.Avatar,
                    u.Know
                })
                .FirstOrDefaultAsync();

            return Ok(new { data = know });
        }

        [HttpGet("{email}")]
        public async Task<IActionResult> GetUserEmail(string email)
        {
            var user = await postgresService.GetUserDataAsync(Request);
            if (user == null) return Unauthorized();

            var know = await context.Users
                .Where(u =>
                    (u.Email.ToLower().Contains(email.ToLower()) ||
                    u.Id != user.Id)
                )
                .Take(7)
                .ToListAsync();

            if (know == null)
            {
                return NotFound();
            }

            return Ok(new { data = know });
        }

        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteUserEmail(string email)
        {
            var user = await postgresService.GetUserDataAsync(Request);
            if (user == null) return Unauthorized();

            context.Users.RemoveRange(context.Users.Where(u => u.Email == email));
            await context.SaveChangesAsync();

            return Ok();
        }
    }
}
