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
    public class PfEpsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PfEpsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PfEps
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PfEp>>> GetPfEps()
        {
            return await _context.PfEps.ToListAsync();
        }

        // GET: api/PfEps/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PfEp>> GetPfEp(int id)
        {
            var pfEp = await _context.PfEps.FindAsync(id);

            if (pfEp == null)
            {
                return NotFound();
            }

            return pfEp;
        }

        // PUT: api/PfEps/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPfEp(int id, PfEp pfEp)
        {
            if (id != pfEp.Id)
            {
                return BadRequest();
            }

            _context.Entry(pfEp).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PfEpExists(id))
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

        // POST: api/PfEps
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PfEp>> PostPfEp(PfEp pfEp)
        {
            _context.PfEps.Add(pfEp);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPfEp", new { id = pfEp.Id }, pfEp);
        }

        // DELETE: api/PfEps/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePfEp(int id)
        {
            var pfEp = await _context.PfEps.FindAsync(id);
            if (pfEp == null)
            {
                return NotFound();
            }

            _context.PfEps.Remove(pfEp);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PfEpExists(int id)
        {
            return _context.PfEps.Any(e => e.Id == id);
        }
    }
}
