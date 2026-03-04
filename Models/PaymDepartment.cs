using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymDepartment
{
    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public int PnDepartmentId { get; set; }

    public string VDepartmentName { get; set; } = null!;

    public string? Status { get; set; }

    public virtual ICollection<PaymEmployeeProfile1> PaymEmployeeProfile1s { get; set; } = new List<PaymEmployeeProfile1>();

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
