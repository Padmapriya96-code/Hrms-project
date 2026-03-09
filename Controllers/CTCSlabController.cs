using HRMSAPPLICATION.Controllers;
using HRMSAPPLICATION.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;
using HRMSAPPLICATION.DTO;
using Microsoft.AspNetCore.Authorization;



namespace HRMSAPPLICATION.Controllers
{
    public class CTCSlabController : Controller
    {
        private readonly TenantDbContextFactory _factory;
        public CTCSlabController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }
        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);
        }
        [HttpGet]
        public async Task<ActionResult<CTCSlab>> GetAll()
        {
            using var context = GetTenantContext();
            var items = await context.CTCSlabs.ToListAsync();
            return Ok(items);
        }
        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] CTCSlabDto dto)
        {
            using var context = GetTenantContext();
            var existing = await context.CTCSlabs.FindAsync(id);
            if (existing == null)
                return NotFound();
            existing.MinCTC = dto.MinCTC;
            existing.MaxCTC = dto.MaxCTC;
            existing.MaxLoanAmount = dto.MaxLoanAmount;
            existing.InterestRate = dto.InterestRate;
            existing.LoanType = dto.LoanName;
            await context.SaveChangesAsync();
            return Ok(existing);
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            using var context = GetTenantContext();
            var existing = await context.CTCSlabs.FindAsync(id);
            if (existing == null)
                return NotFound();
            context.CTCSlabs.Remove(existing);
            await context.SaveChangesAsync();
            return NoContent();
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CTCSlabDto dto)
        {
            using var context = GetTenantContext();
            int companyId = User.FindFirst("CompanyID") != null ? int.Parse(User.FindFirst("CompanyID").Value) : 0;
            int branchId = User.FindFirst("BranchID") != null ? int.Parse(User.FindFirst("BranchID").Value) : 0;
            //map entity to dtoand save
            var entity = new CTCSlab
            {
                MinCTC = dto.MinCTC,
                MaxCTC = dto.MaxCTC,
                MaxLoanAmount = dto.MaxLoanAmount,
                InterestRate = dto.InterestRate,
                LoanID = dto.LoanName
            };
            context.CTCSlabs.Add(entity);
            await context.SaveChangesAsync();
            return Ok(entity);
        }
    }
}
