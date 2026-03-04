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
    public class PfEpfsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PfEpfsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PfEpfs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PfEpf>>> GetPfEpfs()
        {
            return await _context.PfEpfs.ToListAsync();
        }

        // GET: api/PfEpfs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PfEpf>> GetPfEpf(int id)
        {
            var pfEpf = await _context.PfEpfs.FindAsync(id);

            if (pfEpf == null)
            {
                return NotFound();
            }

            return pfEpf;
        }

        // PUT: api/PfEpfs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPfEpf(int id, PfEpf pfEpf)
        {
            if (id != pfEpf.Id)
            {
                return BadRequest();
            }

            _context.Entry(pfEpf).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PfEpfExists(id))
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

        // POST: api/PfEpfs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PfEpf>> PostPfEpf(PfEpf pfEpf)
        {
            _context.PfEpfs.Add(pfEpf);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPfEpf", new { id = pfEpf.Id }, pfEpf);
        }

        // DELETE: api/PfEpfs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePfEpf(int id)
        {
            var pfEpf = await _context.PfEpfs.FindAsync(id);
            if (pfEpf == null)
            {
                return NotFound();
            }

            _context.PfEpfs.Remove(pfEpf);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PfEpfExists(int id)
        {
            return _context.PfEpfs.Any(e => e.Id == id);
        }
    }
}
