using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Authorization;
using HRMSAPPLICATION.Infrastructure;
using HRMSAPPLICATION.DTO;

namespace HRMSAPPLICATION.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]

    public class PaymDesignationsController : ControllerBase
    {
        private readonly TenantDbContextFactory _factory;


        public PaymDesignationsController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }

        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);
        }

        // GET: api/PaymDesignations by company
        [HttpGet("company/{companyId}")]
        public async Task<ActionResult>GetByCompany(int companyId)
        {
            using var context = GetTenantContext();
            var data = await context.PaymDesignations.Where(d => d.PnCompanyId == companyId).Select(d => new
            {
                pnCompanyId = d.PnCompanyId,
                pnbranchId = d.BranchId,
                pnDesignationId = d.PnDesignationId,
                vDesignationName = d.VDesignationName,
                authority = d.Authority,
                status = d.Status
            }).ToListAsync();
            return Ok(data);
        }

        // ✅ POST (CREATE)
        [HttpPost("bulk")]
        public async Task<IActionResult> Create(
     [FromBody] List<PaymDesignationDto> dtoList)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var context = GetTenantContext();

            var entities = dtoList.Select(dto => new PaymDesignation
            {
                PnCompanyId = dto.PnCompanyId,
                BranchId = dto.PnBranchId,
                VDesignationName = dto.VDesignationName,
                Authority = dto.Authority,
                Status = dto.Status   // string → char(1) handled by EF
            }).ToList();

            context.PaymDesignations.AddRange(entities);
            await context.SaveChangesAsync();

            return Ok(new { message = "Designations created successfully" });
        }




        // ✅ PUT (UPDATE)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, PaymDesignationDto dto)
        {
            using var context = GetTenantContext();

            try
            {
                // Find existing using ALL key values
                var existing = await context.PaymDesignations
                    .FirstOrDefaultAsync(x =>
                        x.PnCompanyId == dto.PnCompanyId &&
                        x.BranchId == dto.PnBranchId &&
                        x.VDesignationName == dto.VDesignationName);

                // If not found, we must find by id (since id is identity but not key)
                if (existing == null)
                {
                    existing = await context.PaymDesignations
                        .FirstOrDefaultAsync(x => x.PnDesignationId == id);

                    if (existing == null)
                        return NotFound();
                }

                // If Branch or Name changed → Delete + Insert
                if (existing.BranchId != dto.PnBranchId ||
                    existing.VDesignationName != dto.VDesignationName)
                {
                    var oldEntity = existing;

                    context.PaymDesignations.Remove(oldEntity);
                    await context.SaveChangesAsync();   // 🔥 Important

                    var newEntity = new PaymDesignation
                    {
                        PnCompanyId = dto.PnCompanyId,
                        BranchId = dto.PnBranchId,
                        VDesignationName = dto.VDesignationName,
                        Authority = dto.Authority,
                        Status = dto.Status
                    };

                    context.PaymDesignations.Add(newEntity);
                    await context.SaveChangesAsync();
                }
                else
                {
                    // Only update non-key fields
                    existing.Authority = dto.Authority;
                    existing.Status = dto.Status;

                    await context.SaveChangesAsync();
                }

                return Ok("Updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }



        // ✅ DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            using var context = GetTenantContext();

            var designation = await context.PaymDesignations
                .FirstOrDefaultAsync(d => d.PnDesignationId == id);

            if (designation == null)
                return NotFound("Designation not found");

            context.PaymDesignations.Remove(designation);
            await context.SaveChangesAsync();

            return Ok(new { message = "Designation deleted successfully" });
        }
    }
}
