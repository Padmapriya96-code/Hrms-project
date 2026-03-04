using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymPaybill
{
    public int Id { get; set; }

    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public int PnEmployeeId { get; set; }

    public string? EmployeeCode { get; set; }

    public string? EmployeeFirstName { get; set; }

    public string? DesignationName { get; set; }

    public string? DepartmentName { get; set; }

    public string? GradeName { get; set; }

    public string? CategoryName { get; set; }

    public string? JoiningDate { get; set; }

    public DateTime? DDate { get; set; }

    public double? EarnAmount { get; set; }

    public double? DedAmount { get; set; }

    public double? NetPay { get; set; }

    public double? EarnedBasic { get; set; }

    public double? GrossSalary { get; set; }

    public double? NetSalary { get; set; }

    public double? Epf { get; set; }

    public double? Fpf { get; set; }

    public string? PeriodCode { get; set; }

    public double? MaxAmount { get; set; }

    public double? ActBasic { get; set; }

    public double? CalcDays { get; set; }

    public double? PaidDays { get; set; }

    public double? PresentDays { get; set; }

    public double? AbsentDays { get; set; }

    public double? WeekOffDays { get; set; }

    public double? Holidays { get; set; }

    public double? TotLeaveDays { get; set; }

    public DateTime? OtHrs { get; set; }

    public double? OtValue { get; set; }

    public double? OtAmt { get; set; }

    public string? Allowance1 { get; set; }

    public double? Value1 { get; set; }

    public string? Allowance2 { get; set; }

    public double? Value2 { get; set; }

    public string? Allowance3 { get; set; }

    public double? Value3 { get; set; }

    public string? Allowance4 { get; set; }

    public double? Value4 { get; set; }

    public string? Allowance5 { get; set; }

    public double? Value5 { get; set; }

    public string? Allowance6 { get; set; }

    public double? Value6 { get; set; }

    public string? Allowance7 { get; set; }

    public double? Value7 { get; set; }

    public string? Allowance8 { get; set; }

    public double? Value8 { get; set; }

    public string? Allowance9 { get; set; }

    public double? Value9 { get; set; }

    public string? Allowance10 { get; set; }

    public double? Value10 { get; set; }

    public string? Deduction1 { get; set; }

    public double? ValueA1 { get; set; }

    public string? Deduction2 { get; set; }

    public double? ValueA2 { get; set; }

    public string? Deduction3 { get; set; }

    public double? ValueA3 { get; set; }

    public string? Deduction4 { get; set; }

    public double? ValueA4 { get; set; }

    public string? Deduction5 { get; set; }

    public double? ValueA5 { get; set; }

    public string? Deduction6 { get; set; }

    public double? ValueA6 { get; set; }

    public string? Deduction7 { get; set; }

    public double? ValueA7 { get; set; }

    public string? Deduction8 { get; set; }

    public double? ValueA8 { get; set; }

    public string? Deduction9 { get; set; }

    public double? ValueA9 { get; set; }

    public string? Deduction10 { get; set; }

    public double? ValueA10 { get; set; }

    public string? CompanyName { get; set; }

    public string? AddressLine1 { get; set; }

    public string? AddressLine2 { get; set; }

    public string? City { get; set; }

    public int? Zipcode { get; set; }
}
