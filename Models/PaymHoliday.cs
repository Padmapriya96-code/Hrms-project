using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymHoliday
{
    public int Id { get; set; }

    public int? PnCompanyId { get; set; }

    public int? PnBranchId { get; set; }

    public string? PnHolidaycode { get; set; }

    public string? PnHolidayname { get; set; }

    public int? Fyear { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public int? Days { get; set; }
}
