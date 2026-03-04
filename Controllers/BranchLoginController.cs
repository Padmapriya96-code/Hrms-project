//using HRMSAPPLICATION.DTO;
//using HRMSAPPLICATION.Models;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Data.SqlClient;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;

//namespace HRMSAPPLICATION.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    [AllowAnonymousJwt]
//    public class BranchLoginController : ControllerBase
//    {
//        HrmsystemContext _context;
      
//        private Models.TokenHandler tokenHandler;
//        public BranchLoginController(HrmsystemContext context,Models.TokenHandler tokenHandler )
//        {
//            _context = context;
//            this.tokenHandler = tokenHandler;
//        }
       
        



//        [HttpPost]
//        public async Task<IActionResult> BranchLogin([FromBody] BranchDTO login)
//        {
//            if (login == null || string.IsNullOrWhiteSpace(login.username) || string.IsNullOrWhiteSpace(login.Password))
//                return BadRequest(new { message = "Username and password are required." });

//            try
//            {
//                DateTime currentDate = DateTime.Now;

//                // 🔹 Step 1: Validate branch user credentials
//                var paymBranch = await _context.userAccounts
//                    .FirstOrDefaultAsync(e => e.BranchUserId == login.username && e.BranchPassword == login.Password);

//                if (paymBranch == null)
//                    return Unauthorized(new { message = "Invalid username or password." });

//                // 🔹 Step 2: Check if EndDate has passed → set inactive
//                if (paymBranch.EndDate != null && currentDate > paymBranch.EndDate)
//                {
//                    paymBranch.Status = "Inactive";
//                    _context.userAccounts.Update(paymBranch);
//                    await _context.SaveChangesAsync();
//                }

//                // 🔹 Step 3: Allow login only if branch is active
//                if (paymBranch.Status == "Active")
//                {
//                    // ✅ Generate JWT token
//                    string token = tokenHandler.GenerateJwtToken(login.username);

//                    return Ok(new
//                    {
//                        message = "Branch login successful.",
//                        dbname = paymBranch.DatabaseName,
//                        token
//                    });
//                }
//                else
//                {
//                    return Unauthorized(new { message = "Branch is inactive. Please contact admin." });
//                }
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
