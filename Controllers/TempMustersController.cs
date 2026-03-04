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
    public class TempMustersController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public TempMustersController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/TempMusters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TempMuster>>> GetTempMusters()
        {
            return await _context.TempMusters.ToListAsync();
        }

        // GET: api/TempMusters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TempMuster>> GetTempMuster(int id)
        {
            var tempMuster = await _context.TempMusters.FindAsync(id);

            if (tempMuster == null)
            {
                return NotFound();
            }

            return tempMuster;
        }

        // PUT: api/TempMusters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTempMuster(int id, TempMuster tempMuster)
        {
            if (id != tempMuster.Id)
            {
                return BadRequest();
            }

            _context.Entry(tempMuster).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TempMusterExists(id))
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

        // POST: api/TempMusters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TempMuster>> PostTempMuster(TempMuster tempMuster)
        {
            _context.TempMusters.Add(tempMuster);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTempMuster", new { id = tempMuster.Id }, tempMuster);
        }

        // DELETE: api/TempMusters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTempMuster(int id)
        {
            var tempMuster = await _context.TempMusters.FindAsync(id);
            if (tempMuster == null)
            {
                return NotFound();
            }

            _context.TempMusters.Remove(tempMuster);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TempMusterExists(int id)
        {
            return _context.TempMusters.Any(e => e.Id == id);
        }
    }
}
