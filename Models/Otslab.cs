using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class Otslab
{
    public int PnCompanyid { get; set; }

    public int PnBranchid { get; set; }

    public int SlabId { get; set; }

    public TimeOnly OtFrom { get; set; }

    public TimeOnly OtTo { get; set; }

    public TimeOnly OtSlab1 { get; set; }

    public string PnCategory { get; set; } = null!;

    public decimal OtHrs { get; set; }
}
