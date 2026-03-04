using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PfEpf
{
    public int Id { get; set; }

    public int? PnCompanyId { get; set; }

    public int? PnBranchId { get; set; }

    public int? PnEmployeeId { get; set; }

    public string? NomineeName { get; set; }

    public string? Gender { get; set; }

    public DateTime? Dob { get; set; }

    public decimal? PfShare { get; set; }

    public string? Relationship { get; set; }

    public string? Address1 { get; set; }

    public string? State { get; set; }

    public string? District { get; set; }

    public string? City { get; set; }

    public string? PinNo { get; set; }
}
