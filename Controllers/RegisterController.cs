//using HRMSAPPLICATION.Models;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Data.SqlClient;
//using Microsoft.EntityFrameworkCore;
//using System.Linq;
//using HRMSAPPLICATION.DTO;
//using System.Threading.Tasks;

//namespace HRMSAPPLICATION.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    [AllowAnonymousJwt]
//    public class RegisterController : ControllerBase
//    {
//        private readonly HrmsystemContext _context;

//        public RegisterController(HrmsystemContext context)
//        {
//            _context = context;
//        }

//        [HttpPost("RegisterWithCompany")]
//        public async Task<IActionResult> RegisterWithCompany([FromBody] RegisterWithCompanyDTO model)
//        {
//            // Check for existing username or email
//            if (_context.Registers.Any(x => x.Username == model.RegisterUser.Username))
//            {
//                return BadRequest(new { message = "Username already exists" });
//            }

//            if (_context.Registers.Any(x => x.Email == model.RegisterUser.Email))
//            {
//                return BadRequest(new { message = "Email already exists" });
//            }

//            if (_context.PaymCompanies.Any(x => x.CompanyUserId == model.CompanyInfo.CompanyUserId))
//            {
//                return BadRequest(new { message = "Company User ID already exists" });
//            }

//            using (var transaction = await _context.Database.BeginTransactionAsync())
//            {
//                try
//                {
//                    // Save company
//                    _context.PaymCompanies.Add(model.CompanyInfo);
//                    await _context.SaveChangesAsync();

//                    // Optionally set foreign key in user if needed (e.g., CompanyId)
//                    // model.RegisterUser.PnCompanyId = model.CompanyInfo.PnCompanyId;

//                    // Save user
//                    _context.Registers.Add(model.RegisterUser);
//                    await _context.SaveChangesAsync();

//                    await transaction.CommitAsync();
//                    return Ok(new { message = "registered successfully" });
//                }
//                catch (Exception ex)
//                {
//                    await transaction.RollbackAsync();
//                    return StatusCode(500, new { message = "Registration failed", error = ex.Message });
//                }
//            }
//        }



//            [AllowAnonymousJwt]
//            [HttpPost("Register")]



//        public async Task<IActionResult> Register([FromBody] signupDTO model)
//        {
//            if (model == null)
//                return BadRequest("Invalid data.");

//            // 1️⃣ Check if username exists
//            //if (await _context.signups.AnyAsync(u => u.Username == model.Username))
//            //    return BadRequest(new { message = "Username already exists." });

//            // 2️⃣ Generate auto-increment DB Name
//            string newDbName = await GenerateNextDbName(model.CompanyName);

//            using var transaction = await _context.Database.BeginTransactionAsync();
//            try
//            {
//                // Insert master table
//                var masterUser = new signup
//                {
//                    Username = model.Username,
//                    Password = model.Password,
//                    DatabaseName = newDbName
//                };
//                _context.signups.Add(masterUser);
//                await _context.SaveChangesAsync();
//                await transaction.CommitAsync();

//                // Create DB
//                string masterConn = _context.Database.GetConnectionString();
//                using (var connection = new SqlConnection(masterConn))
//                {
//                    await connection.OpenAsync();
//                    string createDbQuery = $"CREATE DATABASE [{newDbName}]";
//                    using (var command = new SqlCommand(createDbQuery, connection))
//                    {
//                        await command.ExecuteNonQueryAsync();
//                    }
//                }

//                // Schema load logic unchanged
//                string scriptPath = Path.Combine(Directory.GetCurrentDirectory(), "Scricpt", "SCRIPT_SQL.sql");
//                if (!System.IO.File.Exists(scriptPath))
//                    return BadRequest(new { message = "Schema script not found in Script folder." });

//                string scriptContent = await System.IO.File.ReadAllTextAsync(scriptPath);

//                // Build tenant connection string
//                var builder = new SqlConnectionStringBuilder(masterConn)
//                {
//                    InitialCatalog = newDbName
//                };
//                string tenantConn = builder.ConnectionString;

