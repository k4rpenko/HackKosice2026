using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PGAdminDAL.Models
{
    public class Service
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // назва сервісу (ZSE, water, internet, Netflix)
        [Required]
        public string Name { get; set; }

        // тип сервісу
        // Utilities / Subscription / Government / Telecom / Insurance
        public string Category { get; set; }

        // країна/регіон доступності
        public string Country { get; set; }

        // чи це регулярний платіж (як підписка)
        public bool IsRecurring { get; set; } = false;

        // періодичність (monthly, yearly, etc.)
        public string? RecurrencePeriod { get; set; }

        // середній рахунок / орієнтовна сума
        public decimal? AverageAmount { get; set; }

        // API для оплати (якщо є інтеграція)
        public string? PaymentApiUrl { get; set; }

        // чи підтримує автоматичну оплату
        public bool SupportsAutoPay { get; set; } = false;

        // чи потрібно вводити IBAN / customer id
        public bool RequiresCustomerId { get; set; } = true;


        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}