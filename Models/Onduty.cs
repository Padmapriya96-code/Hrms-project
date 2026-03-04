using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class Onduty
{
    public int Sno { get; set; }

    public string RefNo { get; set; } = null!;

    public int PnCompanyid { get; set; }

    public int PnBranchid { get; set; }

    public string? Empid { get; set; }

    public string? Empname { get; set; }

    public DateTime OndutyDat { get; set; }

    public string? Fstatus { get; set; }

    public DateTime Todat { get; set; }

    public string? Tstatus { get; set; }

    public double? TotDays { get; set; }

    public DateTime SubDat { get; set; }

    public string? Reason { get; set; }

    public string? Priority { get; set; }

    public string? Approval { get; set; }

    public string? Message1 { get; set; }

    public string? Message2 { get; set; }

    public string? Message3 { get; set; }

    public string? Message4 { get; set; }
}
