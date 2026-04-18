using Logger;
using Microsoft.AspNetCore.Mvc;
using PGAdminDAL;
using PGAdminDAL.Models;
using PGAdminDAL.Models.Subclauses;
using PostgresService;

namespace FinanceService.Controllers;

[ApiController]
[Route("api/cards")]
public class CardController : ControllerBase
{
    private readonly IPostgresService postgresService;
    private readonly AppDbContext context;
    private readonly IAppLogger<CardController> logger;

    public CardController(IPostgresService postgresService, AppDbContext context, IAppLogger<CardController> logger)
    {
        this.postgresService = postgresService;
        this.context = context;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetCards()
    {
        var user = await postgresService.GetUserDataAsync(Request);
        if (user == null) return Unauthorized();

        return Ok(user.Bank.Cards);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCard(string id)
    {
        var user = await postgresService.GetUserDataAsync(Request);
        if (user == null) return Unauthorized();

        var card = user.Bank.Cards.FirstOrDefault(x => x.Id.ToString() == id);
        return card == null ? NotFound() : Ok(card);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Card card)
    {
        var user = await postgresService.GetUserDataAsync(Request);
        if (user == null) return Unauthorized();

        var newCard = new Card
        {
            Id = Guid.NewGuid(),
            CardHolderName = card.CardHolderName,
            CardNumber = card.CardNumber,
            ExpiryDate = card.ExpiryDate,
            Cvv = card.Cvv,
            Bank = user.Bank
        };

        user.Bank.Cards.Add(newCard);
        await context.SaveChangesAsync();

        return Ok(newCard);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Card card)
    {
        var user = await postgresService.GetUserDataAsync(Request);
        if (user == null) return Unauthorized();

        var existing = user.Bank.Cards.FirstOrDefault(x => x.Id.ToString() == id);
        if (existing == null) return NotFound();

        existing.CardHolderName = card.CardHolderName;
        existing.CardNumber = card.CardNumber;
        existing.ExpiryDate = card.ExpiryDate;
        existing.Cvv = card.Cvv;

        await context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await postgresService.GetUserDataAsync(Request);
        if (user == null) return Unauthorized();

        var card = user.Bank.Cards.FirstOrDefault(x => x.Id.ToString() == id);
        if (card == null) return NotFound();

        user.Bank.Cards.Remove(card);
        await context.SaveChangesAsync();

        return Ok();
    }
}