using Microsoft.EntityFrameworkCore;
namespace HRMSAPPLICATION.Models
{
    public class MasterDbContext:DbContext
    {
        public MasterDbContext(DbContextOptions<MasterDbContext> options) : base(options) { }
        public DbSet<signup> signups { get; set; }
        public DbSet<Branchlogin> branchLogins { get; set; }
        public DbSet<EmployeesLogin> employeeLogins { get; set; }
    }
}
