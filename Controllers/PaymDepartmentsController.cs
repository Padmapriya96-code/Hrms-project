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

    public class PaymDepartmentsController : ControllerBase
    {
        private readonly TenantDbContextFactory _factory;

        public PaymDepartmentsController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }

        // ✅ SAME tenant resolution logic as Companies controller
        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);
        }

        // GET: api/PaymDepartments
        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            using var context = GetTenantContext();

            var data = await context.PaymDepartments
                .Select(d => new
                {
                    d.PnDepartmentId,
                    d.PnCompanyId,
                    d.PnBranchId,
                    d.VDepartmentName,
                    d.Status
                })
                .ToListAsync();

            return Ok(data);
        }


        // GET: api/PaymDepartments/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartment(int id)
        {
            using var context = GetTenantContext();

            var dept = await context.PaymDepartments
                .Where(d => d.PnDepartmentId == id)
                .Select(d => new
                {
                    d.PnDepartmentId,
                    d.PnCompanyId,
                    d.PnBranchId,
                    d.VDepartmentName,
                    d.Status
                })
                .FirstOrDefaultAsync();

            if (dept == null)
                return NotFound("Department not found");

            return Ok(dept);
        }


        // PUT: api/PaymDepartments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(
    int id,
    [FromBody] PaymDepartmentDto dto)
        {
            if (id != dto.PnDepartmentId)
                return BadRequest("Invalid Department ID");

            using var context = GetTenantContext();

            var existing = await context.PaymDepartments
                .FirstOrDefaultAsync(d => d.PnDepartmentId == id);

            if (existing == null)
                return NotFound("Department not found");

            existing.PnBranchId = dto.PnBranchId;
            existing.VDepartmentName = dto.VDepartmentName;
            existing.Status = dto.Status;

            await context.SaveChangesAsync();

            return Ok(new { message = "Department updated successfully" });
        }


        // POST: api/PaymDepartments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("bulk")]
        public async Task<IActionResult> CreateDepartments(List<PaymDepartmentDto> dtos)
        {
            using var context = GetTenantContext();

            var entities = dtos.Select(dto => new PaymDepartment
            {
                PnCompanyId = dto.PnCompanyId,
                PnBranchId = dto.PnBranchId,
                VDepartmentName = dto.VDepartmentName,
                Status = dto.Status
            });

            context.PaymDepartments.AddRange(entities);
            await context.SaveChangesAsync();

            return Ok();
        }



        // DELETE: api/PaymDepartments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            using var context = GetTenantContext();

            var department = await context.PaymDepartments
                .FirstOrDefaultAsync(d => d.PnDepartmentId == id);

            if (department == null)
                return NotFound("Department not found");

            context.PaymDepartments.Remove(department);
            await context.SaveChangesAsync();

            return Ok(new { message = "Department deleted successfully" });
        }

    }
}
