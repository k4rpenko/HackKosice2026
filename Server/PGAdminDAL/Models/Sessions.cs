using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PGAdminDAL.Models
{
    public class Sessions
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        public string DeviceInfo { get; set; }
        public string IPAddress { get; set; }
        public string KeyHash { get; set; }
        public string Salt { get; set; }

        public DateTime LoginTime { get; set; }

        [ForeignKey("UserId")]
        public virtual UserModel User { get; set; }
    }
}
