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
    public class PayOutputEsisController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PayOutputEsisController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PayOutputEsis
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PayOutputEsi>>> GetPayOutputEsis()
        {
            return await _context.PayOutputEsis.ToListAsync();
        }

        // GET: api/PayOutputEsis/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PayOutputEsi>> GetPayOutputEsi(int id)
        {
            var payOutputEsi = await _context.PayOutputEsis.FindAsync(id);

            if (payOutputEsi == null)
            {
                return NotFound();
            }

            return payOutputEsi;
        }

        // PUT: api/PayOutputEsis/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayOutputEsi(int id, PayOutputEsi payOutputEsi)
        {
            if (id != payOutputEsi.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(payOutputEsi).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PayOutputEsiExists(id))
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

        // POST: api/PayOutputEsis
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PayOutputEsi>> PostPayOutputEsi(PayOutputEsi payOutputEsi)
        {
            _context.PayOutputEsis.Add(payOutputEsi);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PayOutputEsiExists(payOutputEsi.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPayOutputEsi", new { id = payOutputEsi.PnCompanyId }, payOutputEsi);
        }

        // DELETE: api/PayOutputEsis/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayOutputEsi(int id)
        {
            var payOutputEsi = await _context.PayOutputEsis.FindAsync(id);
            if (payOutputEsi == null)
            {
                return NotFound();
            }

            _context.PayOutputEsis.Remove(payOutputEsi);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PayOutputEsiExists(int id)
        {
            return _context.PayOutputEsis.Any(e => e.PnCompanyId == id);
        }
    }
}
