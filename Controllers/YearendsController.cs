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
    public class YearendsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public YearendsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/Yearends
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Yearend>>> GetYearends()
        {
            return await _context.Yearends.ToListAsync();
        }

        // GET: api/Yearends/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Yearend>> GetYearend(DateTime id)
        {
            var yearend = await _context.Yearends.FindAsync(id);

            if (yearend == null)
            {
                return NotFound();
            }

            return yearend;
        }

        // PUT: api/Yearends/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutYearend(DateTime id, Yearend yearend)
        {
            if (id != yearend.StartDate)
            {
                return BadRequest();
            }

            _context.Entry(yearend).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!YearendExists(id))
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

        // POST: api/Yearends
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Yearend>> PostYearend(Yearend yearend)
        {
            _context.Yearends.Add(yearend);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (YearendExists(yearend.StartDate))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetYearend", new { id = yearend.StartDate }, yearend);
        }

        // DELETE: api/Yearends/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteYearend(DateTime id)
        {
            var yearend = await _context.Yearends.FindAsync(id);
            if (yearend == null)
            {
                return NotFound();
            }

            _context.Yearends.Remove(yearend);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool YearendExists(DateTime id)
        {
            return _context.Yearends.Any(e => e.StartDate == id);
        }
    }
}
