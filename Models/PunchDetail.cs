using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PunchDetail
{
    public int Id { get; set; }

    public int? PnCompanyid { get; set; }

    public int? PnBranchid { get; set; }

    public long? MachineNum { get; set; }

    public string? CardNo { get; set; }

    public string? EmpCode { get; set; }

    public string? EmpName { get; set; }

    public int? VerifyMode { get; set; }

    public int? InOutMode { get; set; }

    public string? ShiftCode { get; set; }

    public DateTime? Dates { get; set; }

    public string? Days { get; set; }

    public TimeOnly? Times { get; set; }

    public TimeOnly? OtHrs { get; set; }

    public string? Status { get; set; }
}
