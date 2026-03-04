using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymousJwt]
    public class PaymEmployeesController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymEmployeesController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymEmployees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymEmployee>>> GetPaymEmployees()
        {
            return await _context.PaymEmployees.ToListAsync();
        }

        // GET: api/PaymEmployees/1/18/5  (CompanyId/BranchId/EmployeeId)
        [HttpGet("{pnCompanyId}/{pnBranchId}/{pnEmployeeId}")]
        public async Task<ActionResult<PaymEmployee>> GetPaymEmployee(int pnCompanyId, int pnBranchId, int pnEmployeeId)
        {
            var employee = await _context.PaymEmployees.FindAsync(pnCompanyId, pnBranchId, pnEmployeeId);

            if (employee == null)
            {
                return NotFound();
            }

            return employee;
        }

        // POST: api/PaymEmployees
        [HttpPost]
        public async Task<ActionResult<PaymEmployee>> PostPaymEmployee(PaymEmployee paymEmployee)
        {
            // Defensive: Clear navigation to avoid FK confusion
            paymEmployee.PaymBranch = null;

            // Check foreign keys exist
            var branchExists = await _context.PaymBranches.AnyAsync(b =>
                b.PnCompanyId == paymEmployee.PnCompanyId &&
                b.PnBranchId == paymEmployee.PnBranchId);

            if (!branchExists)
            {
                return BadRequest("Invalid Company or Branch Id.");
            }

            _context.PaymEmployees.Add(paymEmployee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPaymEmployee), new
            {
                pnCompanyId = paymEmployee.PnCompanyId,
                pnBranchId = paymEmployee.PnBranchId,
                pnEmployeeId = paymEmployee.PnEmployeeId
            }, paymEmployee);
        }

        // PUT: api/PaymEmployees/1/18/5
        [HttpPut("{pnCompanyId}/{pnBranchId}/{pnEmployeeId}")]
        public async Task<IActionResult> PutPaymEmployee(int pnCompanyId, int pnBranchId, int pnEmployeeId, PaymEmployee paymEmployee)
        {
            if (pnCompanyId != paymEmployee.PnCompanyId ||
                pnBranchId != paymEmployee.PnBranchId ||
                pnEmployeeId != paymEmployee.PnEmployeeId)
            {
                return BadRequest("Key mismatch.");
            }

            // Defensive: Clear navigation property
            paymEmployee.PaymBranch = null;

            _context.Entry(paymEmployee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                bool exists = await _context.PaymEmployees.AnyAsync(e =>
                    e.PnCompanyId == pnCompanyId &&
                    e.PnBranchId == pnBranchId &&
                    e.PnEmployeeId == pnEmployeeId);

                if (!exists)
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/PaymEmployees/1/18/5
        [HttpDelete("{pnCompanyId}/{pnBranchId}/{pnEmployeeId}")]
        public async Task<IActionResult> DeletePaymEmployee(int pnCompanyId, int pnBranchId, int pnEmployeeId)
        {
            var employee = await _context.PaymEmployees.FindAsync(pnCompanyId, pnBranchId, pnEmployeeId);
            if (employee == null)
            {
                return NotFound();
            }

            _context.PaymEmployees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}