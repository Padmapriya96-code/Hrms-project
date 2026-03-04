using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymLoanDiminishing
{
    public int Id { get; set; }

    public int? PnCompanyid { get; set; }

    public int? PnBranchid { get; set; }

    public int? PnEmployeeid { get; set; }

    public int? FnLoanId { get; set; }

    public string? LoanAppid { get; set; }

    public double? LoanAmount { get; set; }

    public decimal? BalanceAmt { get; set; }

    public int? InstallementCount { get; set; }

    public DateTime? EffDate { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public decimal? InstalAmt { get; set; }

    public int? Months { get; set; }

    public string? LoanStatus { get; set; }
}
