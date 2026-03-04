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
    public class PayOutputPfsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PayOutputPfsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PayOutputPfs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PayOutputPf>>> GetPayOutputPfs()
        {
            return await _context.PayOutputPfs.ToListAsync();
        }

        // GET: api/PayOutputPfs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PayOutputPf>> GetPayOutputPf(int id)
        {
            var payOutputPf = await _context.PayOutputPfs.FindAsync(id);

            if (payOutputPf == null)
            {
                return NotFound();
            }

            return payOutputPf;
        }

        // PUT: api/PayOutputPfs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayOutputPf(int id, PayOutputPf payOutputPf)
        {
            if (id != payOutputPf.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(payOutputPf).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PayOutputPfExists(id))
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

        // POST: api/PayOutputPfs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PayOutputPf>> PostPayOutputPf(PayOutputPf payOutputPf)
        {
            _context.PayOutputPfs.Add(payOutputPf);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PayOutputPfExists(payOutputPf.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPayOutputPf", new { id = payOutputPf.PnCompanyId }, payOutputPf);
        }

        // DELETE: api/PayOutputPfs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayOutputPf(int id)
        {
            var payOutputPf = await _context.PayOutputPfs.FindAsync(id);
            if (payOutputPf == null)
            {
                return NotFound();
            }

            _context.PayOutputPfs.Remove(payOutputPf);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PayOutputPfExists(int id)
        {
            return _context.PayOutputPfs.Any(e => e.PnCompanyId == id);
        }
    }
}
