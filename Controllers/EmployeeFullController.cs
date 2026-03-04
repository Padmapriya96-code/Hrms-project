using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymousJwt]
    public class EmployeeFullController : Controller
    {
        private readonly HrmsystemContext _context;

        public EmployeeFullController(HrmsystemContext context)
        {
            _context = context;
        }

        // DTO to wrap both Employee and Profile


        // GET
        [HttpGet("GetEmployeeWithProfile/{employeeId}")]
        public async Task<ActionResult<EmployeeFullDataDto>> GetEmployeeWithProfile(int employeeId)
        {
            var employee = await _context.PaymEmployees.FindAsync(employeeId);
            if (employee == null)
                return NotFound("Employee not found.");

            var profile = await _context.PaymEmployeeProfile1s
                .FirstOrDefaultAsync(p => p.PnEmployeeId == employeeId);

            return Ok(new EmployeeFullDataDto
            {
                Employee = employee,
                EmployeeProfile = profile ?? new PaymEmployeeProfile1()
            });
        }

        // POST
        [HttpPost("SaveEmployeeWithProfile")]
        public async Task<IActionResult> SaveEmployeeWithProfile([FromBody] EmployeeFullDataDto data)
        {
            if (data == null || data.Employee == null || data.EmployeeProfile == null)
                return BadRequest("Invalid data.");

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                return BadRequest(new { message = "Validation errors", errors });
            }

            // Check if EmployeeCode already exists
            bool employeeCodeExists = await _context.PaymEmployees
                .AnyAsync(e => e.EmployeeCode == data.Employee.EmployeeCode);

            if (employeeCodeExists)
            {
                return Conflict($"EmployeeCode '{data.Employee.EmployeeCode}' is already registered.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                _context.PaymEmployees.Add(data.Employee);
                await _context.SaveChangesAsync();

                data.EmployeeProfile.PnEmployeeId = data.Employee.PnEmployeeId;
                _context.PaymEmployeeProfile1s.Add(data.EmployeeProfile);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return Ok(new { message = "Saved successfully", employeeId = data.Employee.PnEmployeeId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                Exception inner = ex;
                while (inner.InnerException != null)
                    inner = inner.InnerException;

                return StatusCode(500, $"Save failed: {inner.Message}");
            }
        }


        // PUT
        [HttpPut("UpdateEmployeeWithProfile/{employeeId}")]
        public async Task<IActionResult> UpdateEmployeeWithProfile(int employeeId, [FromBody] EmployeeFullDataDto data)
        {
            if (data == null || data.Employee == null || data.EmployeeProfile == null)
                return BadRequest("Invalid data.");

            var existingEmployee = await _context.PaymEmployees.FindAsync(employeeId);
            if (existingEmployee == null)
                return NotFound("Employee not found.");

            var existingProfile = await _context.PaymEmployeeProfile1s
                .FirstOrDefaultAsync(p => p.PnEmployeeId == employeeId);

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                _context.Entry(existingEmployee).CurrentValues.SetValues(data.Employee);
                await _context.SaveChangesAsync();

                if (existingProfile != null)
                {
                    _context.Entry(existingProfile).CurrentValues.SetValues(data.EmployeeProfile);
                }
                else
                {
                    data.EmployeeProfile.PnEmployeeId = employeeId;
                    _context.PaymEmployeeProfile1s.Add(data.EmployeeProfile);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok("Employee and profile updated successfully.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Update failed: {ex.Message}");
            }
        }

        // DELETE
        [HttpDelete("DeleteEmployeeWithProfile/{employeeId}")]
        public async Task<IActionResult> DeleteEmployeeWithProfile(int employeeId)
        {
            var employee = await _context.PaymEmployees.FindAsync(employeeId);
            if (employee == null)
                return NotFound("Employee not found.");

            var profile = await _context.PaymEmployeeProfile1s
                .FirstOrDefaultAsync(p => p.PnEmployeeId == employeeId);

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                if (profile != null)
                    _context.PaymEmployeeProfile1s.Remove(profile);

                _context.PaymEmployees.Remove(employee);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return Ok("Employee and profile deleted successfully.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Delete failed: {ex.Message}");
            }
        }
    }
}