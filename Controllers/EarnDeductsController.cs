using HRMSAPPLICATION.Infrastructure;
using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HRMSAPPLICATION.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.CodeAnalysis.CSharp.Syntax;


namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EarnDeductsController : ControllerBase
    {
        private readonly TenantDbContextFactory _factory;
        public EarnDeductsController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }
        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);
        }

        // GET: api/EarnDeduct/1/1/101/2024-05-20
        [HttpGet("{companyId}/{branchId}/{employeeId}/{date}")]
        public async Task<ActionResult<IEnumerable<EarnDeduct>>> GetEarnDeducts(int companyId,int branchId,int employeeId,DateTime date)

        {
            using  var context= GetTenantContext();
            var record = await context.EarnDeducts.FirstOrDefaultAsync(x => x.PnCompanyId == companyId &&
        x.PnBranchId == branchId && x.PnEmployeeId == employeeId && x.DDate == date.Date);
            if (record == null) return NotFound();
            return Ok(record);
           
        }

        // post: api/EarnDeducts
        [HttpPost]
        public async Task<IActionResult> CreateEarnDeduct(EarnDeductDto dto)
        {
            using var context = GetTenantContext();
            var earnDeduct = new EarnDeduct
            {
                PnCompanyId = dto.PncompanyId,
                PnBranchId = dto.PnBranchId,
                PnEmployeeId = dto.PnEmployeeId,
                DDate = dto.DDate,
                Allowance1 = dto.Allowance1,
                Value1 = dto.Value1,
                Allowance2 = dto.Allowance2,
                Value2 = dto.Value2,
                Allowance3 = dto.Allowance3,
                Value3 = dto.Value3,
                Allowance4 = dto.Allowance4,
                Value4 = dto.Value4,
                Allowance5 = dto.Allowance5,
                Value5 = dto.Value5,
                Allowance6 = dto.Allowance6,
                Value6 = dto.Value6,
                Allowance7 = dto.Allowance7,
                Value7 = dto.Value7,
                Allowance8 = dto.Allowance8,
                Value8 = dto.Value8,
                Allowance9 = dto.Allowance9,
                Value9 = dto.Value9,
                Allowance10 = dto.Allowance10,
                Value10 = dto.Value10,
                Deduction1 = dto.Deduction1,
                ValueA1 = dto.ValueA1,
                Deduction2 = dto.Deduction2,
                ValueA2 = dto.ValueA2,
                Deduction3 = dto.Deduction3,
                ValueA3 = dto.ValueA3,
                Deduction4 = dto.Deduction4,
                ValueA4 = dto.ValueA4,
                Deduction5 = dto.Deduction5,
                ValueA5 = dto.ValueA5,
                Deduction6 = dto.Deduction6,
                ValueA6 = dto.ValueA6,
                Deduction7 = dto.Deduction7,
                ValueA7 = dto.ValueA7,
                Deduction8 = dto.Deduction8,
                ValueA8 = dto.ValueA8,
                Deduction9 = dto.Deduction9,
                ValueA9 = dto.ValueA9,
                Deduction10 = dto.Deduction10,
                ValueA10 = dto.ValueA10,
             };
            context.EarnDeducts.Add(earnDeduct);
            try
            {
                await context.SaveChangesAsync();
            }
            catch(DbUpdateException)
            {
                return Conflict("Record with these keys already exists.");
            }
            return Ok(new { message = "Record created successfully" });
        }
        //put:api/EarnDeduct/1/1/101/2024-05-20
        [HttpPut("{companyId}/{branchId}/{employeeId}/{date}")]
        public async Task<IActionResult> UpdateEarnDuduct(int companyId,int branchId,int employeeId,DateTime date, EarnDeductDto dto )
        {
            using var context = GetTenantContext();
            var existing = await context.EarnDeducts
            .FirstOrDefaultAsync(x => x.PnCompanyId == companyId &&
                                     x.PnBranchId == branchId &&
                                     x.PnEmployeeId == employeeId &&
                                     x.DDate.Date == date.Date);
            if (existing == null) return NotFound();
            //update fields
            existing.DFromDate = dto.DFromDate;
            existing.DToDate = dto.DToDate;
            existing.Allowance1 = dto.Allowance1;
            existing.Value1 = dto.Value1;
            existing.Allowance2 = dto.Allowance2;
            existing.Value2 = dto.Value2;
            existing.Allowance3 = dto.Allowance3;
            existing.Value3 = dto.Value3;
            existing.Allowance4 = dto.Allowance4;
            existing.Value4 = dto.Value4;
            existing.Allowance5 = dto.Allowance5;
            existing.Value5 = dto.Value5;
            existing.Allowance6 = dto.Allowance6;
            existing.Value6 = dto.Value6;
            existing.Allowance7 = dto.Allowance7;
            existing.Value7 = dto.Value7;
            existing.Allowance8 = dto.Allowance8;
            existing.Value8 = dto.Value8;
            existing.Allowance9 = dto.Allowance9;
            existing.Value9 = dto.Value9;
            existing.Allowance10 = dto.Allowance10;
            existing.Value10 = dto.Value10;
            existing.Deduction1 = dto.Deduction1;
            existing.ValueA1 = dto.ValueA1;
            existing.Deduction2 = dto.Deduction2;
            existing.ValueA2 = dto.ValueA2;

            existing.Deduction3 = dto.Deduction3;
            existing.ValueA3 = dto.ValueA3;
            existing.Deduction4 = dto.Deduction4;
            existing.ValueA4 = dto.ValueA4;
            existing.Deduction5 = dto.Deduction5;
            existing.ValueA5 = dto.ValueA5;
            existing.Deduction6 = dto.Deduction6;
            existing.ValueA6= dto.ValueA6;
            existing.Deduction7 = dto.Deduction7;
            existing.ValueA7 = dto.ValueA7;
            existing.Deduction8 = dto.Deduction8;
            existing.ValueA8 = dto.ValueA8;
            existing.Deduction9 = dto.Deduction9 ;
            existing.ValueA9 = dto.ValueA9;
            existing.Deduction10 = dto.Deduction10;
            existing.ValueA10 = dto.ValueA10;
            await context.SaveChangesAsync();
            return Ok(new { message = "Updated successfully" });
        }
        // DELETE: api/EarnDeduct/1/1/101/2026-02-26
        [HttpDelete("{companyId}/{branchId}/{employeeId}/{date}")]
        public async Task<IActionResult> DeleteEarnDeduct(int companyId, int branchId, int employeeId, DateTime date)
        {
            using var context = GetTenantContext();

            // Find the record matching the 4-part composite key
            var record = await context.EarnDeducts
                .FirstOrDefaultAsync(x => x.PnCompanyId == companyId &&
                                         x.PnBranchId == branchId &&
                                         x.PnEmployeeId == employeeId &&
                                         x.DDate.Date == date.Date);

            if (record == null)
            {
                return NotFound(new { message = "Record not found" });
            }

            context.EarnDeducts.Remove(record);
            await context.SaveChangesAsync();

            return Ok(new { message = "Record deleted successfully" });
        }

    }
}
