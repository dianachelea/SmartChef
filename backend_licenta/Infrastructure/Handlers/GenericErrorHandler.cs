using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Handlers
{
    public class GenericErrorHandler: IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            await httpContext.Response.WriteAsync("Generic error message: " + exception);
            return true;
        }
    }
}
