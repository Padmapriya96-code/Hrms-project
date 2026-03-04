using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMSAPPLICATION.Models;
[Table("paym_Company")]
public partial class PaymCompany
{
    public int PnCompanyId { get; set; }

    public string? CompanyCode { get; set; }

    public string? CompanyName { get; set; }

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

   

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

   

    public string? CompanyUserId { get; set; }
    public string? CompanyPassword { get; set; }
    public string? GSTNumber {  get; set; }
    public string? WebsiteURL {  get; set; }
    public string? ContactPerson {  get; set; }
    public string? CompanyLogo { get; set; }

    public virtual ICollection<HrmmCourse> HrmmCourses { get; set; } = new List<HrmmCourse>();

    public virtual ICollection<HrmmSkillsMaster> HrmmSkillsMasters { get; set; } = new List<HrmmSkillsMaster>();

    public virtual ICollection<HrmmSpecialization> HrmmSpecializations { get; set; } = new List<HrmmSpecialization>();

    public virtual ICollection<PayOutputDeduction> PayOutputDeductions { get; set; } = new List<PayOutputDeduction>();

    public virtual ICollection<PayOutputEsi> PayOutputEsis { get; set; } = new List<PayOutputEsi>();

    public virtual ICollection<PayOutputNetPay> PayOutputNetPays { get; set; } = new List<PayOutputNetPay>();

    public virtual ICollection<PayOutputPf> PayOutputPfs { get; set; } = new List<PayOutputPf>();

    public virtual ICollection<PaymBranch> PaymBranches { get; set; } = new List<PaymBranch>();

    public virtual ICollection<PaymCategory> PaymCategories { get; set; } = new List<PaymCategory>();

    public virtual ICollection<PaymDeduction> PaymDeductions { get; set; } = new List<PaymDeduction>();

    public virtual ICollection<PaymDepartment> PaymDepartments { get; set; } = new List<PaymDepartment>();

    public virtual ICollection<PaymDesignation> PaymDesignations { get; set; } = new List<PaymDesignation>();

    public virtual ICollection<PaymDivision> PaymDivisions { get; set; } = new List<PaymDivision>();

    public virtual ICollection<PaymEarning> PaymEarnings { get; set; } = new List<PaymEarning>();

    public virtual ICollection<PaymGrade> PaymGrades { get; set; } = new List<PaymGrade>();

    public virtual ICollection<PaymJobStatus> PaymJobStatuses { get; set; } = new List<PaymJobStatus>();

    public virtual ICollection<PaymLeave> PaymLeaves { get; set; } = new List<PaymLeave>();

    public virtual ICollection<PaymLevel> PaymLevels { get; set; } = new List<PaymLevel>();

    public virtual ICollection<PaymLoan> PaymLoans { get; set; } = new List<PaymLoan>();

    public virtual ICollection<PaymOverHeadingCost> PaymOverHeadingCosts { get; set; } = new List<PaymOverHeadingCost>();

    public virtual ICollection<PaymShift> PaymShifts { get; set; } = new List<PaymShift>();
}

