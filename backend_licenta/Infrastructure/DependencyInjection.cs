using Microsoft.Extensions.DependencyInjection;
using Infrastructure.Handlers;
using Infrastructure.Interfaces;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Infrastructure.Utils;
using Application.Interfaces;
namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UsersRepository>();
            services.AddScoped<IDatabaseContext, DatabaseContext>();
            services.AddScoped<IIdentityHandler, IdentityHandler>();
            services.AddScoped<IPasswordHasher, PasswordHandler>(); 
            services.AddScoped<IAuthenticationRepository, AuthenticationRepository>();
            services.AddScoped<IGenerateToken, GenerateToken>();
            services.AddScoped<ILinkCreator, LinkCreator>();
            services.AddScoped<ISendNotification, SendEmailNotification>();
            services.AddScoped<IFeedbackRepository, FeedbackRepository>();
            services.AddScoped<ITokenRepository, TokensRepository>();
            services.AddScoped<IRecipeRepository, RecipeRepository>();
            services.AddScoped<IDatabaseContext, DatabaseContext>();
            return services;
        }
    }
}
