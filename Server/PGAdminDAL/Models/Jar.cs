using PGAdminDAL.Models.Subclauses;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PGAdminDAL.Models
{
    public class Jar
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid UserId { get; set; }
        public UserModel User { get; set; }

        public string Name { get; set; }

        public decimal TargetAmount { get; set; }

        public decimal Balance { get; set; }

        public bool IsCompleted { get; set; } = false;

        public ICollection<JarAccess> AccessList { get; set; }
    
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
