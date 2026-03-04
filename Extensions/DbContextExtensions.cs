using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Data;
using System.Dynamic;

namespace HRMSAPPLICATION.Extensions
{
    public static class DbContextExtensions
    {
        public static async Task<List<dynamic>> SqlQueryAsync(this DatabaseFacade database, string sql, params object[] parameters)
        {
            using (var command = database.GetDbConnection().CreateCommand())
            {
                command.CommandText = sql;
                if (command.Connection.State == ConnectionState.Closed)
                {
                    await command.Connection.OpenAsync();
                }

                using (var result = await command.ExecuteReaderAsync())
                {
                    var entities = new List<dynamic>();
                    var cols = new List<string>();

                    for (int i = 0; i < result.FieldCount; i++)
                    {
                        cols.Add(result.GetName(i));
                    }

                    while (await result.ReadAsync())
                    {
                        var obj = new ExpandoObject() as IDictionary<string, object>;

                        foreach (var col in cols)
                        {
                            obj[col] = result[col];
                        }

                        entities.Add(obj);
                    }

                    return entities;
                }
            }
        }
    }
}
