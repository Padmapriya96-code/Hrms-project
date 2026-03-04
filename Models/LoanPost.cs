using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class LoanPost
{
    public string LoanReqno { get; set; } = null!;

    public DateTime? ReqDate { get; set; }

    public int? Employeeid { get; set; }

    public string? Employeename { get; set; }

    public string? LoanAppid { get; set; }

    public string? LoanType { get; set; }

    public string? LoanName { get; set; }

    public decimal? LoanAmount { get; set; }

    public DateTime? MonthToPosted { get; set; }

    public DateTime? MonthPostedOn { get; set; }

    public int? RemMonth { get; set; }

    public decimal? Postedamt { get; set; }

    public decimal? BalanceAmt { get; set; }

    public string? ApproveBy { get; set; }

    public int? PnCompanyid { get; set; }

    public int? PnBranchid { get; set; }
}
