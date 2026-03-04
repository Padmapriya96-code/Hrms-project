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
    [AllowAnonymousJwt]
    public class HrmmCoursesController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public HrmmCoursesController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/HrmmCourses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HrmmCourse>>> GetHrmmCourses()
        {
            return await _context.HrmmCourses.ToListAsync();
        }

        // GET: api/HrmmCourses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HrmmCourse>> GetHrmmCourse(int id)
        {
            var hrmmCourse = await _context.HrmmCourses.FindAsync(id);

            if (hrmmCourse == null)
            {
                return NotFound();
            }

            return hrmmCourse;
        }

        // PUT: api/HrmmCourses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHrmmCourse(int id, HrmmCourse hrmmCourse)
        {
            if (id != hrmmCourse.PnCompanyId)
            {
                return BadRequest();
            }

            _context.Entry(hrmmCourse).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HrmmCourseExists(id))
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

        // POST: api/HrmmCourses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<HrmmCourse>> PostHrmmCourse(HrmmCourse hrmmCourse)
        {
            _context.HrmmCourses.Add(hrmmCourse);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (HrmmCourseExists(hrmmCourse.PnCompanyId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetHrmmCourse", new { id = hrmmCourse.PnCompanyId }, hrmmCourse);
        }

        // DELETE: api/HrmmCourses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHrmmCourse(int id)
        {
            var hrmmCourse = await _context.HrmmCourses.FindAsync(id);
            if (hrmmCourse == null)
            {
                return NotFound();
            }

            _context.HrmmCourses.Remove(hrmmCourse);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HrmmCourseExists(int id)
        {
            return _context.HrmmCourses.Any(e => e.PnCompanyId == id);
        }
    }
}
