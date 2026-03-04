using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymEncashmentDetail
{
    public int Id { get; set; }

    public int? PnCompanyId { get; set; }

    public int? PnBranchId { get; set; }

    public int? PnEmployeeId { get; set; }

    public int? PnLeaveId { get; set; }

    public decimal? AllowDays { get; set; }

    public decimal? TakenDays { get; set; }

    public decimal? MaxDays { get; set; }

    public decimal? BalDays { get; set; }

    public decimal? BasicPerDay { get; set; }

    public decimal? TotalAmt { get; set; }

    public DateTime? Date { get; set; }

    public string? YearEnd { get; set; }
}
