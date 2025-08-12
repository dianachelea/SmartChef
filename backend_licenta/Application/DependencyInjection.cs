using Microsoft.Extensions.DependencyInjection;

using Application.Services;
using Application.Interfaces;

namespace Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<AuthorizationService>();
            services.AddScoped<IYoloService, YoloService>();
            services.AddScoped<FeedbackService>();
            services.AddScoped<NotificationService>();
            services.AddScoped<UserService>();
            services.AddScoped<RecipeService>();

            return services;
        }
    }
}
