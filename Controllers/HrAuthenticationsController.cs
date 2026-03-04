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
    public class HrAuthenticationsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public HrAuthenticationsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/HrAuthentications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HrAuthentication>>> GetHrAuthentications()
        {
            return await _context.HrAuthentications.ToListAsync();
        }

        // GET: api/HrAuthentications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HrAuthentication>> GetHrAuthentication(int id)
        {
            var hrAuthentication = await _context.HrAuthentications.FindAsync(id);

            if (hrAuthentication == null)
            {
                return NotFound();
            }

            return hrAuthentication;
        }

        // PUT: api/HrAuthentications/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHrAuthentication(int id, HrAuthentication hrAuthentication)
        {
            if (id != hrAuthentication.Id)
            {
                return BadRequest();
            }

            _context.Entry(hrAuthentication).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HrAuthenticationExists(id))
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

        // POST: api/HrAuthentications
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<HrAuthentication>> PostHrAuthentication(HrAuthentication hrAuthentication)
        {
            _context.HrAuthentications.Add(hrAuthentication);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHrAuthentication", new { id = hrAuthentication.Id }, hrAuthentication);
        }

        // DELETE: api/HrAuthentications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHrAuthentication(int id)
        {
            var hrAuthentication = await _context.HrAuthentications.FindAsync(id);
            if (hrAuthentication == null)
            {
                return NotFound();
            }

            _context.HrAuthentications.Remove(hrAuthentication);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HrAuthenticationExists(int id)
        {
            return _context.HrAuthentications.Any(e => e.Id == id);
        }
    }
}
