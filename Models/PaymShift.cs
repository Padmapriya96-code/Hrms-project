using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HRMSAPPLICATION.Models;

public partial class PaymShift
{
    [Required]
    public int pn_CompanyID { get; set; }

    [Key]
    public int pn_ShiftID { get; set; }

    [Required]
    public int pn_branchid { get; set; }

    [Required]
    public string shift_code { get; set; }

    public TimeSpan? start_time { get; set; }
    public TimeSpan? break_time_out { get; set; }
    public TimeSpan? break_time_in { get; set; }
    public TimeSpan? end_time { get; set; }

    public string? shift_indicator { get; set; }
    public string? Shift_Type { get; set; }

    [JsonIgnore]
    [ForeignKey(nameof(pn_CompanyID))]
    public virtual PaymCompany? PaymCompany { get; set; }

}