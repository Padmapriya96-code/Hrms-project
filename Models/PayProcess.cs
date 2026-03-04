using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PayProcess
{
    public int Id { get; set; }

    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public DateTime DDate { get; set; }

    public DateTime? DFromDate { get; set; }

    public DateTime? DToDate { get; set; }

    public string? SalaryPeriod { get; set; }

    public DateTime? ProcessDate { get; set; }
}
