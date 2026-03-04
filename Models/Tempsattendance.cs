using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class Tempsattendance
{
    public int Id { get; set; }

    public int? PnCompanyid { get; set; }

    public int? PnBranchid { get; set; }

    public string? RegisterNo { get; set; }

    public string? StudentName { get; set; }

    public DateTime? Dates { get; set; }

    public string? Intime { get; set; }

    public string? Latein { get; set; }

    public string? Outtime { get; set; }

    public string? Lateout { get; set; }

    public string? Whours { get; set; }

    public string? Status { get; set; }

    public string? Department { get; set; }

    public string? LeaveName { get; set; }

    public string? Earlyout { get; set; }

    public int? PnGradeId { get; set; }

    public DateTime? ToDate { get; set; }

    public string? ShiftCode { get; set; }

    public string? WorkHrs { get; set; }
}
