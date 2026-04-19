using PGAdminDAL.Models;
using PGAdminDAL.Models.Subclauses;
using System.ComponentModel.DataAnnotations;

public class BankModel
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }
    public UserModel User { get; set; }

    public Guid BankInformationId { get; set; }
    public BankInformation BankInformation { get; set; }

    public ICollection<Card> Cards { get; set; } = new List<Card>();
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}