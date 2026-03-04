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
    public class HrmmSpecializationsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public HrmmSpecializationsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/HrmmSpecializations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HrmmSpecialization>>> GetHrmmSpecializations()
        {
            return await _context.HrmmSpecializations.ToListAsync();
        }

        // GET: api/HrmmSpecializations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HrmmSpecialization>> GetHrmmSpecialization(int id)
        {
            var hrmmSpecialization = await _context.HrmmSpecializations.FindAsync(id);

            if (hrmmSpecialization == null)
            {
                return NotFound();
            }

            return hrmmSpecialization;
        }

        // PUT: api/HrmmSpecializations/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHrmmSpecialization(int id, HrmmSpecialization hrmmSpecialization)
        {
            if (id != hrmmSpecialization.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(hrmmSpecialization).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HrmmSpecializationExists(id))
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

        // POST: api/HrmmSpecializations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<HrmmSpecialization>> PostHrmmSpecialization(HrmmSpecialization hrmmSpecialization)
        {
            _context.HrmmSpecializations.Add(hrmmSpecialization);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (HrmmSpecializationExists(hrmmSpecialization.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetHrmmSpecialization", new { id = hrmmSpecialization.PnCompanyId }, hrmmSpecialization);
        }

        // DELETE: api/HrmmSpecializations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHrmmSpecialization(int id)
        {
            var hrmmSpecialization = await _context.HrmmSpecializations.FindAsync(id);
            if (hrmmSpecialization == null)
            {
                return NotFound();
            }

            _context.HrmmSpecializations.Remove(hrmmSpecialization);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HrmmSpecializationExists(int id)
        {
            return _context.HrmmSpecializations.Any(e => e.PnCompanyId == id);
        }
    }
}
