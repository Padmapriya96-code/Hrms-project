using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PayoutputLoan
{
    public int Id { get; set; }

    public int? PnCompanyid { get; set; }

    public int? PnEmployeeid { get; set; }

    public int? PnLoanid { get; set; }

    public DateTime? DDate { get; set; }

    public DateTime? DFromDate { get; set; }

    public DateTime? DToDate { get; set; }

    public decimal? Amount { get; set; }

    public int? CountInstallement { get; set; }

    public int? PnBranchid { get; set; }

    public int? InstallementCount { get; set; }

    public string? LoanAppid { get; set; }

    public decimal? InstalAmt { get; set; }

    public decimal? BalanceAmt { get; set; }

    public string? LoanStatus { get; set; }
}
