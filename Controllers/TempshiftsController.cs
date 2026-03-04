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
    public class TempshiftsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public TempshiftsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/Tempshifts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tempshift>>> GetTempshifts()
        {
            return await _context.Tempshifts.ToListAsync();
        }

        // GET: api/Tempshifts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tempshift>> GetTempshift(int id)
        {
            var tempshift = await _context.Tempshifts.FindAsync(id);

            if (tempshift == null)
            {
                return NotFound();
            }

            return tempshift;
        }

        // PUT: api/Tempshifts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTempshift(int id, Tempshift tempshift)
        {
            if (id != tempshift.Id)
            {
                return BadRequest();
            }

            _context.Entry(tempshift).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TempshiftExists(id))
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

        // POST: api/Tempshifts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Tempshift>> PostTempshift(Tempshift tempshift)
        {
            _context.Tempshifts.Add(tempshift);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTempshift", new { id = tempshift.Id }, tempshift);
        }

        // DELETE: api/Tempshifts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTempshift(int id)
        {
            var tempshift = await _context.Tempshifts.FindAsync(id);
            if (tempshift == null)
            {
                return NotFound();
            }

            _context.Tempshifts.Remove(tempshift);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TempshiftExists(int id)
        {
            return _context.Tempshifts.Any(e => e.Id == id);
        }
    }
}
