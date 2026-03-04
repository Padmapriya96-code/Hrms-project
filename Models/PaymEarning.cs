using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymEarning
{
    public int PnCompanyId { get; set; }

    public int PnEarningsId { get; set; }

    public string VEarningsCode { get; set; } = null!;

    public string? VEarningsName { get; set; }

    public string? CRegular { get; set; }

    public string? CPf { get; set; }

    public string? CEsi { get; set; }

    public string? COt { get; set; }

    public string? CLop { get; set; }

    public string? CPt { get; set; }

    public string? CPrint { get; set; }

    public string? Payslip { get; set; }

    public string? Status { get; set; }

    public int? DOrder { get; set; }

    public int? PnBranchId { get; set; }

    public virtual ICollection<PaymEmpEarning> PaymEmpEarnings { get; set; } = new List<PaymEmpEarning>();

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
