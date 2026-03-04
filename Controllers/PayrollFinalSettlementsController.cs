using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayrollFinalSettlementsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PayrollFinalSettlementsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PayrollFinalSettlements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PayrollFinalSettlement>>> GetPayrollFinalSettlements()
        {
            return await _context.PayrollFinalSettlements.ToListAsync();
        }

        // GET: api/PayrollFinalSettlements/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PayrollFinalSettlement>> GetPayrollFinalSettlement(int id)
        {
            var payrollFinalSettlement = await _context.PayrollFinalSettlements.FindAsync(id);

            if (payrollFinalSettlement == null)
            {
                return NotFound();
            }

            return payrollFinalSettlement;
        }

        // PUT: api/PayrollFinalSettlements/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayrollFinalSettlement(int id, PayrollFinalSettlement payrollFinalSettlement)
        {
            if (id != payrollFinalSettlement.PnCompanyid)
            {
                return BadRequest();
            }

            _context.Entry(payrollFinalSettlement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PayrollFinalSettlementExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/PayrollFinalSettlements
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PayrollFinalSettlement>> PostPayrollFinalSettlement(PayrollFinalSettlement payrollFinalSettlement)
        {
            _context.PayrollFinalSettlements.Add(payrollFinalSettlement);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PayrollFinalSettlementExists(payrollFinalSettlement.PnCompanyid))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPayrollFinalSettlement", new { id = payrollFinalSettlement.PnCompanyid }, payrollFinalSettlement);
        }

        // DELETE: api/PayrollFinalSettlements/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayrollFinalSettlement(int id)
        {
            var payrollFinalSettlement = await _context.PayrollFinalSettlements.FindAsync(id);
            if (payrollFinalSettlement == null)
            {
                return NotFound();
            }

            _context.PayrollFinalSettlements.Remove(payrollFinalSettlement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PayrollFinalSettlementExists(int id)
        {
            return _context.PayrollFinalSettlements.Any(e => e.PnCompanyid == id);
        }
    }
}
