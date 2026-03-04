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
    public class PaymEmployeeProfile1Controller : ControllerBase
    {
        private readonly HrmsystemContext _context;

        public PaymEmployeeProfile1Controller(HrmsystemContext context)
        {
            _context = context;
        }

        // GET: api/PaymEmployeeProfile1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymEmployeeProfile1>>> GetPaymEmployeeProfile1s()
        {
            return await _context.PaymEmployeeProfile1s.ToListAsync();
        }

        // GET: api/PaymEmployeeProfile1/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymEmployeeProfile1>> GetPaymEmployeeProfile1(int id)
        {
            var paymEmployeeProfile1 = await _context.PaymEmployeeProfile1s.FindAsync(id);

            if (paymEmployeeProfile1 == null)
            {
                return NotFound();
            }

            return paymEmployeeProfile1;
        }

        // PUT: api/PaymEmployeeProfile1/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaymEmployeeProfile1(int id, PaymEmployeeProfile1 paymEmployeeProfile1)
        {
            if (id != paymEmployeeProfile1.Id)
            {
                return BadRequest();
            }

            _context.Entry(paymEmployeeProfile1).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymEmployeeProfile1Exists(id))
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

        // POST: api/PaymEmployeeProfile1
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public string PostPaymEmployeeProfile1(PaymEmployeeProfile1 paymEmployeeProfile1)
        {
            {/* _context.PaymEmployeeProfile1s.Add(paymEmployeeProfile1);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaymEmployeeProfile1", new { id = paymEmployeeProfile1.Id }, paymEmployeeProfile1); */
            }

            String query = $"insert into paym_employee_profile1 values({paymEmployeeProfile1.PnCompanyId},{paymEmployeeProfile1.PnBranchId},{paymEmployeeProfile1.PnEmployeeId},{paymEmployeeProfile1.PnDivisionId},{paymEmployeeProfile1.PnDepartmentId},{paymEmployeeProfile1.PnDesingnationId},{paymEmployeeProfile1.PnGradeId},{paymEmployeeProfile1.PnShiftId},{paymEmployeeProfile1.PnCategoryId},{paymEmployeeProfile1.PnJobStatusId},{paymEmployeeProfile1.PnLevelId},{paymEmployeeProfile1.PnProjectsiteId},'{paymEmployeeProfile1.d_Date}','{paymEmployeeProfile1.VReason}',{paymEmployeeProfile1.RDepartment},)";

            var result = _context.Database.ExecuteSqlRaw(query);



            return "values sent to paym_employee_profile1";
        }

        // DELETE: api/PaymEmployeeProfile1/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaymEmployeeProfile1(int id)
        {
            var paymEmployeeProfile1 = await _context.PaymEmployeeProfile1s.FindAsync(id);
            if (paymEmployeeProfile1 == null)
            {
                return NotFound();
            }

            _context.PaymEmployeeProfile1s.Remove(paymEmployeeProfile1);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymEmployeeProfile1Exists(int id)
        {
            return _context.PaymEmployeeProfile1s.Any(e => e.Id == id);
        }
    }
}