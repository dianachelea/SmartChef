using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using Application.Services;
using WebApiContracts;
using WebApiContracts.Mappers;
using System.Security.Claims;
using Domain;
using Infrastructure.Interfaces;
using Dapper;
using Application.Interfaces;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly AuthorizationService _authorizationService;
        private readonly UserService _userService;
        private readonly ILogger<AuthenticationController> _logger;
        private readonly IDatabaseContext _databaseContext;
        private readonly IUserRepository _userRepository;

        public AuthenticationController(AuthorizationService authorizationService, UserService userService, ILogger<AuthenticationController> logger, IDatabaseContext databaseContext, IUserRepository userRepository)
        {
            _authorizationService = authorizationService;
            _logger = logger;
            _userService = userService;
            _databaseContext = databaseContext;
            _userRepository = userRepository;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserCredentials>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsers();
            return Ok(users);
        }
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UserCredentials>>> GetPublicUsers([FromQuery] string? country = null)
        {
            var users = await _userService.GetAllPublicUsers(country);
            return Ok(users);
        }
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<bool>> RegisterUser([FromBody] RegisterUserCredentialsContract credentialsContract)
        {
            try
            {
                var result = await _authorizationService.RegisterUser(credentialsContract.MapToUserRegister());
                return Ok(result);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Username"))
                    return Conflict("Username already exists");
                if (ex.Message.Contains("Email"))
                    return Conflict("Email already exists");

                return StatusCode(500, "Unexpected error");
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<string>> LoginUser([FromBody] LoginUserCredentialsContract credentialsContract)
        {
            var result = await this._authorizationService.LoginUser(credentialsContract.MapToUserCredentials());

            _logger.LogInformation("Logged in as user: " + result.Username);

            return Ok(result);
        }
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<bool>> CheckUsername([FromQuery] string username)
        {
            var taken = await _userService.IsUsernameTaken(username);
            return Ok(taken);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<bool>> CheckEmail([FromQuery] string email)
        {
            var taken = await _userService.IsEmailTaken(email);
            return Ok(taken);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<string>> RecoverPassword([FromQuery] string email)
        {
            var result = await this._userService.RecoverPassword(email);

            _logger.LogInformation(email + " wants to recover his password");

            return Ok(result);
        }
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<string>> ResetPassword([FromQuery] string token, [FromBody] string password)
        {
            var result = await this._userService.ResetPassword(token, password);

            _logger.LogInformation("Password reseted with succes for token: " + token);

            return Ok(result);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<string>> GetUserInfo()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email == null)
                return Forbid();

            var result = await this._userService.GetUserInfo(email);
            return Ok(result);
        }

        [HttpGet("{userId}")]
        [Authorize]
        public async Task<ActionResult<UserCredentials>> GetUserById(Guid userId)
        {
            var user = await _userService.GetUserById(userId);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpGet("{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _userService.GetUserByEmail(email);
            if (user == null) return NotFound();
            return Ok(user);
        }

    }
}