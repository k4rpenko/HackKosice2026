using FinanceService.Models;
using Logger;
using Microsoft.AspNetCore.Mvc;
using PGAdminDAL;
using PGAdminDAL.Models;
using PGAdminDAL.Models.Subclauses;
using PostgresService;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace FinanceService.Controllers;

[ApiController]
[Route("api/transactions")]
public class TransactionController : ControllerBase
{
    private readonly IPostgresService postgresService;
    private readonly AppDbContext context;
    private readonly IAppLogger<TransactionController> logger;

    public TransactionController(IPostgresService postgresService, AppDbContext context, IAppLogger<TransactionController> logger)
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

        return Ok(user.Bank.Transactions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id)
    {
        var user = await postgresService.GetUserDataAsync(Request);
        if (user == null) return Unauthorized();

        var tr = user.Bank.Transactions.FirstOrDefault(x => x.Id.ToString() == id);
        return tr == null ? NotFound() : Ok(tr);
    }

    [HttpPost("pay-jar")]
    public async Task<IActionResult> PayJar(JarTransactions data)
    {
        try
        {
            var user = await postgresService.GetUserDataAsync(Request);
            if (user == null) return Unauthorized();

            var jar = user.Jars.FirstOrDefault(x => x.Id.ToString() == data.IdJar);
            var card = user.Bank.Cards.FirstOrDefault(x => x.Id.ToString() == data.IdCard);

            if (jar == null || card == null) return NotFound();
            if (card.Amount < data.Amount) return BadRequest();

            card.Amount -= data.Amount;
            jar.Balance += data.Amount;

            var tr = new Transaction
            {
                Id = Guid.NewGuid(),
                Amount = data.Amount,
                JarId = jar.Id,
                Card = card,
                User = user,
                Type = "PayJar"
            };

            context.Transactions.Add(tr);
            await context.SaveChangesAsync();

            return Ok(tr);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Error paying to jar {data.IdJar}");
            return StatusCode(400);
        }
    }

    [HttpPost("pay-pice-jar")]
    public async Task<IActionResult> PayPiceOfJar(JarTransactions data)
    {
        try
        {
            UserModel user = await postgresService.GetUserDataAsync(Request);
            if (user == null) return RedirectToAction("Login", "Register");

            var jar = user.Jars.FirstOrDefault(j => j.Id.ToString() == data.IdJar);
            if (jar == null) return NotFound();

            var card = user.Bank.Cards.FirstOrDefault(c => c.Id.ToString() == data.IdCard);
            if (card == null) return NotFound();

            var newTransaction = new PGAdminDAL.Models.Subclauses.Transaction
            {
                Id = Guid.NewGuid(),
                Amount = data.Amount,
                Description = $"Payment to jar {jar.Name}",
                Type = "PaymentToJar",
                Card = card,
                User = user,
                UserId = user.Id,
                Jar = jar,
                JarId = jar.Id
            };
            var JarUser = jar.AccessList.FirstOrDefault(u => u.Id == user.Id);
            if (JarUser == null) return NotFound();

            if (card.Amount < data.Amount && JarUser.AmountMusted < data.Amount) return BadRequest("Not enough funds on the card");
            else card.Amount -= data.Amount;

            jar.Balance += data.Amount;
            if (jar.TargetAmount != null)
            {
                jar.TargetAmount -= data.Amount;
                if (jar.Balance >= jar.TargetAmount)
                {
                    jar.IsCompleted = true;
                }
            }

            JarUser.AmountMusted -= data.Amount;

            await context.Transactions.AddAsync(newTransaction);
            await context.SaveChangesAsync();

            return Ok(new { data = newTransaction });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Error paying to jar {data.IdJar}");
            return StatusCode(400);
        }
    }


    [HttpPost("get-from-jar")]
    public async Task<IActionResult> GetFromJar(JarTransactions data)
    {
        try
        {
            var user = await postgresService.GetUserDataAsync(Request);
            if (user == null) return Unauthorized();

            var jar = user.Jars.FirstOrDefault(x => x.Id.ToString() == data.IdJar);
            var card = user.Bank.Cards.FirstOrDefault(x => x.Id.ToString() == data.IdCard);

            if (jar == null || card == null) return NotFound();
            if (jar.Balance < data.Amount) return BadRequest();

            jar.Balance -= data.Amount;
            card.Amount += data.Amount;

            var tr = new Transaction
            {
                Id = Guid.NewGuid(),
                Amount = data.Amount,
                JarId = jar.Id,
                Card = card,
                User = user,
                Type = "GetFromJar"
            };

            context.Transactions.Add(tr);
            await context.SaveChangesAsync();

            return Ok(tr);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Error getting from jar {data.IdJar}");
            return StatusCode(400);
        }
    }

    [HttpPost("send-money")]
    public async Task<IActionResult> SendMoney(CardTransactions data)
    {
        try
        {
            var user = await postgresService.GetUserDataAsync(Request);
            if (user == null) return Unauthorized();

            var card = user.Bank.Cards.FirstOrDefault(x => x.Id.ToString() == data.FromCardId);
            var user_card = user.Bank.Cards.FirstOrDefault(x => x.CardNumber == data.ToNumberCard);

            if (user_card == null || card == null) return NotFound();
            if (card.Amount < data.Amount) return BadRequest("Not enough funds on the card");

            user_card.Amount += data.Amount;
            card.Amount -= data.Amount;

            var tr = new Transaction
            {
                Id = Guid.NewGuid(),
                Amount = data.Amount,
                Card = card,
                CardId = card.Id,
                ToCard = user_card,
                ToCardId = user_card.Id,
                User = user,
                Type = "SendMoney"
            };

            context.Transactions.Add(tr);
            await context.SaveChangesAsync();

            return Ok(tr);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Error send money to card");
            return StatusCode(400);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var user = await postgresService.GetUserDataAsync(Request);
            if (user == null) return Unauthorized();

            var tr = user.Bank.Transactions.FirstOrDefault(x => x.Id.ToString() == id);
            if (tr == null) return NotFound();

            user.Bank.Transactions.Remove(tr);
            await context.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Error Delete the transaction {id}");
            return StatusCode(400);
        }
    }
}