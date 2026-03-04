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
    public class TempEarningsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public TempEarningsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/TempEarnings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TempEarning>>> GetTempEarnings()
        {
            return await _context.TempEarnings.ToListAsync();
        }

        // GET: api/TempEarnings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TempEarning>> GetTempEarning(int id)
        {
            var tempEarning = await _context.TempEarnings.FindAsync(id);

            if (tempEarning == null)
            {
                return NotFound();
            }

            return tempEarning;
        }

        // PUT: api/TempEarnings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTempEarning(int id, TempEarning tempEarning)
        {
            if (id != tempEarning.Id)
            {
                return BadRequest();
            }

            _context.Entry(tempEarning).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TempEarningExists(id))
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

        // POST: api/TempEarnings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TempEarning>> PostTempEarning(TempEarning tempEarning)
        {
            _context.TempEarnings.Add(tempEarning);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTempEarning", new { id = tempEarning.Id }, tempEarning);
        }

        // DELETE: api/TempEarnings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTempEarning(int id)
        {
            var tempEarning = await _context.TempEarnings.FindAsync(id);
            if (tempEarning == null)
            {
                return NotFound();
            }

            _context.TempEarnings.Remove(tempEarning);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TempEarningExists(int id)
        {
            return _context.TempEarnings.Any(e => e.Id == id);
        }
    }
}
