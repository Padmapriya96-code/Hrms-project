using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymVpf
{
    public int Id { get; set; }

    public int? PnCompanyid { get; set; }

    public int? PnBranchid { get; set; }

    public string? PnEmployeeId { get; set; }

    public string? Employeename { get; set; }

    public decimal? Monthlycontribution { get; set; }

    public string? Salaryfrom { get; set; }

    public decimal? Vpfamount { get; set; }

    public string? ContributionType { get; set; }
}
