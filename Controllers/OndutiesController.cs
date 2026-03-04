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
    public class OndutiesController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public OndutiesController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/Onduties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Onduty>>> GetOnduties()
        {
            return await _context.Onduties.ToListAsync();
        }

        // GET: api/Onduties/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Onduty>> GetOnduty(int id)
        {
            var onduty = await _context.Onduties.FindAsync(id);

            if (onduty == null)
            {
                return NotFound();
            }

            return onduty;
        }

        // PUT: api/Onduties/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOnduty(int id, Onduty onduty)
        {
            if (id != onduty.PnCompanyid)
            {
                return BadRequest();
            }

            _context.Entry(onduty).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OndutyExists(id))
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

        // POST: api/Onduties
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Onduty>> PostOnduty(Onduty onduty)
        {
            _context.Onduties.Add(onduty);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (OndutyExists(onduty.PnCompanyid))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetOnduty", new { id = onduty.PnCompanyid }, onduty);
        }

        // DELETE: api/Onduties/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOnduty(int id)
        {
            var onduty = await _context.Onduties.FindAsync(id);
            if (onduty == null)
            {
                return NotFound();
            }

            _context.Onduties.Remove(onduty);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OndutyExists(int id)
        {
            return _context.Onduties.Any(e => e.PnCompanyid == id);
        }
    }
}
