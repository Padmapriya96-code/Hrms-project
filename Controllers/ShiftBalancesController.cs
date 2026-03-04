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
    public class ShiftBalancesController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public ShiftBalancesController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/ShiftBalances
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShiftBalance>>> GetShiftBalances()
        {
            return await _context.ShiftBalances.ToListAsync();
        }

        // GET: api/ShiftBalances/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShiftBalance>> GetShiftBalance(int id)
        {
            var shiftBalance = await _context.ShiftBalances.FindAsync(id);

            if (shiftBalance == null)
            {
                return NotFound();
            }

            return shiftBalance;
        }

        // PUT: api/ShiftBalances/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShiftBalance(int id, ShiftBalance shiftBalance)
        {
            if (id != shiftBalance.Id)
            {
                return BadRequest();
            }

            _context.Entry(shiftBalance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShiftBalanceExists(id))
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

        // POST: api/ShiftBalances
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ShiftBalance>> PostShiftBalance(ShiftBalance shiftBalance)
        {
            _context.ShiftBalances.Add(shiftBalance);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetShiftBalance", new { id = shiftBalance.Id }, shiftBalance);
        }

        // DELETE: api/ShiftBalances/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShiftBalance(int id)
        {
            var shiftBalance = await _context.ShiftBalances.FindAsync(id);
            if (shiftBalance == null)
            {
                return NotFound();
            }

            _context.ShiftBalances.Remove(shiftBalance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShiftBalanceExists(int id)
        {
            return _context.ShiftBalances.Any(e => e.Id == id);
        }
    }
}
