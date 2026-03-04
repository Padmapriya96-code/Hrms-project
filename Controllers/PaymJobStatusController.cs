using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;
using HRMSAPPLICATION.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using HRMSAPPLICATION.DTO;
namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymJobStatusController : ControllerBase
    {
        private readonly TenantDbContextFactory _factory;

        public PaymJobStatusController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }
        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);
        }
        // GET: api/PaymJobStatus
        [HttpGet("{companyId}/{branchId?}")]
       public async Task<ActionResult<IEnumerable<JobStatusDto>>> GetJobStatus(int companyId,int? branchId)
        {
            using var context = GetTenantContext();

            // 1. Start with a query for the company
            var query = context.PaymJobStatuses.Where(j => j.PnCompanyId == companyId);

            // 2. If branchId has a value (isn't null or 0), add the branch filter
            if (branchId.HasValue && branchId.Value != 0)
            {
                query = query.Where(j => j.BranchId == branchId.Value);
            }

            // 3. Execute the list
            var list = await query.Select(j => new JobStatusDto
            {
                PnCompanyId = j.PnCompanyId,
                BranchId = j.BranchId,
                PnJobStatusId = j.PnJobStatusId,
                VJobStatusName = j.VJobStatusName,
                Status = j.Status
            }).ToListAsync();
            return Ok(list);
        }
       
        // 2. GET SINGLE (Requires all parts of the composite key)
        [HttpGet("specific")]
        public async Task<ActionResult<JobStatusDto>> GetJobStatus([FromQuery] int companyId, [FromQuery] int branchId, [FromQuery] string name)
        {
            using var context = GetTenantContext();
            var j = await context.PaymJobStatuses
                .FirstOrDefaultAsync(x => x.PnCompanyId == companyId && x.BranchId == branchId && x.VJobStatusName == name);

            if (j == null) return NotFound();

            return Ok(new JobStatusDto
            {
                PnCompanyId = j.PnCompanyId,
                BranchId = j.BranchId,
                PnJobStatusId = j.PnJobStatusId,
                VJobStatusName = j.VJobStatusName,
                Status = j.Status
            });
        }

        // 3. POST (Create)
        [HttpPost]
        public async Task<IActionResult> CreateJobStatus(JobStatusDto dto)
        {
            using var context = GetTenantContext();

            var newStatus = new PaymJobStatus
            {
                PnCompanyId = dto.PnCompanyId,
                BranchId = dto.BranchId,
                VJobStatusName = dto.VJobStatusName,
                Status = dto.Status ?? "A" // Matches .HasMaxLength(1)
            };

            context.PaymJobStatuses.Add(newStatus);
            await context.SaveChangesAsync();

            return Ok(new { message = "Job status created successfully" });
        }

        // 4. PUT (Update Status)
        [HttpPut]
        public async Task<IActionResult> UpdateJobStatus(JobStatusDto dto)
        {
            using var context = GetTenantContext();
            var existing = await context.PaymJobStatuses
                .FirstOrDefaultAsync(x => x.PnCompanyId == dto.PnCompanyId &&
                                         x.BranchId == dto.BranchId &&
                                         x.VJobStatusName == dto.VJobStatusName);

            if (existing == null) return NotFound();

            existing.Status = dto.Status;

            await context.SaveChangesAsync();
            return Ok(new { message = "Updated successfully" });
        }

        // DELETE: api/PaymJobStatus
        [HttpDelete]
        public async Task<IActionResult> DeleteJobStatus([FromQuery] int companyId, [FromQuery] int branchId, [FromQuery] string name)
        {
            using var context = GetTenantContext();

            // Find the record using all parts of the composite key
            var jobStatus = await context.PaymJobStatuses
                .FirstOrDefaultAsync(j => j.PnCompanyId == companyId &&
                                         j.BranchId == branchId &&
                                         j.VJobStatusName == name);

            if (jobStatus == null)
            {
                return NotFound(new { message = "Job Status not found with the provided keys." });
            }

            try
            {
                context.PaymJobStatuses.Remove(jobStatus);
                await context.SaveChangesAsync();
                return Ok(new { message = "Job Status deleted successfully." });
            }
            catch (Exception ex)
            {
                // Handle potential foreign key violations or database errors
                return StatusCode(500, new { message = "An error occurred while deleting.", error = ex.Message });
            }
        }
    }
}
