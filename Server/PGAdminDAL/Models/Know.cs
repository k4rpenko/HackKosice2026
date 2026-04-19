using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PGAdminDAL.Models
{
    public class Know
    {
        public Guid UserId { get; set; }
        public UserModel User { get; set; }

        public string Role { get; set; }

    }
}
