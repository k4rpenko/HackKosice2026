using Logger;
using Microsoft.AspNetCore.Mvc;
using PGAdminDAL;
using PGAdminDAL.Models;
using PGAdminDAL.Models.Subclauses;
using PostgresService;

namespace FinanceService.Controllers;

[ApiController]
[Route("api/jars")]
public class JarController : ControllerBase
{
    private readonly IPostgresService postgresService;
    private readonly AppDbContext context;
    private readonly IAppLogger<JarController> logger;

    public JarController(IPostgresService postgresService, AppDbContext context, IAppLogger<JarController> logger)
    {
        this.postgresService = postgresService;
        this.context = context;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetJars()
    {
        var user = await postgresService.GetUserDataAsync(Request);
        if (user == null) return Unauthorized();

        return Ok(user.Jars);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetJar(string id)
    {
        var user = await postgresService.GetUserDataAsync(Request);
        if (user == null) return Unauthorized();

        var jar = user.Jars.FirstOrDefault(x => x.Id.ToString() == id);
        return jar == null ? NotFound() : Ok(jar);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Jar jar)
    {
        var user = await postgresService.GetUserDataAsync(Request);
        if (user == null) return Unauthorized();

        var newJar = new Jar
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Name = jar.Name,
            TargetAmount = jar.TargetAmount,
            Balance = 0,
            CreatedAt = DateTime.UtcNow
        };

        context.Jars.Add(newJar);
        await context.SaveChangesAsync();

        return Ok(newJar);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Jar jar)
    {
        var user = await postgresService.GetUserDataAsync(Request);
        if (user == null) return Unauthorized();

        var existing = context.Jars.FirstOrDefault(x => x.Id.ToString() == id && x.UserId == user.Id);
        if (existing == null) return NotFound();

        existing.Name = jar.Name;
        existing.TargetAmount = jar.TargetAmount;

        await context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpPut("{id}/add-user")]
    public async Task<IActionResult> AddUser(string id)
    {
        var user = await postgresService.GetUserDataAsync(Request);
        if (user == null) return Unauthorized();

        var addUser = await postgresService.GetUserDataByIdAsync(id, Request);

        var jar = context.Jars.FirstOrDefault(x => x.UserId == user.Id);
        if (jar == null) return NotFound();

        jar.AccessList.Add(new JarAccess
        {
            Id = Guid.NewGuid(),
            JarId = jar.Id,
            UserId = addUser.Id,
            User = addUser,
            Role = "read"
        });

        await context.SaveChangesAsync();
        return Ok(jar);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await postgresService.GetUserDataAsync(Request);
        if (user == null) return Unauthorized();

        var jar = user.Jars.FirstOrDefault(x => x.Id.ToString() == id);
        if (jar == null) return NotFound();

        if (jar.Balance > 0)
            return BadRequest("Jar has balance");

        user.Jars.Remove(jar);
        await context.SaveChangesAsync();

        return Ok();
    }
}