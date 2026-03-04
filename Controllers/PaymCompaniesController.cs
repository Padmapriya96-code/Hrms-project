//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using HRMSAPPLICATION.Models;

//namespace HRMSAPPLICATION.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    [AllowAnonymousJwt]
//    public class PaymCompaniesController : ControllerBase
//    {
//        private readonly HrmsystemContext _context;

//        public PaymCompaniesController(HrmsystemContext context)
//        {
//            _context = context;
//        }

//        // GET: api/PaymCompanies
//        [HttpGet]
//        public async Task<ActionResult<IEnumerable<PaymCompany>>> GetPaymCompanies()
//        {
//            return await _context.PaymCompanies.ToListAsync();
//        }

//        // GET: api/PaymCompanies/5
//        [HttpGet("{id}")]
//        public async Task<ActionResult<PaymCompany>> GetPaymCompany(int id)
//        {
//            var paymCompany = await _context.PaymCompanies.FindAsync(id);

//            if (paymCompany == null)
//            {
//                return NotFound();
//            }

//            return paymCompany;
//        }

//        // PUT: api/PaymCompanies/5
//        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
//        [HttpPut("{id}")]
//        public async Task<IActionResult> PutPaymCompany(int id, PaymCompany paymCompany)
//        {
//            if (id != paymCompany.PnCompanyId)
//            {
//                return BadRequest();
//            }

//            _context.Entry(paymCompany).State = EntityState.Modified;

//            try
//            {
//                await _context.SaveChangesAsync();
//            }
//            catch (DbUpdateConcurrencyException)
//            {
//                if (!PaymCompanyExists(id))
//                {
//                    return NotFound();
//                }
//                else
//                {
//                    throw;
//                }
//            }

//            return NoContent();
//        }

//        // POST: api/PaymCompanies
//        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
//        [HttpPost]
//        public string postPaymcompany(PaymCompany paymCompany)
//        {

//            String query = "insert into paym_Company values(" + paymCompany.PnCompanyId + ", '" + paymCompany.CompanyCode + "', '" + paymCompany.CompanyName + "', '" + paymCompany.AddressLine1 + "', '" + paymCompany.AddressLine2 + "', '" + paymCompany.City + "', '" + paymCompany.ZipCode + "', '" + paymCompany.Country + "', '" + paymCompany.State + "', '" + paymCompany.PhoneNo + "', '" + paymCompany.FaxNo + "', '" + paymCompany.EmailId + "', '" + paymCompany.AlternateEmailId + "', '" + paymCompany.StartDate + "', '" + paymCompany.EndDate + "', '" + paymCompany.CompanyUserId + "','" + paymCompany.CompanyPassword + "')";

//            var result = _context.Database.ExecuteSqlRaw(query);

//            /*

//           _context.PaymCompanies.Add(paymCompany);
//           await _context.SaveChangesAsync();

//           return CreatedAtAction("GetPaymCompany", new { id = paymCompany.PnCompanyId }, paymCompany);
//               */
//            return "company created successfully";




//        }

//        // DELETE: api/PaymCompanies/5
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeletePaymCompany(int id)
//        {
//            var paymCompany = await _context.PaymCompanies.FindAsync(id);
//            if (paymCompany == null)
//            {
//                return NotFound();
//            }

//            _context.PaymCompanies.Remove(paymCompany);
//            await _context.SaveChangesAsync();

//            return NoContent();
//        }

//        private bool PaymCompanyExists(int id)
//        {
//            return _context.PaymCompanies.Any(e => e.PnCompanyId == id);
//        }
//    }
//}
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;
using HRMSAPPLICATION.Infrastructure;
using Microsoft.AspNetCore.Authorization;
namespace HRMSAPPLICATION.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    
    public class PaymCompaniesController : ControllerBase
    {
        private readonly TenantDbContextFactory _factory;

        public PaymCompaniesController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }
        private HrmsystemContext GetTenantContext()
        {
            // ✅ SECURE: Automatically extracts dbName from the JWT "DbName" claim
            // No more Request.Headers["X-Database-Name"]
            return _factory.CreateFromUser(User);
        }

        [HttpGet]
        public async Task<IActionResult> GetCompanies()
        {
            using var context = GetTenantContext();
            var companies = await context.PaymCompanies.ToListAsync();
            return Ok(companies);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompanyById(int id)
        {
            using var context = GetTenantContext();
            var company = await context.PaymCompanies.FirstOrDefaultAsync(c => c.PnCompanyId == id);
            if (company == null)
                return NotFound();
            return Ok(company);
        }
        [HttpGet("by-user")]
        public async Task<IActionResult> GetCompanyByUser()
        {
            using var context = GetTenantContext();
            var companyUserId = User.FindFirst("CompanyUserId")?.Value;

            if (string.IsNullOrEmpty(companyUserId))
                return Unauthorized("CompanyUserId missing in token");
            var companies = await context.PaymCompanies.Where(c => c.CompanyUserId== companyUserId).Select(c => new
            {
                c.PnCompanyId,
                c.CompanyCode,
                c.CompanyName,
                c.AddressLine1,
                c.AddressLine2,
                c.City,
                c.State,
                c.Country,
                c.ZipCode,
                c.PhoneNo,
                c.FaxNo,
                c.EmailId,
                c.AlternateEmailId,
                c.StartDate,
                c.EndDate,
                c.CompanyUserId,
                c.GSTNumber,
                c.WebsiteURL,
                c.ContactPerson,
                c.CompanyLogo


            }).ToListAsync();
            Console.WriteLine($"Records found: {companies.Count}");
            return Ok(companies);
        }
        [HttpPost]
        public async Task<IActionResult> CreateCompany([FromBody] PaymCompany paymCompany)
        {
            using var context = GetTenantContext();
            await context.PaymCompanies.AddAsync(paymCompany);
            await context.SaveChangesAsync();
            return Ok (new { message = "company created successfully" });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompany(int id, [FromBody] PaymCompany model)
        {
            using var context = GetTenantContext();
           

            var company = await context.PaymCompanies
                .FirstOrDefaultAsync(x => x.PnCompanyId == id);

            if (company == null) return NotFound();
            model.PnCompanyId = id; // protect PK
            // Cleaner way to update all fields at once
            context.Entry(company).CurrentValues.SetValues(model);
            await context.SaveChangesAsync();

            return Ok(new { message = "Company updated successfully" });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompany(int id)
        {
            using var context = GetTenantContext();
            var company = await context.PaymCompanies
                .FirstOrDefaultAsync(x => x.PnCompanyId == id);

            if (company == null) return NotFound();

            context.PaymCompanies.Remove(company);
            await context.SaveChangesAsync();
            return Ok(new { message = "Company deleted successfully" });
        }
        [HttpGet("debug-claims")]
        [Authorize]
        public IActionResult DebugClaims()
        {
            var claims = User.Claims
                .Select(c => new { c.Type, c.Value })
                .ToList();

            return Ok(claims);
        }



    }

}

