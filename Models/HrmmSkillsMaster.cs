using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class HrmmSkillsMaster
{
    public int PnCompanyId { get; set; }

    public int PnSkillId { get; set; }

    public string? VSkillName { get; set; }

    public string? Status { get; set; }

    public int? BranchId { get; set; }

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
