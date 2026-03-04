using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace HRMSAPPLICATION.Models;

public partial class PaymBranch
{
    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public string? BranchCode { get; set; }

    public string? BranchName { get; set; }

    public string? AddressLine1 { get; set; }

    public string? AddressLine2 { get; set; }

    public string? City { get; set; }

    public string? ZipCode { get; set; }

    public string? Country { get; set; }

    public string? State { get; set; }

    public string? PhoneNo { get; set; }

    public string? FaxNo { get; set; }

    public string? EmailId { get; set; }

    public string? AlternateEmailId { get; set; }

    public string? BranchUserId { get; set; }

    public string? BranchPassword { get; set; }

    public string? Status { get; set; }


    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public virtual ICollection<LoanEntry> LoanEntries { get; set; } = new List<LoanEntry>();

    public virtual ICollection<LoanPreCloser> LoanPreClosers { get; set; } = new List<LoanPreCloser>();

    public virtual ICollection<PayInput> PayInputs { get; set; } = new List<PayInput>();

    public virtual ICollection<PaymEmpDeduction> PaymEmpDeductions { get; set; } = new List<PaymEmpDeduction>();

    public virtual ICollection<PaymEmpEarning> PaymEmpEarnings { get; set; } = new List<PaymEmpEarning>();

    public virtual ICollection<PaymEmployee> PaymEmployees { get; set; } = new List<PaymEmployee>();

    public virtual ICollection<PaymPf> PaymPfs { get; set; } = new List<PaymPf>();
    [JsonIgnore]
    public virtual PaymCompany? PnCompany { get; set; } 
    [Column("can_manage_designation")]
    public bool CanManageDesignation { get; set; }
    [Column("can_manage_department")]
    public bool CanManageDepartment { get; set; }

}