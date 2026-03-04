using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeAggregateController : ControllerBase

    {


        private readonly HrmsystemContext _context;

        public EmployeeAggregateController(HrmsystemContext context)
        {
            _context = context;
        }

      

        [HttpGet("{companyId}/{branchId}")]
        public async Task<ActionResult<decimal>> GetAverageSalary(int companyId, int branchId)
        {
            try
            {
                // Calculate the average BasicSalary for employees with the specified companyId and branchId
                var averageSalary = await _context.PaymEmployees
                    .Where(employee => employee.PnCompanyId == companyId && employee.PnBranchId == branchId)
                    .AverageAsync(employee => employee.BasicSalary);

                return Ok(averageSalary);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving average salary: {ex.Message}");
            }
        }


        [HttpGet]

        public async Task<ActionResult<decimal>> GetSummary()
        {
            var data = await _context.PaymLeaves.CountAsync(employee => true);
            return Ok(data);
        }
    }
}
