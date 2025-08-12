namespace WebApiContracts
{
    public class RegisterUserCredentialsContract
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Country { get; set; }
        public bool IsPublic { get; set; }
    }
}
