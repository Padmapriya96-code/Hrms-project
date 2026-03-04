using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMSAPPLICATION.Models;

public partial class PaymEmployee
{
    [Required]
    public int PnCompanyId { get; set; }

    [Required]
    public int PnBranchId { get; set; }

    [Key]
    public int PnEmployeeId { get; set; }

  //  [Required(ErrorMessage = "Employee code is required.")]
 //   [StringLength(10, ErrorMessage = "Max 20 characters allowed.")]
    public string? EmployeeCode { get; set; }

  //  [Required(ErrorMessage = "Employee First Name  is required.")]
   // [StringLength(10, ErrorMessage = "Max 20 characters allowed.")]
    public string? EmployeeFirstName { get; set; }


    public string? EmployeeMiddleName { get; set; }

  //  [Required(ErrorMessage = "Employee Last Name  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 20 characters allowed.")]
    public string? EmployeeLastName { get; set; }

 //   [Required(ErrorMessage = "Date of Birth is required.")]
 //   [DataType(DataType.Date, ErrorMessage = "Invalid date format.")]

    public DateTime? DateofBirth { get; set; }

   // [Required(ErrorMessage = "Password  is required.")]
   // [StringLength(10, ErrorMessage = "Max 20 characters allowed.")]
    public string? Password { get; set; }

  //  [Required(ErrorMessage = "Gender  is required.")]
   // [StringLength(10, ErrorMessage = "Max 20 characters allowed.")]
    public string? Gender { get; set; }

   // [Required(ErrorMessage = "Status  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 20 characters allowed.")]
    public string? Status { get; set; }
    public string? EmployeeFullName { get; set; }

   // [Required(ErrorMessage = "Readerid is required.")]
   // [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public int? Readerid { get; set; }

   // [Required(ErrorMessage = "OT Eligible  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? OtEligible { get; set; }

  //  [Required(ErrorMessage = "pfno  is required.")]
   // [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? Pfno { get; set; }

   // [Required(ErrorMessage = "Esino  is required.")]
   // [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? Esino { get; set; }


   // [Required(ErrorMessage = "OT Calculation value is required.")]
  //  [Range(0.01, double.MaxValue, ErrorMessage = "OT Calculation must be greater than 0.")]
    public double? OtCalc { get; set; }

  //  [Required(ErrorMessage = "CTC is required.")]
  //  [Range(0.01, double.MaxValue, ErrorMessage = "CTC must be greater than 0.")]
    public double? Ctc { get; set; }

    public double? BasicSalary { get; set; }

   // [Required(ErrorMessage = "BankCode  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? BankCode { get; set; }

   // [Required(ErrorMessage = "BankName  is required.")]
//[StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? BankName { get; set; }

   // [Required(ErrorMessage = "BranchName  is required.")]
   // [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? BranchName { get; set; }

 //   [Required(ErrorMessage = "AccountType  is required.")]
 //   [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? AccountType { get; set; }

   // [Required(ErrorMessage = "MicrCode  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 40 characters allowed.")]
    public string? MicrCode { get; set; }

   // [Required(ErrorMessage = "IfscCode  is required.")]
   // [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? IfscCode { get; set; }

   // [Required(ErrorMessage = "Address  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 60 characters allowed.")]
  //  public string? Address { get; set; }

    public string? OtherInfo { get; set; }

  //  [Required(ErrorMessage = "ReportingPerson  is required.")]
   // [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? ReportingPerson { get; set; }

    //[Required(ErrorMessage = "Reporting To is required.")]
  //  [Range(1, int.MaxValue, ErrorMessage = "Reporting To must be a valid positive number.")]
    public int? ReportingId { get; set; }


   // [Required(ErrorMessage = "ReportingEmail  is required.")]
   // [StringLength(10, ErrorMessage = "Max 40 characters allowed.")]
    public string? ReportingEmail { get; set; }

   // [Required(ErrorMessage = "PanNo  is required.")]
   // [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? PanNo { get; set; }

    //[Required(ErrorMessage = "SalaryType  is required.")]
   // [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? SalaryType { get; set; }

  //  [Required(ErrorMessage = "TdsAPPLICABLE  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? TdsApplicable { get; set; }

  
    public string? Flag { get; set; }

  //  [Required(ErrorMessage = "Role is required.")]
   // [Range(1, int.MaxValue, ErrorMessage = "Role must be a valid positive number.")]
    public int? Role { get; set; }

  //  [Required(ErrorMessage = "AccountNo is required.")]
   // [StringLength(10, ErrorMessage = "Max 40 characters allowed.")]
    public string? AccountNo { get; set; }

    // NEW FIELDS FROM DATABASE
  //  [Required(ErrorMessage = "BloodGroup  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? BloodGroup { get; set; }

   // [Required(ErrorMessage = "PhoneNo  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 40 characters allowed.")]
    public string? PhoneNo { get; set; }

