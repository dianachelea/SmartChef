using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    [Table("Users")]
    public class UserInfo
    {
        [Column("Id")]
        public Guid UserId { get; set; }

        [Column("Username")]
        public string Username { get; set; }
        [Column("Password")]
        public string Password { get; set; }
        [Column("Email")]
        public string Email { get; set; }
        [Column("Country")]
        public string Country { get; set; }
        [Column("IsPublic")]
        public bool IsPublic { get; set; }
    }
}
