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
    public class PaymEmpDeductionsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymEmpDeductionsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymEmpDeductions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymEmpDeduction>>> GetPaymEmpDeductions()
        {
            return await _context.PaymEmpDeductions.ToListAsync();
        }

        // GET: api/PaymEmpDeductions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymEmpDeduction>> GetPaymEmpDeduction(int id)
        {
            var paymEmpDeduction = await _context.PaymEmpDeductions.FindAsync(id);

            if (paymEmpDeduction == null)
            {
                return NotFound();
            }

            return paymEmpDeduction;
        }

        // PUT: api/PaymEmpDeductions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymEmpDeduction(int id, PaymEmpDeduction paymEmpDeduction)
        {
            if (id != paymEmpDeduction.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(paymEmpDeduction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymEmpDeductionExists(id))
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

        // POST: api/PaymEmpDeductions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymEmpDeduction>> PostPaymEmpDeduction(PaymEmpDeduction paymEmpDeduction)
        {
            _context.PaymEmpDeductions.Add(paymEmpDeduction);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PaymEmpDeductionExists(paymEmpDeduction.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPaymEmpDeduction", new { id = paymEmpDeduction.PnCompanyId }, paymEmpDeduction);
        }

        // DELETE: api/PaymEmpDeductions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymEmpDeduction(int id)
        {
            var paymEmpDeduction = await _context.PaymEmpDeductions.FindAsync(id);
            if (paymEmpDeduction == null)
            {
                return NotFound();
            }

            _context.PaymEmpDeductions.Remove(paymEmpDeduction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymEmpDeductionExists(int id)
        {
            return _context.PaymEmpDeductions.Any(e => e.PnCompanyId == id);
        }
    }
}
