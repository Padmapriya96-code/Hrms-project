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
    public class ShiftMonthsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public ShiftMonthsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/ShiftMonths
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShiftMonth>>> GetShiftMonths()
        {
            return await _context.ShiftMonths.ToListAsync();
        }

        // GET: api/ShiftMonths/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShiftMonth>> GetShiftMonth(int id)
        {
            var shiftMonth = await _context.ShiftMonths.FindAsync(id);

            if (shiftMonth == null)
            {
                return NotFound();
            }

            return shiftMonth;
        }

        // PUT: api/ShiftMonths/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShiftMonth(int id, ShiftMonth shiftMonth)
        {
            if (id != shiftMonth.Id)
            {
                return BadRequest();
            }

            _context.Entry(shiftMonth).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShiftMonthExists(id))
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

        // POST: api/ShiftMonths
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ShiftMonth>> PostShiftMonth(ShiftMonth shiftMonth)
        {
            _context.ShiftMonths.Add(shiftMonth);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetShiftMonth", new { id = shiftMonth.Id }, shiftMonth);
        }

        // DELETE: api/ShiftMonths/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShiftMonth(int id)
        {
            var shiftMonth = await _context.ShiftMonths.FindAsync(id);
            if (shiftMonth == null)
            {
                return NotFound();
            }

            _context.ShiftMonths.Remove(shiftMonth);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShiftMonthExists(int id)
        {
            return _context.ShiftMonths.Any(e => e.Id == id);
        }
    }
}
