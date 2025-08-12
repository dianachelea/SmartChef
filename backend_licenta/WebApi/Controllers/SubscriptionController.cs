using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Application.Services;
using Domain;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class SubscriptionController : ControllerBase
    {
        private readonly UserService _userService;

        public SubscriptionController(UserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpPost("{targetUserId}")]
        public async Task<IActionResult> ToggleSubscribe(Guid targetUserId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var subscribed = await _userService.ToggleSubscribe(email, targetUserId);
            return Ok(new { message = subscribed ? "Subscribed" : "Unsubscribed" });
        }

        [Authorize]
        [HttpGet]
        public async Task<IEnumerable<UserCredentials>> GetSubscribedUsers()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email)) return Enumerable.Empty<UserCredentials>();

            return await _userService.GetSubscribedUsers(email);
        }

        [Authorize]
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetSubscriberCount(Guid userId)
        {
            var count = await _userService.GetSubscriberCount(userId);
            return Ok(count);
        }
    }
}
