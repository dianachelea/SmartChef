using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<UserInfo>> GetUserInfo(string email);
        Task<UserCredentials?> GetUserById(Guid id);
        Task<UserCredentials?> GetUserByEmail(string email);
        Task<IEnumerable<UserCredentials>> GetSubscribedUsers(Guid userId);
        Task<int> GetSubscriberCount(Guid userId);
        Task<bool> ToggleSubscribe(Guid userId, Guid targetUserId);
        Task<bool> UpdatePassword(string email, string newPassword);
        Task<IEnumerable<UserCredentials>> GetAllUsers();
        Task<bool> IsEmailTaken(string email);
        Task<bool> IsUsernameTaken(string username);
        Task<IEnumerable<UserCredentials>> GetPublicUsers(string? country = null);

    }
}
