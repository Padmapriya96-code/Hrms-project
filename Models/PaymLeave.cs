using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMSAPPLICATION.Models;

public partial class PaymLeave
{
    public int PnCompanyId { get; set; }

    public int PnLeaveId { get; set; }

    public string VLeaveName { get; set; } = null!;

    public string? PnLeaveCode { get; set; }

    public int? PnCount { get; set; }

    public string? Status { get; set; }

    public int? PnBranchId { get; set; }
    
    public int? MaxDays { get; set; }
   

    public string? Type { get; set; }

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
