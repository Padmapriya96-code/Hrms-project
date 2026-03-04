using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class LoanPreCloser
{
    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public int PnEmployeeId { get; set; }

    public string LoanAppid { get; set; } = null!;

    public DateTime DDate { get; set; }

    public decimal? NLoanamount { get; set; }

    public double? NBalanceamount { get; set; }

    public double? NPaidamount { get; set; }

    public double? NClosureamount { get; set; }

    public string? NCheckno { get; set; }

    public DateTime? DCheckdate { get; set; }

    public double? NCheckamount { get; set; }

    public string? VBankname { get; set; }

    public string? VRemarks { get; set; }

    public string? CStatus { get; set; }

    public decimal? IntAmt { get; set; }

    public string? PaymentMode { get; set; }

    public string? LoanProcess { get; set; }

    public decimal? LoanInterest { get; set; }

    public string? LoanName { get; set; }

    public virtual PaymBranch PaymBranch { get; set; } = null!;
}
