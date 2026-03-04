using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymGrade
{
    public int PnCompanyId { get; set; }

    public int BranchId { get; set; }

    public int PnGradeId { get; set; }

    public string VGradeName { get; set; } = null!;

    public string? Status { get; set; }

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
