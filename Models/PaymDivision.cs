using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymDivision
{
    public int PnCompanyId { get; set; }

    public int BranchId { get; set; }

    public int PnDivisionId { get; set; }

    public string VDivisionName { get; set; } = null!;

    public string? Status { get; set; }

    public virtual PaymCompany? PnCompany { get; set; }
}
