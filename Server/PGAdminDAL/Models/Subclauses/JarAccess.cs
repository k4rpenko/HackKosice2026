using System;
using System.ComponentModel.DataAnnotations;

namespace PGAdminDAL.Models.Subclauses
{
    public class JarAccess
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid JarId { get; set; }
        public Jar Jar { get; set; }

        public Guid UserId { get; set; }
        public UserModel User { get; set; }

        public string Role { get; set; }

        public bool CanDeposit { get; set; } = true;
        public bool CanWithdraw { get; set; } = false;

        public bool IsMust { get; set; } = false;
        public decimal AmountMusted { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}