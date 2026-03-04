using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        HrmsystemContext _dbContext;

        // GET: api/<AttendanceController>
        
        public AttendanceController(HrmsystemContext _dbContext)
        {
            this._dbContext = _dbContext;

        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetDailyAttendance()
        {
            return await _dbContext.Attendances.ToListAsync<Attendance>();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Attendance>> GetDailyAttendence(int id)
        {
            var attedence = await _dbContext.Attendances.FindAsync(id);

            if (attedence== null)
            {
                return NotFound();
            }

            return attedence;
        }

        // POST api/<AttendanceController>
        [HttpPost]
        public async Task<ActionResult<Attendance>> PostAttendence(Attendance attendance)
        {
            _dbContext.Attendances.Add(attendance);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction("GetAttedence", new { id = attendance.Id }, attendance);
        }


        // PUT: api/DailyAttendences/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDailyAttedence(int id, Attendance attendance)
        {
            if (id != attendance.Id)
            {
                return BadRequest();
            }

            _dbContext.Entry(attendance).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttendenceExists(id))
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

        private bool AttendenceExists(int id)
        {
            throw new NotImplementedException();
        }

        // DELETE: api/DailyAttendence/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDailyAttendence(int id)
        {
            var attendence = await _dbContext.Attendances.FindAsync(id);
            if (attendence == null)
            {
                return NotFound();
            }

            _dbContext.Attendances.Remove(attendence);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

      
    }
}
