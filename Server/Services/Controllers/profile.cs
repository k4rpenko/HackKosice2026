using Logger;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PGAdminDAL;
using PostgresService;

namespace Services.Controllers
{
    [ApiController]
    [Route("api/cards")]
    public class profile : ControllerBase
    {
        private readonly IPostgresService postgresService;
        private readonly AppDbContext context;
        private readonly IAppLogger<profile> logger;

        public profile(IPostgresService postgresService, AppDbContext context, IAppLogger<profile> logger)
        {
            this.postgresService = postgresService;
            this.context = context;
            this.logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            return Ok();
        }
    }
}
