using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class Tempshiftdetail
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

    public string? ShiftCode { get; set; }

    public string? Department { get; set; }

    public DateTime? ToDate { get; set; }
}
