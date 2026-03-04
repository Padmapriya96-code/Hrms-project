using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymCategory
{
    public int PnCompanyId { get; set; }

    public int BranchId { get; set; }

    public int PnCategoryId { get; set; }

    public string VCategoryName { get; set; } = null!;

    public string? Status { get; set; }

    public virtual ICollection<PaymEmployeeProfile1> PaymEmployeeProfile1s { get; set; } = new List<PaymEmployeeProfile1>();

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
