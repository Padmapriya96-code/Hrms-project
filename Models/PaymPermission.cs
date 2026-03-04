using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymPermission
{
    public int CompanyId { get; set; }

    public int BranchId { get; set; }

    public int PermissionId { get; set; }

    public int EmployeeId { get; set; }

    public string? EmployeeName { get; set; }

    public DateTime Date { get; set; }

    public string Session { get; set; } = null!;

    public string? Status { get; set; }
}
