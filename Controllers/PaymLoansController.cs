using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
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
    public class PaymLoansController : ControllerBase
    {
        private readonly TenantDbContextFactory _factory;

        public PaymLoansController(TenantDbContextFactory factory)
        {
            _factory = factory;
        }
        private HrmsystemContext GetTenantContext()
        {
            return _factory.CreateFromUser(User);
        }
        // GET: api/PaymLoans
        [HttpGet("{companyId}/{loanId}")]
        public async Task<IActionResult> Get(int companyId,int loanId)
        {
            using var context = GetTenantContext();
            //use both the keys to find the record
            var item = await context.PaymLoans.FindAsync(companyId, loanId);
            return item == null ? NotFound() : Ok(item);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PaymLoanDto dto)
        {
            using var context = GetTenantContext();
            //generate a new loan id
            int newLoanId = 1;
            var newLoan = new PaymLoan
            {
                PnCompanyid = newLoanId,
                PnBranchId = dto.PnBranchId,
                Status = dto.Status,
                VLoanCode = dto.VLoanCode,
                VLoanName = dto.VLoanName

            };
            context.PaymLoans.Add(newLoan);
            await context.SaveChangesAsync();
            return Ok(newLoan);
        }
        [HttpPut("{companyId}/{loanId}")]
        public async Task<IActionResult> Update(int companyId,int loanId,PaymLoanDto dto)
        {
            using var context = GetTenantContext();
            var existing = await context.PaymLoans.FindAsync(companyId, loanId);
            if (existing == null)
                return NotFound();
            existing.PnBranchId = dto.PnBranchId;
            existing.Status = dto.Status;
            existing.VLoanCode = dto.VLoanCode;
            existing.VLoanName = dto.VLoanName;
            await context.SaveChangesAsync();
            return Ok(existing);
        }
        [HttpDelete("{companyId}/{loanId}")]
        public async Task<IActionResult> Delete(int companyId,int loanId)
        {
            using var context = GetTenantContext();
            var existing = await context.PaymLoans.FindAsync(companyId, loanId);
            if (existing == null)
                return NotFound();
            context.PaymLoans.Remove(existing);
            await context.SaveChangesAsync();
            return NoContent();
        }



    }
}
