using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymBank
{
    public int PnBankId { get; set; }

    public string? VBankName { get; set; }

    public string? VBankCode { get; set; }

    public string? Status { get; set; }

    public int? PnCompanyId { get; set; }

    public int? PnBranchId { get; set; }

    public string? BranchName { get; set; }

    public string? AccountType { get; set; }

    public string? MicrCode { get; set; }

    public string? IfscCode { get; set; }

    public string? Address { get; set; }

    public string? Others { get; set; }
}