//                // Execute schema
//                using (var schemaConn = new SqlConnection(tenantConn))
//                {
//                    await schemaConn.OpenAsync();
//                    var commands = scriptContent.Split(new[] { "GO" }, StringSplitOptions.RemoveEmptyEntries);
//                    foreach (var cmdText in commands)
//                    {
//                        using (var cmd = new SqlCommand(cmdText, schemaConn))
//                        {
//                            await cmd.ExecuteNonQueryAsync();
//                        }
//                    }
//                }

//                // Insert tenant data
//                using (var dbConnection = new SqlConnection(tenantConn))
//                {
//                    await dbConnection.OpenAsync();

//                    string insertCompany = @"
//             INSERT INTO paym_Company (CompanyName, Phone_No, Email_Id, Company_User_Id, Company_Password,Address_Line1)
//             VALUES (@CompanyName, @PhoneNumber, @Email, @Username, @Password,@Address)";
//                    using (var companyCmd = new SqlCommand(insertCompany, dbConnection))
//                    {
//                        companyCmd.Parameters.AddWithValue("@CompanyName", model.CompanyName ?? (object)DBNull.Value);
//                        companyCmd.Parameters.AddWithValue("@PhoneNumber", model.PhoneNumber ?? (object)DBNull.Value);
//                        companyCmd.Parameters.AddWithValue("@Email", model.Email ?? (object)DBNull.Value);
//                        companyCmd.Parameters.AddWithValue("@Username", model.Username ?? (object)DBNull.Value);
//                        companyCmd.Parameters.AddWithValue("@Password", model.Password ?? (object)DBNull.Value);
//                        companyCmd.Parameters.AddWithValue("@Address", model.Address ?? (object)DBNull.Value);
//                        await companyCmd.ExecuteNonQueryAsync();
//                    }

//                    string insertRegister = @"
//             INSERT INTO Register (CompanyName, Email, Username, Passwordhash, MobileNumber, Address, CreatedAt, IsActive)
//             VALUES (@CompanyName, @Email, @Username, @Passwordhash, @MobileNumber, @Address, GETDATE(), 1)";
//                    using (var regCmd = new SqlCommand(insertRegister, dbConnection))
//                    {
//                        regCmd.Parameters.AddWithValue("@CompanyName", model.CompanyName ?? (object)DBNull.Value);
//                        regCmd.Parameters.AddWithValue("@Email", model.Email ?? (object)DBNull.Value);
//                        regCmd.Parameters.AddWithValue("@Username", model.Username ?? (object)DBNull.Value);
//                        regCmd.Parameters.AddWithValue("@Passwordhash", model.Password ?? (object)DBNull.Value);
//                        regCmd.Parameters.AddWithValue("@MobileNumber", model.PhoneNumber ?? (object)DBNull.Value);
//                        regCmd.Parameters.AddWithValue("@Address", model.Address ?? (object)DBNull.Value);
//                        await regCmd.ExecuteNonQueryAsync();
//                    }
//                }

//                return Ok(new
//                {
//                    message = $"Signup successful! Database '{newDbName}' created.",
//                    database = newDbName
//                });
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = "Error occurred.", error = ex.Message });
//            }
//        }
//        private async Task<string> GenerateNextDbName(string companyName)
//        {
//            // Get all DB names that start with HRMS_
//            var dbNames = await _context.signups
//                .Where(x => x.DatabaseName.StartsWith("HRMS_"))
//                .Select(x => x.DatabaseName)
//                .ToListAsync();

//            int nextNumber = 1;

//            if (dbNames.Any())
//            {
//                // Extract number between HRMS_001_
//                var numbers = dbNames.Select(name =>
//                {
//                    var parts = name.Split('_'); // HRMS | 001 | CTS
//                    if (parts.Length >= 3 && int.TryParse(parts[1], out int num))
//                        return num;
//                    return 0;
//                });

//                nextNumber = numbers.Max() + 1;
//            }

//            string padded = nextNumber.ToString("D3"); // 001, 002, 003…

