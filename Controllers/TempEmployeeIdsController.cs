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
    public class TempEmployeeIdsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public TempEmployeeIdsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/TempEmployeeIds
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TempEmployeeId>>> GetTempEmployeeIds()
        {
            return await _context.TempEmployeeIds.ToListAsync();
        }

        // GET: api/TempEmployeeIds/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TempEmployeeId>> GetTempEmployeeId(int id)
        {
            var tempEmployeeId = await _context.TempEmployeeIds.FindAsync(id);

            if (tempEmployeeId == null)
            {
                return NotFound();
            }

            return tempEmployeeId;
        }

        // PUT: api/TempEmployeeIds/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTempEmployeeId(int id, TempEmployeeId tempEmployeeId)
        {
            if (id != tempEmployeeId.Id)
            {
                return BadRequest();
            }

            _context.Entry(tempEmployeeId).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TempEmployeeIdExists(id))
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

        // POST: api/TempEmployeeIds
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TempEmployeeId>> PostTempEmployeeId(TempEmployeeId tempEmployeeId)
        {
            _context.TempEmployeeIds.Add(tempEmployeeId);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTempEmployeeId", new { id = tempEmployeeId.Id }, tempEmployeeId);
        }

        // DELETE: api/TempEmployeeIds/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTempEmployeeId(int id)
        {
            var tempEmployeeId = await _context.TempEmployeeIds.FindAsync(id);
            if (tempEmployeeId == null)
            {
                return NotFound();
            }

            _context.TempEmployeeIds.Remove(tempEmployeeId);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TempEmployeeIdExists(int id)
        {
            return _context.TempEmployeeIds.Any(e => e.Id == id);
        }
    }
}
