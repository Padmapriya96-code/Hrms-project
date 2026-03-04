////using HRMSAPPLICATION.DTO;
////using HRMSAPPLICATION.Models;
////using Microsoft.AspNetCore.Mvc;
////using Microsoft.Data.SqlClient;
////using Microsoft.EntityFrameworkCore;
////using Microsoft.IdentityModel.Tokens;
////using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
////using System.Linq;

////namespace HRMSAPPLICATION.Controllers
////{
////    [Route("api/[controller]")]
////    [ApiController]
////    [AllowAnonymousJwt]

////    public class CompanyLoginController : ControllerBase
////    {
////        private readonly HrmsystemContext _context;
////        private Models.TokenHandler tokenHandler;

////        public CompanyLoginController(HrmsystemContext context, Models.TokenHandler tokenHandler)
////        {
////            _context = context;
////            this.tokenHandler = tokenHandler;
////        }


////        [HttpPost]
////        public async Task<IActionResult> Login([FromBody]  companydto model)
////        {
////            if (model == null || string.IsNullOrWhiteSpace(model.username) || string.IsNullOrWhiteSpace(model.password))
////                return BadRequest(new { message = "Username and password are required." });

////            try
////            {

////                var user = await _context.userAccounts
////                    .FirstOrDefaultAsync(x => x.Username == model.username && x.Password == model.password);

////                if (user == null)
////                    return Unauthorized(new { message = "Invalid username or password." });

////                string databaseName = user.DatabaseName?.Trim();
////                if (string.IsNullOrEmpty(databaseName))
////                    return BadRequest(new { message = "Database name not assigned for this user. Contact admin." });


////                string masterConn = _context.Database.GetConnectionString();

////                bool dbExists = false;
////                using (var connection = new SqlConnection(masterConn))
////                {
////                    await connection.OpenAsync();

////                    string checkDbQuery = @"
////                SELECT COUNT(*)  FROM userAccounts WHERE DatabaseName = @DbName";

////                    using (var cmd = new SqlCommand(checkDbQuery, connection))
////                    {
////                        cmd.Parameters.AddWithValue("@DbName", databaseName);
////                        var result = await cmd.ExecuteScalarAsync();
////                        dbExists = Convert.ToInt32(result) > 0;
////                    }
////                }


////                if (!dbExists)
////                {
////                    return BadRequest(new
////                    {
////                        message = $"Database '{databaseName}' not found for user '{model.username}'. Please contact admin."
////                    });
////                }
////                string token = tokenHandler.GenerateJwtToken(model.username);

////                return Ok(new
////                {
////                    message = "Login successful.",
////                    database = databaseName,
////                    token

////                });
////            }
////            catch (SqlException ex)
////            {
////                return StatusCode(500, new
////                {
////                    message = "SQL Server connection error. Please verify SQL service or credentials.",
////                    error = ex.Message
////                });
////            }
////            catch (Exception ex)
////            {
////                return StatusCode(500, new
////                {
////                    message = "Unexpected error occurred.",
////                    error = ex.Message
////                });
////            }
////        }


////    }
////}
//using HRMSAPPLICATION.DTO;
//using HRMSAPPLICATION.Models;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Data.SqlClient;
//using Microsoft.EntityFrameworkCore;
//using HRMSAPPLICATION.Services;
//namespace HRMSAPPLICATION.Controllers
//{
//    [ApiController]
//    [Route("api/companylogin")]
//    [AllowAnonymousJwt]
//    public class CompanyLoginController : ControllerBase
//    {
//        private readonly MasterDbContext _masterDb;
//        private readonly TokenHandler _tokenHandler;

//        public CompanyLoginController(
//            MasterDbContext masterDb,
//            TokenHandler tokenHandler)
//        {
//            _masterDb = masterDb;
//            _tokenHandler = tokenHandler;
//        }

//        [HttpPost]
//        public async Task<IActionResult> Login([FromBody] companydto model)
//        {
//            if (model == null ||
//                string.IsNullOrWhiteSpace(model.username) ||
//                string.IsNullOrWhiteSpace(model.password))
//            {
//                return BadRequest(new { message = "Username and password are required." });
//            }

//            // 🔐 Authenticate against MASTER DB
//            var user = await _masterDb.signups
//                .FirstOrDefaultAsync(x =>
//                    x.Username == model.username &&
//                    x.Password == model.password);

//            if (user == null)
//                return Unauthorized(new { message = "Invalid username or password." });

//            if (string.IsNullOrEmpty(user.DatabaseName))
//                return BadRequest(new { message = "Tenant database not assigned." });

//            // ✅ Generate JWT with tenant info
//            // ✅ JWT = identity only
//            string token = _tokenHandler.GenerateJwtToken(user.Username);

                
           

//            return Ok(new
//            {
//                message = "Login successful",
//                token
//            });
//        }

//    }
//}