  //  [Required(ErrorMessage = "AlternatePhoneno  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]f
    public string? AlternatePhoneNo { get; set; }

   // [Required(ErrorMessage = "PermanentAddress  is required.")]
   // [StringLength(10, ErrorMessage = "Max 70 characters allowed.")]
    public string? PermanentAddress { get; set; }

   // [Required(ErrorMessage = "AadharCard  is required.")]
   // [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? AadharCard { get; set; }

   // [Required(ErrorMessage = " CurrentAddress is required.")]
   // [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? CurrentAddress { get; set; }
    public string? FatherName { get; set; }

   // [Required(ErrorMessage = "Email  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 50 characters allowed.")]
    public string? Email { get; set; }

  //  [Required(ErrorMessage = " AlternateEmail is required.")]
   // [StringLength(10, ErrorMessage = "Max 50 characters allowed.")]
    public string? AlternateEmail { get; set; }

  //  [Required(ErrorMessage = "Grade  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 50 characters allowed.")]
    public string? Grade { get; set; }

//[Required(ErrorMessage = "Overall Experience is required.")]
   // [Range(0, 50, ErrorMessage = "Overall Experience must be between 0 and 50 years.")]
    public double? OverallExperience { get; set; }


   // [Required(ErrorMessage = "HighestQualification  is required.")]
   // [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? HighestQualification { get; set; }

  //  [Required(ErrorMessage = "UniversityName  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? UniversityName { get; set; }

   // [Required(ErrorMessage = "Year of Passing is required.")]
   // [Range(1950, 2100, ErrorMessage = "Year of Passing must be between 1950 and 2100.")]
    public int? YearOfPassing { get; set; }


  //  [Required(ErrorMessage = " Certifications is required.")]
   // [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? Certifications { get; set; }

   // [Required(ErrorMessage = "Skills  is required.")]
   // [StringLength(10, ErrorMessage = "Max 30 characters allowed.")]
    public string? Skills { get; set; }
    public string? UAN { get; set; }
    public string? PaymentMode { get; set; }
    public string? PassportNumber { get; set; }
    public string? VisaDetails { get; set; }
  // [Required(ErrorMessage = "Joining Date is required.")]
//[DataType(DataType.Date, ErrorMessage = "Invalid date format.")]
public DateTime? JoiningDate { get; set; }

    public DateTime? ExitDate { get; set; }
    public string? ExitReason { get; set; }
    public string? PreviousCompany { get; set; }

  //  [Required(ErrorMessage = "PreviousDesignation  is required.")]
   // [StringLength(10, ErrorMessage = "Max 40 characters allowed.")]

    public string? PreviousDesignation { get; set; }
    public string? PreviousEmploymentDuration { get; set; }
    public string? ReasonForLeaving { get; set; }
    public decimal? PerformanceRating { get; set; }
    public string? TrainingRecords { get; set; }
    public string? DisciplinaryActions { get; set; }
    public string? Awards { get; set; }
    public string? VehicleDetails { get; set; }
    public string? HealthInsuranceDetails { get; set; }

  //  [Required(ErrorMessage = "NomineeDetails  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 40 characters allowed.")]

    public string? NomineeDetails { get; set; }

   // [Required(ErrorMessage = "NomineePhoneno  is required.")]
    //[StringLength(10, ErrorMessage = "Max 40 characters allowed.")]

    public string? NomineePhoneno { get; set; }

   // [Required(ErrorMessage = "NomineeRelationship  is required.")]
   // [StringLength(10, ErrorMessage = "Max 40 characters allowed.")]

    public string? NomineeRelationship { get; set; }

//[Required(ErrorMessage = "AssetName  is required.")]
  //  [StringLength(10, ErrorMessage = "Max 40 characters allowed.")]

    public string? AssetName { get; set; }

   // [Required(ErrorMessage = "AssetSerialNumber  is required.")]
   // [StringLength(10, ErrorMessage = "Max 40 characters allowed.")]

    public string? AssetSerialNumber { get; set; }

    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();

    [ForeignKey(nameof(PnBranchId))]
    public virtual PaymBranch? PaymBranch { get; set; }

    [ForeignKey(nameof(PnCompanyId))]
    public virtual PaymCompany? PaymCompany { get; set; }  // Add if applicable
    public virtual ICollection<PaymEmployeeProfile1> PaymEmployeeProfile1s { get; set; } = new List<PaymEmployeeProfile1>();

    public virtual ICollection<PaymEmpDeduction> PaymEmpDeductions { get; set; } = new List<PaymEmpDeduction>();

    public virtual ICollection<PaymEmpEarning> PaymEmpEarnings { get; set; } = new List<PaymEmpEarning>();

    public virtual PaymEmployeeWorkDetail? PaymEmployeeWorkDetail { get; set; }
}