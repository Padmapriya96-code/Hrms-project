using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class ShiftPattern
{
    public int PnCompanyid { get; set; }

    public int PnBranchid { get; set; }

    public string PatternCode { get; set; } = null!;

    public string? ShiftCode1 { get; set; }

    public string? Days1 { get; set; }

    public string? ShiftCode2 { get; set; }

    public string? Days2 { get; set; }

    public string? ShiftCode3 { get; set; }

    public string? Days3 { get; set; }

    public string? ShiftCode4 { get; set; }

    public int? Days4 { get; set; }

    public string? ShiftCode5 { get; set; }

    public int? Days5 { get; set; }

    public string? ShiftCode6 { get; set; }

    public int? Days6 { get; set; }

    public string? ShiftCode7 { get; set; }

    public int? Days7 { get; set; }

    public string? ShiftCode8 { get; set; }

    public int? Days8 { get; set; }

    public virtual ICollection<ShiftBalance> ShiftBalances { get; set; } = new List<ShiftBalance>();
}
