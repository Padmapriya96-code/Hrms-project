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
    public class OtslabsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public OtslabsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/Otslabs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Otslab>>> GetOtslabs()
        {
            return await _context.Otslabs.ToListAsync();
        }

        // GET: api/Otslabs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Otslab>> GetOtslab(int id)
        {
            var otslab = await _context.Otslabs.FindAsync(id);

            if (otslab == null)
            {
                return NotFound();
            }

            return otslab;
        }

        // PUT: api/Otslabs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOtslab(int id, Otslab otslab)
        {
            if (id != otslab.PnCompanyid)
            {
                return BadRequest();
            }

            _context.Entry(otslab).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OtslabExists(id))
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

        // POST: api/Otslabs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Otslab>> PostOtslab(Otslab otslab)
        {
            _context.Otslabs.Add(otslab);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (OtslabExists(otslab.PnCompanyid))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetOtslab", new { id = otslab.PnCompanyid }, otslab);
        }

        // DELETE: api/Otslabs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOtslab(int id)
        {
            var otslab = await _context.Otslabs.FindAsync(id);
            if (otslab == null)
            {
                return NotFound();
            }

            _context.Otslabs.Remove(otslab);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OtslabExists(int id)
        {
            return _context.Otslabs.Any(e => e.PnCompanyid == id);
        }
    }
}
