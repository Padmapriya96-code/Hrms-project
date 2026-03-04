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
//    public class EmployeeLoginController : ControllerBase
//    {
//        HrmsystemContext _context;
//        private Models.TokenHandler tokenHandler;
//        public EmployeeLoginController(HrmsystemContext _context, Models.TokenHandler tokenHandler)
//        {
//            this._context = _context;
//            this.tokenHandler = tokenHandler;
//        }

//        //[HttpPost]
//        //public ActionResult Authenticate([FromBody] EmployeeLogin login)
//        //{
//        //    /* if (login.username == "admin" && login.password == "password")
//        //     {
//        //         return Ok(new { message = "Login successful" });
//        //     }
//        //     else
//        //     {
//        //         return Unauthorized(new { message = "Invalid username or password" });
//        //     }*/

//        //    var PaymEmployee = from e in _context.PaymEmployees
//        //                       where e.EmployeeCode == login.username && e.Password == login.password
//        //                       select e;
//        //    if (PaymEmployee.Any())
//        //    {

//        //        return Ok(new { message = tokenHandler.GenerateJwtToken(login.username) });
//        //    }
//        //    else
//        //    {
//        //        return Unauthorized(new { message = "Invalid username or password" });
//        //    }

//        //}

 
//        [HttpPost]
//        public async Task<IActionResult> BranchLogin([FromBody] EmployeesLoginDTO login)
//        {
//            if (login == null || string.IsNullOrWhiteSpace(login.username) || string.IsNullOrWhiteSpace(login.password))
//                return BadRequest(new { message = "Username and password are required." });

//            try
//            {
//                // 🔹 Step 1: Validate username & password together
//                var employee = await _context.userAccounts
//                    .FirstOrDefaultAsync(e => e.EmployeeUserId == login.username && e.EmployeePassword == login.password);

//                if (employee == null)
//                    return Unauthorized(new { message = "Invalid username or password." });

//                // 🔹 Step 2: Generate JWT token
//                string token = tokenHandler.GenerateJwtToken(login.username);

//                // 🔹 Step 3: Return success with database name
//                return Ok(new
//                {
//                    message = "Branch login successful.",
//                    dbname = employee.DatabaseName,
//                    token
//                });
//            }
//            catch (SqlException ex)
//            {
//                return StatusCode(500, new
//                {
//                    message = "SQL Server connection error. Please verify SQL service or credentials.",
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