using Domain;
using System.Xml.Linq;

namespace WebApiContracts.Mappers
{
    public static class MapperToDo
    {

        public static UserCredentials MapToUserCredentials(this LoginUserCredentialsContract credentials)
        {
            return new UserCredentials
            {
                Password = credentials.Password,
                Email = credentials.Email
            };
        }
        public static UserCredentials MapToUserRegister(this RegisterUserCredentialsContract credentials)
        {
            return new UserCredentials
            {
                Username = credentials.Username,
                Country = credentials.Country,
                IsPublic = credentials.IsPublic,
                Password = credentials.Password,
                Email = credentials.Email
            };
        }

    }
}
    
