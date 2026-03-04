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
    public class PayOutputActualsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PayOutputActualsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PayOutputActuals
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PayOutputActual>>> GetPayOutputActuals()
        {
            return await _context.PayOutputActuals.ToListAsync();
        }

        // GET: api/PayOutputActuals/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PayOutputActual>> GetPayOutputActual(int id)
        {
            var payOutputActual = await _context.PayOutputActuals.FindAsync(id);

            if (payOutputActual == null)
            {
                return NotFound();
            }

            return payOutputActual;
        }

        // PUT: api/PayOutputActuals/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayOutputActual(int id, PayOutputActual payOutputActual)
        {
            if (id != payOutputActual.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(payOutputActual).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PayOutputActualExists(id))
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

        // POST: api/PayOutputActuals
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PayOutputActual>> PostPayOutputActual(PayOutputActual payOutputActual)
        {
            _context.PayOutputActuals.Add(payOutputActual);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PayOutputActualExists(payOutputActual.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetPayOutputActual", new { id = payOutputActual.PnCompanyId }, payOutputActual);
        }

        // DELETE: api/PayOutputActuals/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayOutputActual(int id)
        {
            var payOutputActual = await _context.PayOutputActuals.FindAsync(id);
            if (payOutputActual == null)
            {
                return NotFound();
            }

            _context.PayOutputActuals.Remove(payOutputActual);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PayOutputActualExists(int id)
        {
            return _context.PayOutputActuals.Any(e => e.PnCompanyId == id);
        }
    }
}