//            // Clean company name -> remove spaces
//            string cleanCompany = companyName.Replace(" ", "");

//            return $"HRMS_{padded}_{cleanCompany}";
//        }
//    }

//    }
using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using HRMSAPPLICATION.DTO;
using System.Threading.Tasks;
using HRMSAPPLICATION.Infrastructure;

namespace HRMSAPPLICATION.Controllers
{
    [ApiController]
    [Route("api/register")]
    [AllowAnonymousJwt]
    public class RegisterController : ControllerBase
    {
        private readonly MasterDbContext _masterDb;
        private readonly TenantDbContextFactory _tenantFactory;
        private readonly IWebHostEnvironment _env;
        public RegisterController(
            MasterDbContext masterDb,
            TenantDbContextFactory tenantFactory,
            IWebHostEnvironment env)
        {
            _masterDb = masterDb;
            _tenantFactory = tenantFactory;
            _env = env;
        }

        [HttpPost]
        public async Task<IActionResult> Register(signupDTO model)
        {
            // 1️⃣ Check username in MASTER DB
            if (await _masterDb.signups.AnyAsync(x => x.Username == model.Username))
                return BadRequest("Username already exists");

            // 2️⃣ Generate tenant DB name
            string dbName = await GenerateNextDbName(model.CompanyName);

            // 3️⃣ Save to MASTER DB
            _masterDb.signups.Add(new signup
            {
                Username = model.Username,
                Password = model.Password,
                DatabaseName = dbName
            });

            await _masterDb.SaveChangesAsync();

            // 4️⃣ Create database
            await CreateTenantDatabase(dbName);

            // 5️⃣ Load schema
            await ExecuteSchema(dbName);

            // 6️⃣ Insert tenant data via EF (NO RAW SQL)
            using var tenantDb = _tenantFactory.Create(dbName);

            tenantDb.PaymCompanies.Add(new PaymCompany
            {
                CompanyName = model.CompanyName,
                CompanyUserId = model.Username,
                CompanyPassword = model.Password,
                EmailId = model.Email,
                PhoneNo = model.PhoneNumber,
                AddressLine1 = model.Address
            });

            await tenantDb.SaveChangesAsync();

            return Ok(new
            {
                message = "Registration successful",
                database = dbName
            });
        }
        private async Task CreateTenantDatabase(string dbName)
        {
            var conn = _masterDb.Database.GetConnectionString();
            using var sql = new SqlConnection(conn);
            await sql.OpenAsync();

            using var cmd = new SqlCommand($"CREATE DATABASE [{dbName}]", sql);
            await cmd.ExecuteNonQueryAsync();
        }

        private async Task ExecuteSchema(string dbName)
        {
            var baseConn = _masterDb.Database.GetConnectionString();
            var builder = new SqlConnectionStringBuilder(baseConn)
            {
                InitialCatalog = dbName
            };

            
            var scriptPath = Path.Combine(
    _env.ContentRootPath,
    "Script",
    "SCRIPT_SQL.sql"
);

            if (!System.IO.File.Exists(scriptPath))
            {
                throw new FileNotFoundException($"SQL script not found at: {scriptPath}");
            }

            var script = await System.IO.File.ReadAllTextAsync(scriptPath);


            using var conn = new SqlConnection(builder.ConnectionString);
            await conn.OpenAsync();

            foreach (var cmdText in script.Split("GO"))
            {
                using var cmd = new SqlCommand(cmdText, conn);
                await cmd.ExecuteNonQueryAsync();
            }
        }

        private async Task<string> GenerateNextDbName(string companyName)
        {
            var numbers = await _masterDb.signups
                .Where(x => x.DatabaseName.StartsWith("HRMS_"))
                .Select(x => x.DatabaseName)
                .ToListAsync();

            int next = numbers
                .Select(n => int.TryParse(n.Split('_')[1], out int v) ? v : 0)
                .DefaultIfEmpty(0)
                .Max() + 1;

            return $"HRMS_{next:D3}_{companyName.Replace(" ", "")}";
        }


    }
}
