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
    public class TempsattendancesController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public TempsattendancesController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/Tempsattendances
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tempsattendance>>> GetTempsattendances()
        {
            return await _context.Tempsattendances.ToListAsync();
        }

        // GET: api/Tempsattendances/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tempsattendance>> GetTempsattendance(int id)
        {
            var tempsattendance = await _context.Tempsattendances.FindAsync(id);

            if (tempsattendance == null)
            {
                return NotFound();
            }

            return tempsattendance;
        }

        // PUT: api/Tempsattendances/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTempsattendance(int id, Tempsattendance tempsattendance)
        {
            if (id != tempsattendance.Id)
            {
                return BadRequest();
            }

            _context.Entry(tempsattendance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TempsattendanceExists(id))
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

        // POST: api/Tempsattendances
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Tempsattendance>> PostTempsattendance(Tempsattendance tempsattendance)
        {
            _context.Tempsattendances.Add(tempsattendance);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTempsattendance", new { id = tempsattendance.Id }, tempsattendance);
        }

        // DELETE: api/Tempsattendances/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTempsattendance(int id)
        {
            var tempsattendance = await _context.Tempsattendances.FindAsync(id);
            if (tempsattendance == null)
            {
                return NotFound();
            }

            _context.Tempsattendances.Remove(tempsattendance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TempsattendanceExists(int id)
        {
            return _context.Tempsattendances.Any(e => e.Id == id);
        }
    }
}
