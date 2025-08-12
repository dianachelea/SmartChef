using Application.Interfaces;
using Domain;
using System.Security.Claims;

namespace Application.Services
{
    public class AuthorizationService
    {
        private readonly IPasswordHasher _passwordHasher;
        private readonly IAuthenticationRepository _authenticationRepository;
        private readonly IIdentityHandler _identityHandler;
        private readonly IUserRepository _userRepository;

        public AuthorizationService(
            IPasswordHasher passwordHasher,
            IAuthenticationRepository authenticationRepository,
            IIdentityHandler identityHandler,
            IUserRepository userRepository)
        {
            _passwordHasher = passwordHasher;
            _identityHandler = identityHandler;
            _authenticationRepository = authenticationRepository;
            _userRepository = userRepository;
        }

        public async Task<User> LoginUser(UserCredentials credentials)
        {
            var userHashed = await this._authenticationRepository.GetUser(credentials.Email);

            var user = userHashed.FirstOrDefault();
            if (user == null || !_passwordHasher.Verify(user.Password, credentials.Password))
            {
                throw new Exception("Username or password are incorrect");
            }

            var result = new User
            {
                Username = user.Username,
                Email = user.Email,
                IsLoggedIn = true, 
            };

            var jwtToken = this._identityHandler.GenerateToken(result);
            result.JwtToken = jwtToken;

            return result;
        }
        public async Task<bool> RegisterUser(UserCredentials credentials)
        {
            if (await _userRepository.IsUsernameTaken(credentials.Username))
                throw new Exception("Username already exists");

            if (await _userRepository.IsEmailTaken(credentials.Email))
                throw new Exception("Email already exists");

            var hashedPassword = _passwordHasher.Hash(credentials.Password);

            var registerResult = await _authenticationRepository.RegisterUser(new UserCredentials
            {
                Username = credentials.Username,
                Password = hashedPassword,
                Email = credentials.Email,
                Country = credentials.Country,
                IsPublic = credentials.IsPublic,
            });

            return registerResult;
        }

    }
}
