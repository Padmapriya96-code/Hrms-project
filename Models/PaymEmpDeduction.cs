using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymEmpDeduction
{
    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public int PnEmployeeId { get; set; }

    public int PnDeductionId { get; set; }

    public double? NAmount { get; set; }

    public DateTime DDate { get; set; }

    public string? CEligible { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public string? PeriodCode { get; set; }

    public virtual PaymBranch PaymBranch { get; set; } = null!;

    public virtual PaymDeduction PaymDeduction { get; set; } = null!;

    public virtual PaymEmployee PaymEmployee { get; set; } = null!;
}
