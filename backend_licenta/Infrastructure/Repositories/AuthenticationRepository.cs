using Dapper;
using System.Data;

using Application.Interfaces;
using Domain;
using Infrastructure.Interfaces;

namespace Infrastructure.Repositories
{
    public class AuthenticationRepository : IAuthenticationRepository
    {
        private readonly IDatabaseContext _databaseContext;

        public AuthenticationRepository(IDatabaseContext databaseContext)
        {
            this._databaseContext = databaseContext;
        }

        public Task<IEnumerable<UserCredentials>> GetUser(string email)
        {
            var sql = @"SELECT [Username], [Password], [Email], [Country], [IsPublic] 
                        FROM [Licenta].[Users] 
                        WHERE [Email] = @Email";

            var connection = _databaseContext.GetDbConnection();
            return connection.QueryAsync<UserCredentials>(sql, new { Email = email });
        }

        public async Task<bool> RegisterUser(UserCredentials credentials)
        {

            var query = @"INSERT INTO [Licenta].[Users] ([Username], [Password], [Email], [Country], [IsPublic]) 
                        VALUES (@Username, @Password, @Email, @Country, @IsPublic)";

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
    }
}
