using System.ComponentModel.DataAnnotations.Schema;

namespace Domain
{
    [Table("Users")]
    public class UserCredentials
    {
        [Column("Id")]
        public Guid Id { get; set; }
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
