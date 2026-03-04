using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HRMSAPPLICATION.Infrastructure;
using HRMSAPPLICATION.Models;
namespace HRMSAPPLICATION.Controllers
{
    [Authorize]
    [ApiController]
    public abstract class BaseApiController:ControllerBase
    {
        protected readonly TenantDbContextFactory _factory;

        protected BaseApiController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }

        protected HrmsystemContext Db
        {
            get
            {
                return _factory.CreateFromUser(User);
            }
        }
    }
}
