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
    public class PayOutputDeductionsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PayOutputDeductionsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PayOutputDeductions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PayOutputDeduction>>> GetPayOutputDeductions()
        {
            return await _context.PayOutputDeductions.ToListAsync();
        }

        // GET: api/PayOutputDeductions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PayOutputDeduction>> GetPayOutputDeduction(int id)
        {
            var payOutputDeduction = await _context.PayOutputDeductions.FindAsync(id);

            if (payOutputDeduction == null)
            {
                return NotFound();
            }

            return payOutputDeduction;
        }

        // PUT: api/PayOutputDeductions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayOutputDeduction(int id, PayOutputDeduction payOutputDeduction)
        {
            if (id != payOutputDeduction.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(payOutputDeduction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PayOutputDeductionExists(id))
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

        // POST: api/PayOutputDeductions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PayOutputDeduction>> PostPayOutputDeduction(PayOutputDeduction payOutputDeduction)
        {
            _context.PayOutputDeductions.Add(payOutputDeduction);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PayOutputDeductionExists(payOutputDeduction.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPayOutputDeduction", new { id = payOutputDeduction.PnCompanyId }, payOutputDeduction);
        }

        // DELETE: api/PayOutputDeductions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayOutputDeduction(int id)
        {
            var payOutputDeduction = await _context.PayOutputDeductions.FindAsync(id);
            if (payOutputDeduction == null)
            {
                return NotFound();
            }

            _context.PayOutputDeductions.Remove(payOutputDeduction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PayOutputDeductionExists(int id)
        {
            return _context.PayOutputDeductions.Any(e => e.PnCompanyId == id);
        }
    }
}
