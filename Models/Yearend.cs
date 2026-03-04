using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class Yearend
{
    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public DateTime ProcessDate { get; set; }
}
