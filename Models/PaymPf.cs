using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymPf
{
    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public double? EmpConPf { get; set; }

    public double? EmpConEpf { get; set; }

    public double? EmpConFpf { get; set; }

    public double? AdminCharges { get; set; }

    public double? EligibilityAmt { get; set; }

    public string? CRound { get; set; }

    public DateTime DDate { get; set; }

    public string? CheckCeiling { get; set; }

    public int? MaxAmount { get; set; }

    public string? CheckAllowance { get; set; }

    public string? Month { get; set; }

    public int? Year { get; set; }

    public virtual PaymBranch PaymBranch { get; set; } = null!;
}
