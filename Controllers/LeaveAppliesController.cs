using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;
using System.Runtime.InteropServices;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymousJwt]
    public class LeaveAppliesController : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public LeaveAppliesController(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/LeaveApplies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeaveApply>>> GetLeaveApplies()
        {
            
            return await _context.LeaveApplys.ToListAsync();
        }

        // GET: api/LeaveApplies/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LeaveApply>> GetLeaveApply(int id)
        {
            var leaveApply = await _context.LeaveApplys.FindAsync(id);

            if (leaveApply == null)
            {
                return NotFound();
            }

            return leaveApply;
        }

        // PUT: api/LeaveApplies/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLeaveApply(int id, LeaveApply leaveApply)
        {
            if (id != leaveApply.Sno)
            {
                return BadRequest();
            }

            _context.Entry(leaveApply).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeaveApplyExists(id))
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

        // POST: api/LeaveApplies
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public  String PostLeaveApply(LeaveApply leaveApply)
        {

            _context.Database.ExecuteSqlRaw($"insert into leave_apply values({leaveApply.PnCompanyId},{leaveApply.PnBranchId},{leaveApply.PnEmployeeId},'{leaveApply.EmpCode}','{leaveApply.EmpName}',{leaveApply.PnLeaveId},'{leaveApply.PnLeavename}','{leaveApply.PnLeavecode}','{leaveApply.FromDate}','{leaveApply.FromStatus}','{leaveApply.ToDate}','{leaveApply.Status}',{leaveApply.Days}," +
                $"'{leaveApply.Reason}','{leaveApply.SubmittedDate}','{leaveApply.Approve}','{leaveApply.Reminder}','{leaveApply.Priority}','{leaveApply.Comments}','{leaveApply.Record}' ,'{leaveApply.Flag}',{leaveApply.Yearend}" +
                $")");



            /*  _context.LeaveApplies.Add(leaveApply);
              await _context.SaveChangesAsync();

              return CreatedAtAction("GetLeaveApply", new { id = leaveApply.Sno }, leaveApply);
         */
            return "leave applied successfully";
        
        }

        // DELETE: api/LeaveApplies/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveApply(int id)
        {
            var leaveApply = await _context.LeaveApplys.FindAsync(id);
            if (leaveApply == null)
            {
                return NotFound();
            }

            _context.LeaveApplys.Remove(leaveApply);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LeaveApplyExists(int id)
        {
            return _context.LeaveApplys.Any(e => e.Sno == id);
        }
    }
}
