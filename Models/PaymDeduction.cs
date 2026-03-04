using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymDeduction
{
    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public int PnDeductionId { get; set; }

    public string VDeductionCode { get; set; } = null!;

    public string VDeductionName { get; set; } = null!;

    public string? CRegular { get; set; }

    public string? CPrint { get; set; }

    public string? Status { get; set; }

    public int? DOrder { get; set; }

    public virtual ICollection<PaymEmpDeduction> PaymEmpDeductions { get; set; } = new List<PaymEmpDeduction>();

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
