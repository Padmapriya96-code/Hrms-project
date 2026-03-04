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
    public class ShiftPatternsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public ShiftPatternsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/ShiftPatterns
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShiftPattern>>> GetShiftPatterns()
        {
            return await _context.ShiftPatterns.ToListAsync();
        }

        // GET: api/ShiftPatterns/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShiftPattern>> GetShiftPattern(int id)
        {
            var shiftPattern = await _context.ShiftPatterns.FindAsync(id);

            if (shiftPattern == null)
            {
                return NotFound();
            }

            return shiftPattern;
        }

        // PUT: api/ShiftPatterns/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShiftPattern(int id, ShiftPattern shiftPattern)
        {
            if (id != shiftPattern.PnCompanyid)
            {
                return BadRequest();
            }

            _context.Entry(shiftPattern).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShiftPatternExists(id))
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

        // POST: api/ShiftPatterns
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ShiftPattern>> PostShiftPattern(ShiftPattern shiftPattern)
        {
            _context.ShiftPatterns.Add(shiftPattern);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ShiftPatternExists(shiftPattern.PnCompanyid))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetShiftPattern", new { id = shiftPattern.PnCompanyid }, shiftPattern);
        }

        // DELETE: api/ShiftPatterns/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShiftPattern(int id)
        {
            var shiftPattern = await _context.ShiftPatterns.FindAsync(id);
            if (shiftPattern == null)
            {
                return NotFound();
            }

            _context.ShiftPatterns.Remove(shiftPattern);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShiftPatternExists(int id)
        {
            return _context.ShiftPatterns.Any(e => e.PnCompanyid == id);
        }
    }
}
