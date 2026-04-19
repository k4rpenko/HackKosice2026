using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PGAdminDAL.Models
{
    public class UserLoginService
    {
        public virtual string LoginProvider { get; set; } = default!;

        public virtual string ProviderKey { get; set; } = default!;
        public virtual string? ProviderDisplayName { get; set; }
        public virtual Guid UserId { get; set; } = default!;
    }
}
