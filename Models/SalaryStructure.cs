using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class SalaryStructure
{
    public int Id { get; set; }

    public int? PnCompanyid { get; set; }

    public int? PnBranchid { get; set; }

    public int? PnEmployeeId { get; set; }

    public double? Salary { get; set; }

    public DateTime? EffectiveDate { get; set; }

    public string? Remarks { get; set; }
}
