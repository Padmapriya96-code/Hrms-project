using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PayOutputNetPay
{
    public int PnCompanyId { get; set; }

    public int? PnBranchId { get; set; }

    public int PnEmployeeId { get; set; }

    public DateTime DDate { get; set; }

    public DateTime? DFromDate { get; set; }

    public DateTime? DToDate { get; set; }

    public double? EarnActAmount { get; set; }

    public double? EarnAmount { get; set; }

    public double? OtAmt { get; set; }

    public double? DedActAmount { get; set; }

    public double? DedAmount { get; set; }

    public double? NetPay { get; set; }

    public double? ActBasic { get; set; }

    public double? EarnedBasic { get; set; }

    public double? GrossSalary { get; set; }

    public double? NetSalary { get; set; }

    public string? PeriodCode { get; set; }

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
