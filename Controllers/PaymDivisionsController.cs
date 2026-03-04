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
//    public class PaymDivisionsController : ControllerBase
//    {
//        private readonly HrmsystemContext _context;

//        public PaymDivisionsController(HrmsystemContext context)
//        {
//            _context = context;
//        }

//        // GET: api/PaymDivisions
//        [HttpGet]
//        public async Task<ActionResult<IEnumerable<PaymDivision>>> GetPaymDivisions()
//        {
//            return await _context.PaymDivisions.ToListAsync();
//        }

//        // GET: api/PaymDivisions/5
//        [HttpGet("{id}")]
//        public async Task<ActionResult<PaymDivision>> GetPaymDivision(int id)
//        {
//            var paymDivision = await _context.PaymDivisions.FindAsync(id);

//            if (paymDivision == null)
//            {
//                return NotFound();
//            }

//            return paymDivision;
//        }

//        // PUT: api/PaymDivisions/5
//        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
//        [HttpPut("{id}")]
//        public async Task<IActionResult> PutPaymDivision(int id, PaymDivision paymDivision)
//        {
//            if (id != paymDivision.PnCompanyId)
//            {
//                return BadRequest();
//            }

//            _context.Entry(paymDivision).State = EntityState.Modified;

//            try
//            {
//                await _context.SaveChangesAsync();
//            }
//            catch (DbUpdateConcurrencyException)
//            {
//                if (!PaymDivisionExists(id))
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

//        // POST: api/PaymDivisions
//        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
//        [HttpPost]
//        public async Task<ActionResult<PaymDivision>> PostPaymDivision(PaymDivision paymDivision)
//        {
//            _context.PaymDivisions.Add(paymDivision);
//            try
//            {
//                await _context.SaveChangesAsync();
//            }
//            catch (DbUpdateException)
//            {
//                if (PaymDivisionExists(paymDivision.PnCompanyId))
//                {
//                    return Conflict();
//                }
//                else
//                {
//                    throw;
//                }
//            }

//            return CreatedAtAction("GetPaymDivision", new { id = paymDivision.PnCompanyId }, paymDivision);
//        }

//        // DELETE: api/PaymDivisions/5
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeletePaymDivision(int id)
//        {
//            var paymDivision = await _context.PaymDivisions.FindAsync(id);
//            if (paymDivision == null)
//            {
//                return NotFound();
//            }

//            _context.PaymDivisions.Remove(paymDivision);
//            await _context.SaveChangesAsync();

//            return NoContent();
//        }

//        private bool PaymDivisionExists(int id)
//        {
//            return _context.PaymDivisions.Any(e => e.PnCompanyId == id);
//        }
//    }
//}
using HRMSAPPLICATION.Controllers;
using HRMSAPPLICATION.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;
using HRMSAPPLICATION.DTO;
using Microsoft.AspNetCore.Authorization;
namespace HRMSAPPLICATION.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PaymDivisionsController : ControllerBase
    {
        private readonly TenantDbContextFactory _factory;

        public PaymDivisionsController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }

        // ✅ SAME tenant resolution logic as Companies controller
        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);
        }

        [HttpGet("by-company/{companyId}")]
        public async Task<IActionResult> GetByCompany(int companyId)
        {
            using var context = GetTenantContext();
            var divisions = await context.PaymDivisions
                .Where(d => d.PnCompanyId == companyId)
                .ToListAsync();

            return Ok(divisions);
        }
        [HttpPost]
        public async Task<IActionResult> CreateDivision([FromBody] PaymDivision division)
        {
            using var context = GetTenantContext();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (division.PnCompanyId <= 0) return BadRequest("CompanyID is required");
            context.PaymDivisions.Add(division);
            await context.SaveChangesAsync();
            return Ok(new { message = "Division created successfully", division.PnDivisionId });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDivision(
        int id,
        [FromBody] PaymDivisionUpdateDto dto)
        {
            using var context = GetTenantContext();

            var existing = await context.PaymDivisions
                .Where(d => d.PnDivisionId == id)
                .Select(d => new PaymDivision
                {
                    PnCompanyId = d.PnCompanyId,
                    BranchId = d.BranchId,
                    VDivisionName = d.VDivisionName
                })
                .FirstOrDefaultAsync();

            if (existing == null)
                return NotFound();

            // attach with FULL composite key
            context.Attach(existing);

            existing.Status = dto.Status;

            context.Entry(existing).Property(x => x.Status).IsModified = true;

            await context.SaveChangesAsync();

            return Ok(new { message = "Division updated successfully" });
        }


        [HttpPost("bulk")]
        public async Task<IActionResult> CreateDivisionsBulk(
        [FromBody] List<PaymDivisionCreateDto> dto)
        {
            using var context = GetTenantContext();
            if (dto == null || dto.Count == 0)
                return BadRequest("No division data received");

            if (dto.Any(d => d.PnCompanyId <= 0))
                return BadRequest("CompanyID is required for all divisions");

            using var transaction = await context.Database.BeginTransactionAsync();

            try
            {
                var entities = dto.Select(d => new PaymDivision
                {
                    PnCompanyId = d.PnCompanyId,
                    BranchId = d.BranchId,
                    VDivisionName = d.VDivisionName,
                    Status = d.Status
                }).ToList();

                await context.PaymDivisions.AddRangeAsync(entities);
                await context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Divisions created successfully",
                    count = entities.Count
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDivision(int id)
        {
            using var context = GetTenantContext();
            var division = await context.PaymDivisions
                .FirstOrDefaultAsync(d => d.PnDivisionId == id);

            if (division == null)
                return NotFound("Division not found");

            context.PaymDivisions.Remove(division);
            await context.SaveChangesAsync();

            return Ok(new { message = "Division deleted successfully" });
        }

    }

}
