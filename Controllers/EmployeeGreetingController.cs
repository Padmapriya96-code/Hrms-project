using HRMSAPPLICATION.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymousJwt]
    public class EmployeeGreetingController : Controller
    {
        private readonly HrmsystemContext _context;

        public EmployeeGreetingController(HrmsystemContext context)
        {
            _context = context;
        }

        [HttpGet("BirthdayGreetingForEmployee")]
        public IActionResult BirthdayGreetingForEmployee(string username, string password)
        {
            // 1. Authenticate
            var employee = _context.PaymEmployees
                .FirstOrDefault(e => e.EmployeeCode == username && e.Password == password);

            if (employee == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            var today = DateTime.Today;

            // 2. Check if it's the logged-in employee's birthday
            if (employee.DateofBirth.HasValue &&
                employee.DateofBirth.Value.Day == today.Day &&
                employee.DateofBirth.Value.Month == today.Month)
            {
                var message = $"🎉 Happy Birthday, {employee.EmployeeFullName ?? employee.EmployeeFirstName}!";
                return Ok(new
                {
                    EmployeeId = employee.PnEmployeeId,
                    FullName = employee.EmployeeFullName ?? $"{employee.EmployeeFirstName} {employee.EmployeeLastName}",
                    Message = message,
                    IsOwnBirthday = true
                });
            }

            // 3. Check for other employees with birthdays today (excluding the logged-in user)
            var birthdayEmployees = _context.PaymEmployees
                .Where(e => e.EmployeeCode != username &&
                            e.DateofBirth.HasValue &&
                            e.DateofBirth.Value.Day == today.Day &&
                            e.DateofBirth.Value.Month == today.Month)
                .ToList();

            if (birthdayEmployees.Any())
            {
                List<string> names = birthdayEmployees
                    .Select(e => e.EmployeeFullName ?? $"{e.EmployeeFirstName} {e.EmployeeLastName}")
                    .ToList();

                string namesString = string.Join(", ", names);
                string message = $"🎉 Today is {namesString}'s birthday! 🎂";

                return Ok(new
                {
                    Message = message,
                    IsOwnBirthday = false
                });
            }

            // 4. No birthdays today
            return Ok(new
            {
                Message = "",
                IsOwnBirthday = false
            });
        }

        [HttpGet("BranchWiseBirthdayGreeting")]
        public IActionResult BranchWiseBirthdayGreeting(int companyId, int branchId)
        {
            var today = DateTime.Today;

            var birthdayEmployees = _context.PaymEmployees
                .Where(e =>
                    e.PnCompanyId == companyId &&
                    e.PnBranchId == branchId &&
                    e.DateofBirth.HasValue &&
                    e.DateofBirth.Value.Day == today.Day &&
                    e.DateofBirth.Value.Month == today.Month)
                .Select(e => new
                {
                    EmployeeId = e.PnEmployeeId,
                    FullName = e.EmployeeFullName ?? $"{e.EmployeeFirstName} {e.EmployeeLastName}",
                    Message = $"🎉 Happy Birthday, {e.EmployeeFullName ?? e.EmployeeFirstName}!"
                })
                .ToList();

            return Ok(birthdayEmployees);
        }
    }
}
