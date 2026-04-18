using Hash.Interface;
using Logger;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using PGAdminDAL;
using PostgresService;

namespace Services.Controllers
{
    [ApiController]
    [Route("api/cards")]
    public class profile : ControllerBase
    {
        private readonly IHASH256 _hash;
        private readonly IPostgresService postgresService;
        private readonly AppDbContext context;
        private readonly IAppLogger<profile> logger;

        public profile(IPostgresService postgresService, AppDbContext context, IAppLogger<profile> logger, IHASH256 hash)
        {
            this.postgresService = postgresService;
            this.context = context;
            this.logger = logger;
            _hash = hash;
        }

        [HttpGet]
        public async Task<IActionResult> profile_data()
        {
            var user = await postgresService.GetUserDataAsync(Request);
            if (user == null) return Unauthorized();

            return Ok(user);
        }

        [HttpPut]
        public async Task<IActionResult> change_data(UserModel userModel)
        {
            try
            {
                var user = await postgresService.GetUserDataAsync(Request);
                if (user == null) return Unauthorized();

                user.FirstName = userModel.FirstName != null ? userModel.FirstName : user.FirstName;
                user.LastName = userModel.LastName != null ? userModel.LastName : user.LastName;
                user.Email = userModel.Email != null ? userModel.Email : user.Email;
                user.DateOfBirth = userModel.DateOfBirth != null ? userModel.DateOfBirth : user.DateOfBirth;

                await context.SaveChangesAsync();
                return Ok(user);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating user profile");
                return StatusCode(500, "An error occurred while updating the profile.");
            }
        }

        [HttpPut]
        public async Task<IActionResult> change_password(string password)
        {
            try
            {
                var user = await postgresService.GetUserDataAsync(Request);
                if (user == null) return Unauthorized();

                user.Password = password != null ? _hash.Encrypt(password, user.KeyHash) : user.Password;

                await context.SaveChangesAsync();
                return Ok(user);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error chang password");
                return StatusCode(500);
            }
        }


    }
}
