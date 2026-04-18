using System;
using System.ComponentModel.DataAnnotations;

namespace PGAdminDAL.Models
{
    public class BankInformation
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Name { get; set; }
        public string Country { get; set; }

        public string IntegrationType { get; set; }

        public bool SupportsOAuth { get; set; }
        public string ApiBaseUrl { get; set; }
        public string ApiVersion { get; set; }
        public string? ClientId { get; set; }
        public string? ClientSecret { get; set; }
        public string? AuthUrl { get; set; }
        public string? TokenUrl { get; set; }
        public string? AccountsEndpoint { get; set; }
        public string? TransactionsEndpoint { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}