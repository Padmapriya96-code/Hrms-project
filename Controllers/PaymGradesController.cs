using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Authorization;
using HRMSAPPLICATION.Infrastructure;
using HRMSAPPLICATION.DTO;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymGradesController : ControllerBase
    {
        private readonly TenantDbContextFactory _factory;

        public PaymGradesController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }

        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);
        }
        // GET: api/PaymGrades
        [HttpGet("company/{companyId}")]
        public async Task<ActionResult<IEnumerable<PaymGradeDto>>> GetByCompany(int companyId)
        {
           using var context = GetTenantContext();
            // Using .Select() to map to the DTO is the most performant way
            var data = await context.PaymGrades.Where(g => g.PnCompanyId == companyId).Select(g => new PaymGradeDto
            {
                PnCompanyId = g.PnCompanyId,
                BranchId = g.BranchId,
                PnGradeId = g.PnGradeId,
                VGradeName = g.VGradeName,
                Status = g.Status
            }).ToListAsync();
            return Ok(data);
        }

        [HttpPost("bulk-save")]
        public async Task<IActionResult> BulkSave([FromBody] List<PaymGradeDto> gradeDtos)
        {
            if (gradeDtos == null || !gradeDtos.Any())
                return BadRequest("No data provided.");
            using var context = GetTenantContext();
            //map dtos to entities
            var newGrades = gradeDtos.Select(dto => new PaymGrade
            {
                PnCompanyId = dto.PnCompanyId,
                BranchId = dto.BranchId,
                PnGradeId = dto.PnGradeId,
                VGradeName = dto.VGradeName,
                Status = dto.Status
            }).ToList();
            try
            {
                await context.PaymGrades.AddRangeAsync(newGrades);
                await context.SaveChangesAsync();
                return Ok("Grades saved successfully.");
            }
            catch (Exception ex)
            {
                // Log the error (ex) here
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        // PUT: api/PaymGrades/5
        [HttpPut]
        public async Task<IActionResult> UpdateGrade([FromBody] PaymGradeDto gradeDto)
        {
            using var context = GetTenantContext();

            // Find the record using all three composite keys
            var existingGrade = await context.PaymGrades
                .FirstOrDefaultAsync(g => g.PnCompanyId == gradeDto.PnCompanyId &&
                                          g.BranchId == gradeDto.BranchId &&
                                          g.VGradeName == gradeDto.VGradeName);

            if (existingGrade == null) return NotFound("Grade record not found with the provided composite keys.");

            // Note: Since VGradeName is part of the Primary Key, you typically 
            // shouldn't allow it to be updated. Only non-key properties (like Status).
            existingGrade.Status = gradeDto.Status;

            try
            {
                await context.SaveChangesAsync();
                return Ok(new { message = "Updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error: {ex.Message}");
            }
        }

        // DELETE: api/PaymGrades/5
        [HttpDelete]
        public async Task<IActionResult> DeleteGrade([FromQuery] int companyId, [FromQuery] int branchId, [FromQuery] string gradeName)
        {
            using var context = GetTenantContext();

            var grade = await context.PaymGrades
                .FirstOrDefaultAsync(g => g.PnCompanyId == companyId &&
                                          g.BranchId == branchId &&
                                          g.VGradeName == gradeName);

            if (grade == null) return NotFound();

            context.PaymGrades.Remove(grade);
            await context.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully" });
        }
    }
}
