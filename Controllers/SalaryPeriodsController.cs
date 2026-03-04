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
    public class SalaryPeriodsController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public SalaryPeriodsController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/SalaryPeriods
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalaryPeriod>>> GetSalaryPeriods()
        {
            return await _context.SalaryPeriods.ToListAsync();
        }

        // GET: api/SalaryPeriods/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SalaryPeriod>> GetSalaryPeriod(DateTime id)
        {
            var salaryPeriod = await _context.SalaryPeriods.FindAsync(id);

            if (salaryPeriod == null)
            {
                return NotFound();
            }

            return salaryPeriod;
        }

        // PUT: api/SalaryPeriods/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSalaryPeriod(DateTime id, SalaryPeriod salaryPeriod)
        {
            if (id != salaryPeriod.FromDate)
            {
                return BadRequest();
            }

            _context.Entry(salaryPeriod).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalaryPeriodExists(id))
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

        // POST: api/SalaryPeriods
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SalaryPeriod>> PostSalaryPeriod(SalaryPeriod salaryPeriod)
        {
            _context.SalaryPeriods.Add(salaryPeriod);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SalaryPeriodExists(salaryPeriod.FromDate))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetSalaryPeriod", new { id = salaryPeriod.FromDate }, salaryPeriod);
        }

        // DELETE: api/SalaryPeriods/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSalaryPeriod(DateTime id)
        {
            var salaryPeriod = await _context.SalaryPeriods.FindAsync(id);
            if (salaryPeriod == null)
            {
                return NotFound();
            }

            _context.SalaryPeriods.Remove(salaryPeriod);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SalaryPeriodExists(DateTime id)
        {
            return _context.SalaryPeriods.Any(e => e.FromDate == id);
        }
    }
}
