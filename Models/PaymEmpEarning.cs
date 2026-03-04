using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymEmpEarning
{
    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public int PnEmployeeId { get; set; }

    public int PnEarningsId { get; set; }

    public int Pid { get; set; }

    public int Id { get; set; }

    public int? NAmount { get; set; }

    public DateTime DDate { get; set; }

    public string? CEligible { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public string? Flag { get; set; }

    public virtual PaymBranch PaymBranch { get; set; } = null!;

    public virtual PaymEarning PaymEarning { get; set; } = null!;

    public virtual PaymEmployee PaymEmployee { get; set; } = null!;
}
