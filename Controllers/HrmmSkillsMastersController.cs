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
    public class HrmmSkillsMastersController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public HrmmSkillsMastersController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/HrmmSkillsMasters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HrmmSkillsMaster>>> GetHrmmSkillsMasters()
        {
            return await _context.HrmmSkillsMasters.ToListAsync();
        }

        // GET: api/HrmmSkillsMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HrmmSkillsMaster>> GetHrmmSkillsMaster(int id)
        {
            var hrmmSkillsMaster = await _context.HrmmSkillsMasters.FindAsync(id);

            if (hrmmSkillsMaster == null)
            {
                return NotFound();
            }

            return hrmmSkillsMaster;
        }

        // PUT: api/HrmmSkillsMasters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHrmmSkillsMaster(int id, HrmmSkillsMaster hrmmSkillsMaster)
        {
            if (id != hrmmSkillsMaster.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(hrmmSkillsMaster).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HrmmSkillsMasterExists(id))
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

        // POST: api/HrmmSkillsMasters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<HrmmSkillsMaster>> PostHrmmSkillsMaster(HrmmSkillsMaster hrmmSkillsMaster)
        {
            _context.HrmmSkillsMasters.Add(hrmmSkillsMaster);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (HrmmSkillsMasterExists(hrmmSkillsMaster.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetHrmmSkillsMaster", new { id = hrmmSkillsMaster.PnCompanyId }, hrmmSkillsMaster);
        }

        // DELETE: api/HrmmSkillsMasters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHrmmSkillsMaster(int id)
        {
            var hrmmSkillsMaster = await _context.HrmmSkillsMasters.FindAsync(id);
            if (hrmmSkillsMaster == null)
            {
                return NotFound();
            }

            _context.HrmmSkillsMasters.Remove(hrmmSkillsMaster);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HrmmSkillsMasterExists(int id)
        {
            return _context.HrmmSkillsMasters.Any(e => e.PnCompanyId == id);
        }
    }
}
