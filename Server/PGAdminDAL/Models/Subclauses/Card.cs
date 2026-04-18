using System;
using System.ComponentModel.DataAnnotations;

namespace PGAdminDAL.Models.Subclauses
{
    public class Card
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public string UserId { get; set; }

        public Guid BankModelId { get; set; }
        public BankModel Bank { get; set; }

        public string CardNumber { get; set; }
        public string CardHolderName { get; set; }
        public string ExpiryDate { get; set; }
        public string? Cvv { get; set; }
        public string CardType { get; set; }
        public decimal? SpendingLimit { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsBlocked { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}