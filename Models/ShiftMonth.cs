using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class ShiftMonth
{
    public int Id { get; set; }

    public int? PnCompanyId { get; set; }

    public int? PnBranchId { get; set; }

    public string? PnEmployeeCode { get; set; }

    public string? PnEmployeeName { get; set; }

    public string? Monthyear { get; set; }

    public DateTime? Date { get; set; }

    public string? ShiftCode { get; set; }
}
