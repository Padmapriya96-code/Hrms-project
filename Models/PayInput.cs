using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PayInput
{
    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public int PnEmployeeId { get; set; }

    public DateTime DDate { get; set; }

    public DateTime? DFromDate { get; set; }

    public DateTime? DToDate { get; set; }

    public double? CalcDays { get; set; }

    public double? PaidDays { get; set; }

    public double? PresentDays { get; set; }

    public double? AbsentDays { get; set; }

    public double? TotLeaveDays { get; set; }

    public double? WeekOffDays { get; set; }

    public double? Holidays { get; set; }

    public double? OnDutyDays { get; set; }

    public double? CompoffDays { get; set; }

    public double? TourDays { get; set; }

    public string? AttBonus { get; set; }

    public double? AttBonusAmount { get; set; }

    public TimeOnly? OtHrs { get; set; }

    public double? EarnArrears { get; set; }

    public double? DedArrears { get; set; }

    public double? OtValue { get; set; }

    public double? OtAmt { get; set; }

    public double? ActBasic { get; set; }

    public double? EarnBasic { get; set; }

    public string? Mode { get; set; }

    public string? Flag { get; set; }

    public double? PtGross { get; set; }

    public virtual PaymBranch PaymBranch { get; set; } = null!;
}
