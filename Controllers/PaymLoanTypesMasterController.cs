using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Models;
using HRMSAPPLICATION.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using HRMSAPPLICATION.DTO;


namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymLoanTypesMasterController : Controller
    {
        private readonly TenantDbContextFactory _factory;
        public PaymLoanTypesMasterController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }
        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);
        }
        [HttpGet]
        public async Task<IActionResult> Getall()

        {
            using var context = GetTenantContext();
            var iems = await context.PaymLoanTypeMasters.
                ToListAsync();
            return Ok(iems);

        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PaymLoanTypeDto dto)
        {
            using var context = GetTenantContext();
            var newItem = new PaymLoanTypeMaster
            {
                VLoanTypeName = dto.VLoanTypeName,
                Status = dto.Status,

                PnCompanyID = 1//logic to get this from claims
            };
            context.PaymLoanTypeMasters.Add(newItem);
            await context.SaveChangesAsync();
            return Ok(newItem);
        }
            
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PaymLoanTypeDto dto)
        {
            using var context = GetTenantContext();
            var existing=await context.PaymLoanTypeMasters.FindAsync(id);
            if (existing==null)
                return NotFound();
            existing.VLoanTypeName=dto.VLoanTypeName;
            existing.Status=dto.Status;
            await context.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            using var context = GetTenantContext();
            var existing=await context.PaymLoanTypeMasters.FindAsync(id);
            if (existing==null)
                return NotFound();
            context.PaymLoanTypeMasters.Remove(existing);
            await context.SaveChangesAsync();
            return NoContent ();
        }
    }
}
