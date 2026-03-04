using HRMSAPPLICATION.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
namespace HRMSAPPLICATION.Infrastructure
{
    public class TenantDbContextFactory
    {
        private readonly IConfiguration _config;
        public TenantDbContextFactory(IConfiguration config)
        {
            _config = config;
        }
        /// <summary>
        /// new helper method:creates contextby extracting the Db name from the token handler
        /// </summary>
        public HrmsystemContext CreateFromUser(ClaimsPrincipal user)
        {
            // Extract the "DbName" claim we added in the TokenHandler
            var dbName = user.FindFirst("DbName")?.Value;

            if (string.IsNullOrEmpty(dbName))
            {
                throw new UnauthorizedAccessException("Database claim is missing from the token.");
            }

            return Create(dbName);
        }
        public HrmsystemContext Create(string databaseName)
        {
            var baseConn = _config.GetConnectionString("MasterDb");
            var connBuilder = new SqlConnectionStringBuilder(baseConn)
            {
                InitialCatalog = databaseName
            };

            string tenantConnectionString = connBuilder.ConnectionString;
            var options=new DbContextOptionsBuilder<HrmsystemContext>().UseSqlServer(connBuilder.ConnectionString).Options;
            return new HrmsystemContext(options);
        }
    }
}
