using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymOverHeadingCost
{
    public int PnCompanyId { get; set; }

    public int BranchId { get; set; }

    public int OverHeadingId { get; set; }

    public string OverHeadingName { get; set; } = null!;

    public string? Status { get; set; }

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
