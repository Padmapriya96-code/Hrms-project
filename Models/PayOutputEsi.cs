using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PayOutputEsi
{
    public int PnCompanyId { get; set; }

    public int PnEmployeeId { get; set; }

    public string? VEsino { get; set; }

    public DateTime DDate { get; set; }

    public DateTime? DFromDate { get; set; }

    public DateTime? DToDate { get; set; }

    public int? NetPay { get; set; }

    public double? EsiEmp { get; set; }

    public double? EsiEpr { get; set; }

    public double? PaidDays { get; set; }

    public double? AbsentDays { get; set; }

    public double? WeekOffDays { get; set; }

    public string? PeriodCode { get; set; }

    public int? PnBranchId { get; set; }

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
