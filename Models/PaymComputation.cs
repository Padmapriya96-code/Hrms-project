using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymComputation
{
    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public int Id { get; set; }

    public string? Type { get; set; }

    public string PnEarningsCode { get; set; } = null!;

    public double? Value { get; set; }
}
