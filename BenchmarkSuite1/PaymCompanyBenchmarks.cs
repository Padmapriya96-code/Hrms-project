//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text.Json;
//using BenchmarkDotNet.Attributes;
//using BenchmarkDotNet.Diagnosers;
//using HRMSAPPLICATION.Models;

//namespace HRMSAPPLICATION.Benchmarks
//{
//    [MemoryDiagnoser]
//    public class PaymCompanyBenchmarks
//    {
//        private List<PaymCompany> companies;
//        private JsonSerializerOptions jsonOptions;
//        [GlobalSetup]
//        public void Setup()
//        {
//            jsonOptions = new JsonSerializerOptions
//            {
//                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
//            };
//            companies = new List<PaymCompany>();
//            for (int i = 0; i < 5000; i++)
//            {
//                companies.Add(new PaymCompany { PnCompanyId = i, CompanyCode = "C" + i, CompanyName = "Company" + i, AddressLine1 = "Addr1", AddressLine2 = "Addr2", City = "City", State = "State", Country = "Country", ZipCode = "00000", PhoneNo = "0000000000", FaxNo = "", EmailId = "email@example.com", AlternateEmailId = "", StartDate = DateTime.UtcNow, EndDate = null, CompanyUserId = "user" + (i % 10) });
//            }
//        }

//        [Benchmark]
//        public int ProjectAndCount()
//        {
//            var q = companies.Where(c => c.CompanyUserId == "user1").Select(c => new { c.PnCompanyId, c.CompanyCode, c.CompanyName, c.AddressLine1, c.City, c.State, c.Country, c.ZipCode, c.PhoneNo, c.EmailId });
//            return q.Count();
//        }

//        [Benchmark]
//        public string SerializeProjected()
//        {
//            var projected = companies.Where(c => c.CompanyUserId == "user1").Select(c => new { c.PnCompanyId, c.CompanyCode, c.CompanyName, c.AddressLine1, c.City, c.State, c.Country, c.ZipCode, c.PhoneNo, c.EmailId }).ToList();
//            return JsonSerializer.Serialize(projected, jsonOptions);
//        }
//    }
//}