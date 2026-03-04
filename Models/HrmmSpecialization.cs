using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class HrmmSpecialization
{
    public int PnCompanyId { get; set; }

    public int PnSpecializationId { get; set; }

    public string VSpecializationName { get; set; } = null!;

    public string? Status { get; set; }

    public int? PnBranchId { get; set; }

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
