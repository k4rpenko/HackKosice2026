using Logger;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> Index()
        {
            return Ok();
        }
    }
}
