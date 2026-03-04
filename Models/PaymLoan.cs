using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymLoan
{
    public int PnCompanyid { get; set; }

    public int PnLoanId { get; set; }

    public string? VLoanName { get; set; }

    public string? VLoanCode { get; set; }

    public string? Status { get; set; }

    public int? PnBranchId { get; set; }

    public virtual ICollection<LoanEntry> LoanEntries { get; set; } = new List<LoanEntry>();

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
