namespace HRMSAPPLICATION.DTO
{
    public class UserAccountsDTO
    {
        public string? Username { get; set; }
        public string? Password { get; set; }

        // 🔹 Branch fields
        public string? BranchUserId { get; set; }
        public string? BranchPassword { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        // 🔹 Employee fields
        public string? EmployeeUserId { get; set; }
        public string? EmployeePassword { get; set; }
        public string? EmployeeFullName { get; set; }
        public string CompanyName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public string Address { get; set; }

        // 🔹 Database (tenant) name
        public string? DatabaseName { get; set; }
    }
}
