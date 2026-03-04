using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class LoanEntry
{
    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public int PnEmployeeId { get; set; }

    public string? LoanAutoId { get; set; }

    public int FnLoanId { get; set; }

    public DateTime? SanDate { get; set; }

    public DateTime? DEffdate { get; set; }

    public decimal? LoanAmt { get; set; }

    public decimal? InstalmentAmt { get; set; }

    public int? Instalmentcount { get; set; }

    public decimal? BalanceAmt { get; set; }

    public string? CStatus { get; set; }

    public string? LoanName { get; set; }

    public string? LoanProcess { get; set; }

    public string? LoanCalculation { get; set; }

    public string? Comments { get; set; }

    public string LoanAppid { get; set; } = null!;

    public decimal? Interest { get; set; }

    public decimal? TotInterestAmt { get; set; }

    public string? EmpName { get; set; }

    public string? LoanStatus { get; set; }

    public DateTime? LasttransactionFrom { get; set; }

    public DateTime? LasttransactionTo { get; set; }

    public virtual PaymBranch PaymBranch { get; set; } = null!;

    public virtual PaymLoan PaymLoan { get; set; } = null!;
}
