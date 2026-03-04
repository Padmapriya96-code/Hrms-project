using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Controllers;

namespace HRMSAPPLICATION.Models
{
    public class AuthFilter : ActionFilterAttribute
    {
        
        
     //   private TokenHandler tokenHandler;
     //public   AuthFilter(TokenHandler tokenHandler)
     //   {
          
     //       this.tokenHandler=tokenHandler;
     //   }
        public override void OnActionExecuted(ActionExecutedContext context)
        {
        
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var descriptor = context.ActionDescriptor as ControllerActionDescriptor;

            // 1️⃣ Allow endpoints marked with [AllowAnonymous] or [AllowAnonymousJwt]
            var allowAnonymous =
                descriptor?.ControllerTypeInfo
                    .GetCustomAttributes(typeof(AllowAnonymousAttribute), true).Any() == true
                || descriptor?.MethodInfo
                    .GetCustomAttributes(typeof(AllowAnonymousAttribute), true).Any() == true
                || descriptor?.ControllerTypeInfo
                    .GetCustomAttributes(typeof(AllowAnonymousJwtAttribute), true).Any() == true
                || descriptor?.MethodInfo
                    .GetCustomAttributes(typeof(AllowAnonymousJwtAttribute), true).Any() == true;

            if (allowAnonymous)
                return;

            // 2️⃣ Check authentication result from JWT middleware
            var user = context.HttpContext.User;

            if (user?.Identity == null || !user.Identity.IsAuthenticated)
            {
                context.Result = new JsonResult(new
                {
                    error = "Unauthorized",
                    message = "JWT token is missing or invalid"
                })
                {
                    StatusCode = StatusCodes.Status401Unauthorized
                };
            }
        }
        

    }
}
