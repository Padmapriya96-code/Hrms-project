using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymLevel
{
    public int PnCompanyId { get; set; }

    public int BranchId { get; set; }

    public int PnLevelId { get; set; }

    public string VLevelName { get; set; } = null!;

    public string? Status { get; set; }

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
