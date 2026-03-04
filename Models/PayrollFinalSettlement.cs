using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PayrollFinalSettlement
{
    public int PnCompanyid { get; set; }

    public int PnBranchid { get; set; }

    public string ReferenceNo { get; set; } = null!;

    public int PnEmployeeid { get; set; }

    public string JoiningDate { get; set; } = null!;

    public string? LastWorkingDate { get; set; }

    public int? ServiceYear { get; set; }

    public decimal? GrauityAmount { get; set; }

    public decimal? PfAmount { get; set; }

    public decimal? EncashmentAmount { get; set; }

    public decimal? LoanAmount { get; set; }

    public decimal? DeductSalaryAmount { get; set; }

    public decimal? FinalAmount { get; set; }

    public string? Status { get; set; }
}
