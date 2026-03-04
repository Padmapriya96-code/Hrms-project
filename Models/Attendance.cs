using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class Attendance
{
    public int Id { get; set; }

    public int? PnCompanyId { get; set; }

    public int? PnBranchId { get; set; }

    public int? PnEmployeeId { get; set; }

    public string? DayStatus { get; set; }

    [Newtonsoft.Json.JsonProperty("intime")]
    public DateTime? Intime { get; set; }

    public DateTime? Outtime { get; set; }

    public virtual PaymEmployee? PaymEmployee { get; set; }
}
