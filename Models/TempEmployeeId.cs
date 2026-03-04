using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class TempEmployeeId
{
    public int Id { get; set; }

    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public int? PnEmployeeId { get; set; }

    public DateTime? DDate { get; set; }
}
