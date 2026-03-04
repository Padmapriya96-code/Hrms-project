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
    public class PaymDeductionsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymDeductionsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymDeductions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymDeduction>>> GetPaymDeductions()
        {
            return await _context.PaymDeductions.ToListAsync();
        }

        // GET: api/PaymDeductions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymDeduction>> GetPaymDeduction(int id)
        {
            var paymDeduction = await _context.PaymDeductions.FindAsync(id);

            if (paymDeduction == null)
            {
                return NotFound();
            }

            return paymDeduction;
        }

        // PUT: api/PaymDeductions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymDeduction(int id, PaymDeduction paymDeduction)
        {
            if (id != paymDeduction.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(paymDeduction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymDeductionExists(id))
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

        // POST: api/PaymDeductions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PaymDeduction>> PostPaymDeduction(PaymDeduction paymDeduction)
        {
            _context.PaymDeductions.Add(paymDeduction);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PaymDeductionExists(paymDeduction.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPaymDeduction", new { id = paymDeduction.PnCompanyId }, paymDeduction);
        }

        // DELETE: api/PaymDeductions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymDeduction(int id)
        {
            var paymDeduction = await _context.PaymDeductions.FindAsync(id);
            if (paymDeduction == null)
            {
                return NotFound();
            }

            _context.PaymDeductions.Remove(paymDeduction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymDeductionExists(int id)
        {
            return _context.PaymDeductions.Any(e => e.PnCompanyId == id);
        }
    }
}
