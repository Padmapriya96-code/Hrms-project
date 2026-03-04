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
    public class SalaryStructuresController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public SalaryStructuresController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/SalaryStructures
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalaryStructure>>> GetSalaryStructures()
        {
            return await _context.SalaryStructures.ToListAsync();
        }

        // GET: api/SalaryStructures/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SalaryStructure>> GetSalaryStructure(int id)
        {
            var salaryStructure = await _context.SalaryStructures.FindAsync(id);

            if (salaryStructure == null)
            {
                return NotFound();
            }

            return salaryStructure;
        }

        // PUT: api/SalaryStructures/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSalaryStructure(int id, SalaryStructure salaryStructure)
        {
            if (id != salaryStructure.Id)
            {
                return BadRequest();
            }

            _context.Entry(salaryStructure).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalaryStructureExists(id))
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

        // POST: api/SalaryStructures
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SalaryStructure>> PostSalaryStructure(SalaryStructure salaryStructure)
        {
            _context.SalaryStructures.Add(salaryStructure);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSalaryStructure", new { id = salaryStructure.Id }, salaryStructure);
        }

        // DELETE: api/SalaryStructures/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSalaryStructure(int id)
        {
            var salaryStructure = await _context.SalaryStructures.FindAsync(id);
            if (salaryStructure == null)
            {
                return NotFound();
            }

            _context.SalaryStructures.Remove(salaryStructure);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SalaryStructureExists(int id)
        {
            return _context.SalaryStructures.Any(e => e.Id == id);
        }
    }
}
