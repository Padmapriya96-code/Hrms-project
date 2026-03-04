using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PayOutputPf
{
    public int PnCompanyId { get; set; }

    public int PnEmployeeId { get; set; }

    public string? VPfno { get; set; }

    public DateTime DDate { get; set; }

    public DateTime? DFromDate { get; set; }

    public DateTime? DToDate { get; set; }

    public int? NetPay { get; set; }

    public double? Pf { get; set; }

    public double? TotPf { get; set; }

    public double? Epf { get; set; }

    public double? Fpf { get; set; }

    public double? Vpf { get; set; }

    public double? PaidDays { get; set; }

    public double? AbsentDays { get; set; }

    public double? WeekOffDays { get; set; }

    public string? PeriodCode { get; set; }

    public int? PnBranchId { get; set; }

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
