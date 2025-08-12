namespace Domain
{
    public class User
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string JwtToken { get; set; }
        public string Country { get; set; }
        public bool IsLoggedIn { get; set; }
        public bool IsPublic { get; set; }
    }
}
