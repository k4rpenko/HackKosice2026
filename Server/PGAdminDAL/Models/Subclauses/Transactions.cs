using System;
using System.ComponentModel.DataAnnotations;

namespace PGAdminDAL.Models.Subclauses
{
    public class Transaction
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public decimal Amount { get; set; }

        // (EUR, USD, etc.)
        public string Currency { get; set; } = "EUR";
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Income / Expense / Transfer
        public string Type { get; set; }

        // Pending / Completed / Failed / Reversed
        public string Status { get; set; } = "Completed";

        public Guid BankModelId { get; set; }
        public BankModel Bank { get; set; }

        public Guid? CardId { get; set; }
        public Card? Card { get; set; }

        public Guid? ToCardId { get; set; }
        public Card? ToCard { get; set; }

        public Guid? JarId { get; set; }
        public Jar? Jar { get; set; }

        // Хто ініціював транзакцію
        public Guid UserId { get; set; }
        public UserModel User { get; set; }

        public string? MerchantName { get; set; }
    }
}