using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class HrAuthentication
{
    public int Id { get; set; }

    public int? PnCompanyId { get; set; }

    public int? PnBranchId { get; set; }

    public int? SectionId { get; set; }

    public string? SectionView { get; set; }

    public string? SectionEdit { get; set; }

    public string? SectionDelete { get; set; }
}
