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
    public class TempTimecardsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public TempTimecardsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/TempTimecards
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TempTimecard>>> GetTempTimecards()
        {
            return await _context.TempTimecards.ToListAsync();
        }

        // GET: api/TempTimecards/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TempTimecard>> GetTempTimecard(int id)
        {
            var tempTimecard = await _context.TempTimecards.FindAsync(id);

            if (tempTimecard == null)
            {
                return NotFound();
            }

            return tempTimecard;
        }

        // PUT: api/TempTimecards/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTempTimecard(int id, TempTimecard tempTimecard)
        {
            if (id != tempTimecard.Id)
            {
                return BadRequest();
            }

            _context.Entry(tempTimecard).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TempTimecardExists(id))
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

        // POST: api/TempTimecards
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TempTimecard>> PostTempTimecard(TempTimecard tempTimecard)
        {
            _context.TempTimecards.Add(tempTimecard);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTempTimecard", new { id = tempTimecard.Id }, tempTimecard);
        }

        // DELETE: api/TempTimecards/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTempTimecard(int id)
        {
            var tempTimecard = await _context.TempTimecards.FindAsync(id);
            if (tempTimecard == null)
            {
                return NotFound();
            }

            _context.TempTimecards.Remove(tempTimecard);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TempTimecardExists(int id)
        {
            return _context.TempTimecards.Any(e => e.Id == id);
        }
    }
}
