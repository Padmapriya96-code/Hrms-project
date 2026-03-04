//using HRMSAPPLICATION.DTO;
//using HRMSAPPLICATION.Models;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Data.SqlClient;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;

//namespace HRMSAPPLICATION.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    [AllowAnonymousJwt]
//    public class CommonLoginController : ControllerBase
//    {
//        HrmsystemContext _context;

//        private Models.TokenHandler tokenHandler;
//        public CommonLoginController(HrmsystemContext context, Models.TokenHandler tokenHandler)
//        {
//            _context = context;
//            this.tokenHandler = tokenHandler;
//        }
//        [AllowAnonymousJwt]
//        [HttpPost]
//        public async Task<IActionResult> Login([FromBody] CommonLoginDTO login)
//        {
//            if (login == null || string.IsNullOrWhiteSpace(login.Username) || string.IsNullOrWhiteSpace(login.Password))
//                return BadRequest(new { message = "Username and Password are required." });

//            try
//            {
//                string username = login.Username.Trim();
//                string password = login.Password.Trim();

//                // 1️⃣ COMPANY LOGIN
//                var company = await _context.signups
//                    .FirstOrDefaultAsync(x => x.Username == username && x.Password == password);

//                if (company != null)
//                {
//                    string token = tokenHandler.GenerateJwtToken(username);

//                    return Ok(new
//                    {

//                        message = "Company Login Successful",
//                        database = company.DatabaseName,
//                        token
//                    });
//                }


//                // 2️⃣ BRANCH LOGIN
//                var branch = await _context.branchLogins
//                    .FirstOrDefaultAsync(x => x.BranchUserId == username && x.Password == password);

//                if (branch != null)
//                {
//                    // Check if expired
//                    if (branch.EndDate != null && DateTime.Now > branch.EndDate)
//                    {
//                        branch.Status = "Inactive";
//                        _context.branchLogins.Update(branch);
//                        await _context.SaveChangesAsync();
//                    }

//                    if (!string.Equals(branch.Status, "Active", StringComparison.OrdinalIgnoreCase))
//                    {
//                        return Unauthorized(new { message = "Branch is Inactive. Contact Admin." });
//                    }

//                    string token = tokenHandler.GenerateJwtToken(username);

//                    return Ok(new
//                    {

//                        message = "Branch Login Successful",
//                        database = branch.DBname,
//                        token
//                    });
//                }


//                // 3️⃣ EMPLOYEE LOGIN
//                var employee = await _context.employeeLogins
//                    .FirstOrDefaultAsync(x => x.EmployeeUserId == username && x.Password == password);

//                if (employee != null)
//                {
//                    string token = tokenHandler.GenerateJwtToken(username);

//                    return Ok(new
//                    {

//                        message = "Employee Login Successful",
//                        database = employee.DBname,
//                        token
//                    });
//                }


//                // 4️⃣ INVALID USER
//                return Unauthorized(new { message = "Invalid Username or Password." });
//            }
//            catch (SqlException ex)
//            {
//                return StatusCode(500, new
//                {
//                    message = "SQL Server connection error.",
//                    error = ex.Message
//                });
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new
//                {
//                    message = "Unexpected error occurred.",
//                    error = ex.Message
//                });
//            }
//        }

//    }
//}
using HRMSAPPLICATION.DTO;
using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Controllers;
//using Microsoft.IdentityModel.Tokens;

using Newtonsoft.Json.Linq;
namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymousJwt]
    public class CommonLoginController : ControllerBase
    {
        private readonly MasterDbContext _context;
        private readonly Tokenhandler _tokenHandler;
        private readonly IConfiguration _config;

        public CommonLoginController(
           MasterDbContext context,
            Tokenhandler tokenHandler,
            IConfiguration config)
        {
            _context = context;
            _tokenHandler = tokenHandler;
            _config = config;
        }

        [AllowAnonymousJwt]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] CommonLoginDTO login)
        {
            if (login == null ||
                string.IsNullOrWhiteSpace(login.Username) ||
                string.IsNullOrWhiteSpace(login.Password))
            {
                return BadRequest(new
                {
                    message = "Username and Password are required."
                });
            }

            try
            {
                string username = login.Username.Trim();
                string password = login.Password.Trim();

                /* =========================
                   1️⃣ COMPANY LOGIN (MASTER DB)
                   ========================= */
                var company = await _context.signups
                    .FirstOrDefaultAsync(x =>
                        x.Username == username &&
                        x.Password == password);

                if (company != null)
                {
                    string token = _tokenHandler.GenerateJwtToken(company.Username,company.DatabaseName??string.Empty);




                    return Ok(new
                    {
                        message = "Company Login Successful",
                        role = "Company",
                        userId=company.Id,
                        
                        
                        
                        token//no database name is sent to front end

                    });
                }

                /* =========================
                   2️⃣ BRANCH LOGIN (MASTER DB)
                   ========================= */
                var branch = await _context.branchLogins
                    .FirstOrDefaultAsync(x =>
                        x.BranchUserId == username &&
                        x.Password == password);

                if (branch != null)
                {
                    // Expiry check
                    if (branch.EndDate != null &&
                        DateTime.Now > branch.EndDate)
                    {
                        branch.Status = "Inactive";
                        _context.branchLogins.Update(branch);
                        await _context.SaveChangesAsync();
                    }

                    if (!string.Equals(branch.Status, "Active",
                        StringComparison.OrdinalIgnoreCase))
                    {
                        return Unauthorized(new
                        {
                            message = "Branch is inactive. Contact admin."
                        });
                    }

                    string token = _tokenHandler.GenerateJwtToken(
                        username, branch.DBname ?? string.Empty

                    );

                    return Ok(new
                    {
                        message = "Branch Login Successful",
                        role = "Branch",
                        
                        token
                    });
                }

                /* =========================
                   3️⃣ EMPLOYEE LOGIN (MASTER DB)
                   ========================= */
                var employee = await _context.employeeLogins
                    .FirstOrDefaultAsync(x =>
                        x.EmployeeUserId == username &&
                        x.Password == password);

                if (employee != null)
                {
                    string token = _tokenHandler.GenerateJwtToken(
                        username, employee.DBname ?? string.Empty

                    );

                    return Ok(new
                    {
                        message = "Employee Login Successful",
                        role = "Employee",
                        
                        token
                    });
                }

                /* =========================
                   4️⃣ INVALID LOGIN
                   ========================= */
                return Unauthorized(new
                {
                    message = "Invalid Username or Password."
                });
            }
            catch (SqlException ex)
            {
                return StatusCode(500, new
                {
                    message = "SQL Server connection error.",
                    error = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Unexpected error occurred.",
                    error = ex.Message
                });
            }
        }
    }
}
