using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class HrmmCourse
{
    public int PnCompanyId { get; set; }

    public int PnCourseId { get; set; }

    public string VCourseName { get; set; } = null!;

    public string? Status { get; set; }

    public int? BranchId { get; set; }

    public virtual PaymCompany PnCompany { get; set; } = null!;
}
