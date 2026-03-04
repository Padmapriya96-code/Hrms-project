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
    public class AttendanceCeilingsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public AttendanceCeilingsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/AttendanceCeilings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AttendanceCeiling>>> GetAttendanceCeilings()
        {
            return await _context.AttendanceCeilings.ToListAsync();
        }

        // GET: api/AttendanceCeilings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AttendanceCeiling>> GetAttendanceCeiling(int id)
        {
            var attendanceCeiling = await _context.AttendanceCeilings.FindAsync(id);

            if (attendanceCeiling == null)
            {
                return NotFound();
            }

            return attendanceCeiling;
        }

        // PUT: api/AttendanceCeilings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttendanceCeiling(int id, AttendanceCeiling attendanceCeiling)
        {
            if (id != attendanceCeiling.Id)
            {
                return BadRequest();
            }

            _context.Entry(attendanceCeiling).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttendanceCeilingExists(id))
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

        // POST: api/AttendanceCeilings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AttendanceCeiling>> PostAttendanceCeiling(AttendanceCeiling attendanceCeiling)
        {
            _context.AttendanceCeilings.Add(attendanceCeiling);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAttendanceCeiling", new { id = attendanceCeiling.Id }, attendanceCeiling);
        }

        // DELETE: api/AttendanceCeilings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttendanceCeiling(int id)
        {
            var attendanceCeiling = await _context.AttendanceCeilings.FindAsync(id);
            if (attendanceCeiling == null)
            {
                return NotFound();
            }

            _context.AttendanceCeilings.Remove(attendanceCeiling);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AttendanceCeilingExists(int id)
        {
            return _context.AttendanceCeilings.Any(e => e.Id == id);
        }
    }
}
