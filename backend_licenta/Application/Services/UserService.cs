using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Application;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata.Ecma335;

namespace Application.Services
{
    public class UserService
    {
        private readonly IPasswordHasher _passwordHasher;
        private readonly IUserRepository _authenticationRepository;
        private readonly IGenerateToken _generateToken;
        private readonly ITokenRepository _tokenRepository;
        private readonly IUserRepository _usersRepository;
        private readonly NotificationService _notificationSender;
        private readonly ILinkCreator _linkCreator;

        public UserService(IPasswordHasher passwordHasher,
            IUserRepository authenticationRepository,
            IGenerateToken generateToken,
            ITokenRepository tokenRepository,
            IUserRepository usersRepository,
            NotificationService notificationSender,
            ILinkCreator linkCreator)
        {
            _passwordHasher = passwordHasher;
            _authenticationRepository = authenticationRepository;
            _generateToken = generateToken;
            _tokenRepository = tokenRepository;
            _linkCreator = linkCreator;
            _notificationSender = notificationSender;
            _usersRepository = usersRepository;
        }

        public async Task<bool> ResetPassword(string token, string password)
        {
            var validationToken = await _tokenRepository.GetToken(token);

            if (validationToken.ToList().Count == 0)
            {
                throw new Exception("Token not found!");
            }

            if (validationToken.FirstOrDefault()?.expirationDate < DateTime.Now)
            {
                throw new Exception("Token expired!");
            }

            var hashedPassword = _passwordHasher.Hash(password);
            var result = await _usersRepository.UpdatePassword(validationToken.FirstOrDefault()?.userEmail, hashedPassword);
            return result;
        }

        public async Task<bool> RecoverPassword(string email)
        {
            var userCheck = await _authenticationRepository.GetUserInfo(email);
            if(userCheck.ToList().Count==0)
            {
                throw new Exception("User is not registered!");
            }

            string token = _generateToken.GenerateToken(32);
            DateTime expiryDate = DateTime.Now.AddMinutes(60);

            var result = await _tokenRepository.AddToken(new ValidationTokenDo
            {
                userEmail = email,
                token = token,
                expirationDate = expiryDate
            });

            string link = _linkCreator.CreateLink("resetpassword?token=" + token);
            await _notificationSender.NotifyUser(email, link);
            return result;
        }
        public async Task<IEnumerable<UserCredentials>> GetAllUsers()
        {
            var users = await _usersRepository.GetAllUsers();

            return users;
        }

        public async Task<IEnumerable<UserCredentials>> GetAllPublicUsers(string country)
        {
            var users= await _usersRepository.GetPublicUsers(country);
            return users;
        }

        public async Task<bool> IsEmailTaken(string email)
        {
            var ok = await _usersRepository.IsEmailTaken(email);
            return ok;
        }

        public async Task<bool> IsUsernameTaken(string username)
        {
            var ok = await _usersRepository.IsUsernameTaken(username);
            return ok;
        }

        public async Task<UserInfo> GetUserInfo(string email)
        {
            var user = await _usersRepository.GetUserInfo(email);

            return user.FirstOrDefault();
        }
        public async Task<UserCredentials?> GetUserById(Guid userId)
        {
            return await _usersRepository.GetUserById(userId);
        }

        public async Task<UserCredentials?> GetUserByEmail(string email)
        {
            return await _usersRepository.GetUserByEmail(email);
        }

        public async Task<IEnumerable<UserCredentials>> GetSubscribedUsers(string email)
        {
            var user = await _usersRepository.GetUserByEmail(email);
            if (user == null)
            { 
                return Enumerable.Empty<UserCredentials>();
            }
            return await _usersRepository.GetSubscribedUsers(user.Id);
        }

        public async Task<int> GetSubscriberCount(Guid userId)
        {
            return await _usersRepository.GetSubscriberCount(userId);
        }

        public async Task<bool> ToggleSubscribe(string email, Guid targetUserId)
        {
            var user = await _usersRepository.GetUserByEmail(email);
            if (user == null)
            { 
                throw new Exception("User not found");
            }
            return await _usersRepository.ToggleSubscribe(user.Id, targetUserId);
        }


    }
}
