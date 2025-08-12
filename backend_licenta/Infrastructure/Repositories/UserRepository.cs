using Dapper;
using System.Data;

using Application.Interfaces;
using Domain;
using Infrastructure.Interfaces;

namespace Infrastructure.Repositories
{
    public class UsersRepository : IUserRepository
    {
        private readonly IDatabaseContext _databaseContext;

        public UsersRepository(IDatabaseContext databaseContext)
        {
            this._databaseContext = databaseContext;
        }

        public Task<IEnumerable<UserInfo>> GetUserInfo(string email)
        {
            var sql = @"SELECT [Id], [Username], [Email], [Country], [IsPublic] FROM [Licenta].[Users] WHERE [Email] = @Email";

            var connection = _databaseContext.GetDbConnection();
            var users = connection.QueryAsync<UserInfo>(sql, new { Email = email });
            return users;
        }

        public async Task<bool> RegisterUser(UserCredentials credentials)
        {
            var query = "INSERT INTO [Licenta].[Users] ([Username], [Password], [Email], [Country], [IsPublic]) VALUES (@Username, @Password, @Email, @Country, @IsPublic)";
            var parameters = new DynamicParameters();
            parameters.Add("Username", credentials.Username, DbType.String);
            parameters.Add("Password", credentials.Password, DbType.String);
            parameters.Add("Email", credentials.Email, DbType.String);
            parameters.Add("Country", credentials.Country, DbType.String);
            parameters.Add("IsPublic", credentials.IsPublic, DbType.Boolean);

            var connection = _databaseContext.GetDbConnection();
            var result = await connection.ExecuteAsync(query, parameters, _databaseContext.GetDbTransaction());
            return result != 0;
        }

        public async Task<bool> UpdatePassword(string email, string newPassword)
        {
            var sql = "UPDATE [Licenta].[Users] SET [Password] = @Password WHERE [Email] = @Email";

            var connection = _databaseContext.GetDbConnection();

            var parameters = new DynamicParameters();
            parameters.Add("Password", newPassword, DbType.String);
            parameters.Add("Email", email, DbType.String);

            var result = await connection.ExecuteAsync(sql, parameters, _databaseContext.GetDbTransaction());
            return result != 0;
        }

        public Task<IEnumerable<UserCredentials>> GetAllUsers()
        {
            var sql = "SELECT [Username], [Email], [Country] FROM [Licenta].[Users]";

            var connection = _databaseContext.GetDbConnection();
            var users = connection.QueryAsync<UserCredentials>(sql);
            return users;
        }

        public async Task<IEnumerable<UserCredentials>> GetPublicUsers(string? country = null)
        {
            var connection = _databaseContext.GetDbConnection();

            var sql = @"SELECT [Id], [Username], [Email], [Country]FROM [Licenta].[Users] WHERE IsPublic = 1";

            if (!string.IsNullOrEmpty(country))
            {
                sql += " AND Country = @Country";
                return await connection.QueryAsync<UserCredentials>(sql, new { Country = country });
            }

            return await connection.QueryAsync<UserCredentials>(sql);
        }

        public async Task<bool> IsUsernameTaken(string username)
        {
            var sql = "SELECT COUNT(1) FROM [Licenta].[Users] WHERE Username = @Username";
            var connection = _databaseContext.GetDbConnection();
            var count = await connection.ExecuteScalarAsync<int>(sql, new { Username = username });
            return count > 0;
        }

        public async Task<bool> IsEmailTaken(string email)
        {
            var sql = "SELECT COUNT(1) FROM [Licenta].[Users] WHERE Email = @Email";
            var connection = _databaseContext.GetDbConnection();
            var count = await connection.ExecuteScalarAsync<int>(sql, new { Email = email });
            return count > 0;
        }

        public async Task<UserCredentials?> GetUserById(Guid userId)
        {
            var sql = "SELECT Id, Username, Email, Country FROM [Licenta].[Users] WHERE Id=@UserId and IsPublic=1";
            var connection = _databaseContext.GetDbConnection();
            return await connection.QueryFirstOrDefaultAsync<UserCredentials>(sql, new { UserId = userId });
        }

        public async Task<UserCredentials?> GetUserByEmail(string email)
        {
            var sql = "SELECT Id, Username, Email, Country FROM [Licenta].[Users] WHERE Email=@Email";
            var connection = _databaseContext.GetDbConnection();
            return await connection.QueryFirstOrDefaultAsync<UserCredentials>(sql, new { Email = email });
        }

        public async Task<IEnumerable<UserCredentials>> GetSubscribedUsers(Guid userId)
        {
            var sql = @"SELECT u.Id, u.Username, u.Email, u.Country
                FROM Licenta.Users u
                JOIN Licenta.Subscriptions s ON u.Id = s.UserId2
                WHERE s.UserId1 = @Current";
            var connection = _databaseContext.GetDbConnection();
            return await connection.QueryAsync<UserCredentials>(sql, new { Current = userId });
        }

        public async Task<int> GetSubscriberCount(Guid userId)
        {
            var sql = "SELECT COUNT(*) FROM Licenta.Subscriptions WHERE UserId2 = @Target";
            var connection = _databaseContext.GetDbConnection();
            return await connection.ExecuteScalarAsync<int>(sql, new { Target = userId });
        }

        public async Task<bool> ToggleSubscribe(Guid userId, Guid targetUserId)
        {
            var connection = _databaseContext.GetDbConnection();
            var sqlCheck = "SELECT COUNT(*) FROM Licenta.Subscriptions WHERE UserId1 = @Current AND UserId2 = @Target";
            var count = await connection.ExecuteScalarAsync<int>(sqlCheck, new { Current = userId, Target = targetUserId });

            if (count > 0)
            {
                var sqlDelete = "DELETE FROM Licenta.Subscriptions WHERE UserId1 = @Current AND UserId2 = @Target";
                await connection.ExecuteAsync(sqlDelete, new { Current = userId, Target = targetUserId });
                return false; 
            }
            else
            {
                var sqlInsert = "INSERT INTO Licenta.Subscriptions (UserId1, UserId2) VALUES (@Current, @Target)";
                await connection.ExecuteAsync(sqlInsert, new { Current = userId, Target = targetUserId });
                return true; 
            }
        }

    }
}