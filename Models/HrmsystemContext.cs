using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using HRMSAPPLICATION.Controllers;

namespace HRMSAPPLICATION.Models;

public partial class HrmsystemContext : DbContext
{
    internal object LeaveApproveManagers;

    public HrmsystemContext()
    {
    }

    public HrmsystemContext(DbContextOptions<HrmsystemContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Asset> Assets { get; set; }

    public virtual DbSet<Attendance> Attendances { get; set; }

    public virtual DbSet<AttendanceCeiling> AttendanceCeilings { get; set; }

    public virtual DbSet<DailyTimecardNew> DailyTimecardNews { get; set; }

    public virtual DbSet<EarnDeduct> EarnDeducts { get; set; }

    public virtual DbSet<Form7> Form7s { get; set; }

    public virtual DbSet<HrAuthentication> HrAuthentications { get; set; }

    public virtual DbSet<HrmmCourse> HrmmCourses { get; set; }

    public virtual DbSet<HrmmSkillsMaster> HrmmSkillsMasters { get; set; }

    public virtual DbSet<HrmmSpecialization> HrmmSpecializations { get; set; }

    public virtual DbSet<LeaveApply> LeaveApplys { get; set; }

    public virtual DbSet<LeaveSettlement> LeaveSettlements { get; set; }

    public virtual DbSet<LeaveallocationMaster> LeaveallocationMasters { get; set; }

    public virtual DbSet<LeaveapproveHr> LeaveapproveHrs { get; set; }

    public virtual DbSet<LeaveapproveManager> LeaveapproveManagers { get; set; }
    
    public virtual DbSet<LoanEntry> LoanEntries { get; set; }

    public virtual DbSet<LoanPost> LoanPosts { get; set; }

    public virtual DbSet<LoanPreCloser> LoanPreClosers { get; set; }

    public virtual DbSet<Onduty> Onduties { get; set; }

    public virtual DbSet<Otslab> Otslabs { get; set; }

    public virtual DbSet<PayInput> PayInputs { get; set; }

    public virtual DbSet<PayOutputActual> PayOutputActuals { get; set; }

    public virtual DbSet<PayOutputDeduction> PayOutputDeductions { get; set; }

    public virtual DbSet<PayOutputEarning> PayOutputEarnings { get; set; }

    public virtual DbSet<PayOutputEsi> PayOutputEsis { get; set; }

    public virtual DbSet<PayOutputNetPay> PayOutputNetPays { get; set; }

    public virtual DbSet<PayOutputPf> PayOutputPfs { get; set; }

    public virtual DbSet<PayProcess> PayProcesses { get; set; }

    public virtual DbSet<PaymAttbonu> PaymAttbonus { get; set; }

    public virtual DbSet<PaymBank> PaymBanks { get; set; }

    public virtual DbSet<PaymBranch> PaymBranches { get; set; }

    public virtual DbSet<PaymCarryForward> PaymCarryForwards { get; set; }

    public virtual DbSet<PaymCategory> PaymCategories { get; set; }

    public virtual DbSet<PaymCompany> PaymCompanies { get; set; }

    public virtual DbSet<PaymComputation> PaymComputations { get; set; }

    public virtual DbSet<PaymDeduction> PaymDeductions { get; set; }

    public virtual DbSet<PaymDepartment> PaymDepartments { get; set; }

    public virtual DbSet<PaymDesignation> PaymDesignations { get; set; }

    public virtual DbSet<PaymDivision> PaymDivisions { get; set; }

    public virtual DbSet<PaymEarning> PaymEarnings { get; set; }

    public virtual DbSet<PaymEmpDeduction> PaymEmpDeductions { get; set; }

    public virtual DbSet<PaymEmpEarning> PaymEmpEarnings { get; set; }

    public virtual DbSet<PaymEmployee> PaymEmployees { get; set; }

    public virtual DbSet<PaymEmployeeLeave> PaymEmployeeLeaves { get; set; }

    public virtual DbSet<PaymEmployeeProfile1> PaymEmployeeProfile1s { get; set; }

    public virtual DbSet<PaymEmployeeWorkDetail> PaymEmployeeWorkDetails { get; set; }

    public virtual DbSet<PaymEncashmentDetail> PaymEncashmentDetails { get; set; }

    public virtual DbSet<PaymGrade> PaymGrades { get; set; }

    public virtual DbSet<PaymHoliday> PaymHolidays { get; set; }

    public virtual DbSet<PaymJobStatus> PaymJobStatuses { get; set; }

    public virtual DbSet<PaymLeave> PaymLeaves { get; set; }

    public virtual DbSet<PaymLeaveAllocation1> PaymLeaveAllocation1s { get; set; }

    public virtual DbSet<PaymLevel> PaymLevels { get; set; }

    public virtual DbSet<PaymLoan> PaymLoans { get; set; }

    public virtual DbSet<PaymLoanDiminishing> PaymLoanDiminishings { get; set; }

    public virtual DbSet<PaymOverHeadingCost> PaymOverHeadingCosts { get; set; }

    public virtual DbSet<PaymPaybill> PaymPaybills { get; set; }

    public virtual DbSet<PaymPermission> PaymPermissions { get; set; }

    public virtual DbSet<PaymPf> PaymPfs { get; set; }

    public virtual DbSet<PaymShift> PaymShifts { get; set; }

    public virtual DbSet<PaymVpf> PaymVpfs { get; set; }

    public virtual DbSet<PayoutputLoan> PayoutputLoans { get; set; }

    public virtual DbSet<PayrollFinalSettlement> PayrollFinalSettlements { get; set; }

    public virtual DbSet<PfEp> PfEps { get; set; }

    public virtual DbSet<PfEpf> PfEpfs { get; set; }

    public virtual DbSet<PunchDetail> PunchDetails { get; set; }

    public virtual DbSet<SalaryPeriod> SalaryPeriods { get; set; }

    public virtual DbSet<SalaryStructure> SalaryStructures { get; set; }

    public virtual DbSet<ShiftBalance> ShiftBalances { get; set; }

    public virtual DbSet<ShiftDetail> ShiftDetails { get; set; }

    public virtual DbSet<ShiftMonth> ShiftMonths { get; set; }

    public virtual DbSet<ShiftPattern> ShiftPatterns { get; set; }

    public virtual DbSet<TempDeduction> TempDeductions { get; set; }

    public virtual DbSet<TempEarning> TempEarnings { get; set; }

    public virtual DbSet<TempEmployeeId> TempEmployeeIds { get; set; }

    public virtual DbSet<TempMuster> TempMusters { get; set; }

    public virtual DbSet<TempNetpay> TempNetpays { get; set; }

    public virtual DbSet<TempPayinput> TempPayinputs { get; set; }

    public virtual DbSet<TempTimecard> TempTimecards { get; set; }

    public virtual DbSet<Tempsattendance> Tempsattendances { get; set; }

    public virtual DbSet<Tempshift> Tempshifts { get; set; }

    public virtual DbSet<Tempshiftdetail> Tempshiftdetails { get; set; }

    public virtual DbSet<TimeCard> TimeCards { get; set; }

    public virtual DbSet<Yearend> Yearends { get; set; }
    public DbSet<Register> Registers { get; set; }
   
    public DbSet<UserAccounts> userAccounts { get; set; }
    public DbSet<PfSettings> PfSettings { get; set; } 
    public DbSet<ProRataBasis> ProRataBasis { get; set; }
    public DbSet<GradeSlabBranch> GradeSlabBranches { get; set; }
    public DbSet<GradeSlabDivision> GradeSlabDivisions { get; set; }
    public DbSet<CTCSlab> CTCSlabs { get; set; }
    public DbSet<PaymLoanTypeMaster> PaymLoanTypeMasters { get; set; }






    //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
    //=> optionsBuilder.UseSqlServer("Server=PADMAPRIYA\\MSSQLSERVER01;Database=HRMS_Master;Trusted_Connection=true;TrustServerCertificate=true");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<Asset>(entity =>
        {
            entity.HasKey(e => e.PnAssetid).HasName("pk_Assets");

            entity.ToTable("Assets");

            entity.Property(e => e.PnAssetid)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_Assetid");

            entity.Property(e => e.PnCompanyId)
                .HasColumnName("pn_CompanyID");

            entity.Property(e => e.BranchId)
                .HasColumnName("BranchID");

            entity.Property(e => e.AssetName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Asset_name");

            entity.Property(e => e.AssetSerialNumber)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Asset_SerialNumber");

            entity.Property(e => e.PurchaseDate)
                .HasColumnType("date")
                .HasColumnName("PurchaseDate");

            entity.Property(e => e.AssetValue)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("AssetValue");

            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode()
                .HasColumnName("Status");

            entity.Property(e => e.Description)
                .IsUnicode()
                .HasColumnName("Description");

            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasColumnName("CreatedDate");
        });

        modelBuilder.Entity<Attendance>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__attendan__3213E83F0C958EC9");

            entity.ToTable("attendance");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DayStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("day_status");
            entity.Property(e => e.Intime)
                .HasColumnType("datetime")
                .HasColumnName("intime");
            entity.Property(e => e.Outtime)
                .HasColumnType("datetime")
                .HasColumnName("outtime");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_branchId");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_companyId");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_employeeId");

            entity.HasOne(d => d.PaymEmployee).WithMany(p => p.Attendances)
                .HasForeignKey(d => new { d.PnCompanyId, d.PnBranchId, d.PnEmployeeId })
                .HasConstraintName("FK__attendance__52E34C9D");
        });

        modelBuilder.Entity<AttendanceCeiling>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__attendan__3214EC077E64F8C2");

            entity.ToTable("attendance_ceiling");

            entity.Property(e => e.EarlyIntime)
                .HasPrecision(3)
                .HasColumnName("early_intime");
            entity.Property(e => e.Halfday)
                .HasPrecision(3)
                .HasColumnName("halfday");
            entity.Property(e => e.Intime)
                .HasPrecision(3)
                .HasColumnName("intime");
            entity.Property(e => e.LeaveDays).HasColumnName("leave_days");
            entity.Property(e => e.LunchEin)
                .HasPrecision(3)
                .HasColumnName("lunch_ein");
            entity.Property(e => e.ManualDays).HasColumnName("manual_days");
            entity.Property(e => e.MonthType)
                .HasMaxLength(22)
                .IsUnicode(false)
                .HasColumnName("month_type");
            entity.Property(e => e.MorningOt)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("morning_ot");
            entity.Property(e => e.OtDays).HasColumnName("ot_days");
            entity.Property(e => e.OtHrs).HasColumnName("ot_hrs");
            entity.Property(e => e.OtLimit)
                .HasPrecision(3)
                .HasColumnName("ot_limit");
            entity.Property(e => e.PermissionLimit)
                .HasPrecision(3)
                .HasColumnName("permission_limit");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.PtaxMonth)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("ptax_month");
            entity.Property(e => e.ReaderName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("reader_name");
            entity.Property(e => e.ShiftLin)
                .HasPrecision(3)
                .HasColumnName("shift_lin");
            entity.Property(e => e.TimeCard)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("time_card");
            entity.Property(e => e.WeekOff1)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("week_off1");
            entity.Property(e => e.WeekOff2)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("week_off2");
        });

        modelBuilder.Entity<DailyTimecardNew>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__daily_ti__3214EC07786A9DD9");

            entity.ToTable("daily_timecard_new");

            entity.Property(e => e.BreakIn).HasColumnName("break_in");
            entity.Property(e => e.BreakOut).HasColumnName("break_out");
            entity.Property(e => e.CardNo)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("card_no");
            entity.Property(e => e.Dates)
                .HasColumnType("datetime")
                .HasColumnName("dates");
            entity.Property(e => e.Days)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("days");
            entity.Property(e => e.EmpCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("emp_code");
            entity.Property(e => e.EmpName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("emp_name");
            entity.Property(e => e.Intime).HasColumnName("intime");
            entity.Property(e => e.MachineNum)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("machine_num");
            entity.Property(e => e.OtHrs)
                .HasColumnType("datetime")
                .HasColumnName("ot_hrs");
            entity.Property(e => e.Outtime).HasColumnName("outtime");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.ShiftCode)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("shift_code");
            entity.Property(e => e.Status)
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasColumnName("status");
        });

        modelBuilder.Entity<EarnDeduct>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnBranchId, e.PnEmployeeId, e.DDate }).HasName("pk_earn_deduct");

            entity.ToTable("earn_deduct");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_date");
            entity.Property(e => e.Allowance1)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Allowance10)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Allowance2)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Allowance3)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Allowance4)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Allowance5)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Allowance6)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Allowance7)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Allowance8)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Allowance9)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.DFromDate)
                .HasColumnType("datetime")
                .HasColumnName("d_From_Date");
            entity.Property(e => e.DToDate)
                .HasColumnType("datetime")
                .HasColumnName("d_To_Date");
            entity.Property(e => e.Deduction1)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Deduction10)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Deduction2)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Deduction3)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Deduction4)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Deduction5)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Deduction6)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Deduction7)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Deduction8)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Deduction9)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.EdId)
                .ValueGeneratedOnAdd()
                .HasColumnName("ED_ID");  
            entity.Property(e => e.Value1).HasColumnName("value1");
            entity.Property(e => e.Value10).HasColumnName("value10");
            entity.Property(e => e.Value2).HasColumnName("value2");
            entity.Property(e => e.Value3).HasColumnName("value3");
            entity.Property(e => e.Value4).HasColumnName("value4");
            entity.Property(e => e.Value5).HasColumnName("value5");
            entity.Property(e => e.Value6).HasColumnName("value6");
            entity.Property(e => e.Value7).HasColumnName("value7");
            entity.Property(e => e.Value8).HasColumnName("value8");
            entity.Property(e => e.Value9).HasColumnName("value9");
            entity.Property(e => e.ValueA1).HasColumnName("valueA1");
            entity.Property(e => e.ValueA10).HasColumnName("valueA10");
            entity.Property(e => e.ValueA2).HasColumnName("valueA2");
            entity.Property(e => e.ValueA3).HasColumnName("valueA3");
            entity.Property(e => e.ValueA4).HasColumnName("valueA4");
            entity.Property(e => e.ValueA5).HasColumnName("valueA5");
            entity.Property(e => e.ValueA6).HasColumnName("valueA6");
            entity.Property(e => e.ValueA7).HasColumnName("valueA7");
            entity.Property(e => e.ValueA8).HasColumnName("valueA8");
            entity.Property(e => e.ValueA9).HasColumnName("valueA9");
        });

        modelBuilder.Entity<Form7>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__form7__3214EC070693835C");

            entity.ToTable("form7");

            entity.Property(e => e.Disp)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeCode)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Esino)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("pn_EmployeeID");
        });

        modelBuilder.Entity<HrAuthentication>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__hr_authe__3214EC07D66F1F24");

            entity.ToTable("hr_authentication");

            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.SectionDelete)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("section_delete");
            entity.Property(e => e.SectionEdit)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("section_edit");
            entity.Property(e => e.SectionId).HasColumnName("SectionID");
            entity.Property(e => e.SectionView)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("section_view");
        });

        modelBuilder.Entity<HrmmCourse>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnCourseId }).HasName("pk_hrmm_Course");

            entity.ToTable("hrmm_Course");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnCourseId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_CourseID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");
            entity.Property(e => e.VCourseName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_CourseName");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.HrmmCourses)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_hrmm_Company");
        });

        modelBuilder.Entity<HrmmSkillsMaster>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnSkillId }).HasName("pk_hrmm_SkillsMaster");

            entity.ToTable("hrmm_SkillsMaster");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnSkillId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_SkillID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");
            entity.Property(e => e.VSkillName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_SkillName");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.HrmmSkillsMasters)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_hrmm_SkillsMaster_Company");
        });

        modelBuilder.Entity<HrmmSpecialization>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnSpecializationId }).HasName("pk_hrmm_Specialization");

            entity.ToTable("hrmm_Specialization");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnSpecializationId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_SpecializationId");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");
            entity.Property(e => e.VSpecializationName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_SpecializationName");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.HrmmSpecializations)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Specialization_Company");
        });

        modelBuilder.Entity<LeaveApply>(entity =>
        {
            /*entity
                .HasNoKey()
                .ToTable("leave_apply");
            */
            entity.ToTable("leave_apply");
            entity.HasKey(e => new { e.Sno }).HasName("pkleave_apply");
            entity.Property(e => e.Approve)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("approve");
            entity.Property(e => e.Comments)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("comments");
            entity.Property(e => e.Days).HasColumnName("days");
            entity.Property(e => e.EmpCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Emp_code");
            entity.Property(e => e.EmpName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Emp_name");
            entity.Property(e => e.Flag)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("flag");
            entity.Property(e => e.FromDate)
                .HasColumnType("datetime")
                .HasColumnName("from_date");
            entity.Property(e => e.FromStatus)
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasColumnName("from_status");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.PnLeaveId).HasColumnName("pn_LeaveID");
            entity.Property(e => e.PnLeavecode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("pn_leavecode");
            entity.Property(e => e.PnLeavename)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("pn_Leavename");
            entity.Property(e => e.Priority)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("priority");
            entity.Property(e => e.Reason)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("reason");
            entity.Property(e => e.Record)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("record");
            entity.Property(e => e.Reminder)
                .HasColumnType("datetime")
                .HasColumnName("reminder");
            entity.Property(e => e.Sno).ValueGeneratedOnAdd();
            entity.Property(e => e.Status)
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.SubmittedDate)
                .HasColumnType("datetime")
                .HasColumnName("submitted_date");
            entity.Property(e => e.ToDate)
                .HasColumnType("datetime")
                .HasColumnName("to_date");
            entity.Property(e => e.Yearend).HasColumnName("yearend");
        });

        modelBuilder.Entity<LeaveSettlement>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnBranchId, e.PnLeavecode, e.PnEmployeeId, e.CalendarYear }).HasName("pk_settlement");

            entity.ToTable("leave_settlement");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnLeavecode)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("pn_leavecode");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.CalendarYear)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("calendar_year");
            entity.Property(e => e.Cf)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.DaysAllowed).HasColumnName("days_allowed");
            entity.Property(e => e.DaysBalance).HasColumnName("days_balance");
            entity.Property(e => e.DaysTaken).HasColumnName("days_taken");
            entity.Property(e => e.Ec)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Flag)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("flag");
            entity.Property(e => e.MaxDays).HasColumnName("max_days");
            entity.Property(e => e.PnLeaveId).HasColumnName("pn_LeaveID");
        });

        modelBuilder.Entity<LeaveallocationMaster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__leaveall__3214EC077883C43D");

            entity.ToTable("leaveallocation_master");

            entity.Property(e => e.Category)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Earned)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Maternity)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("maternity");
            entity.Property(e => e.NCount).HasColumnName("n_count");
            entity.Property(e => e.Personel)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("personel");
            entity.Property(e => e.Personnel)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("personnel");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.PnLeaveId).HasColumnName("pn_leaveID");
            entity.Property(e => e.Ssss)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("ssss");
            entity.Property(e => e.SubCategory)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Sub_Category");
        });

        modelBuilder.Entity<LeaveapproveHr>(entity =>
        {
            entity.HasKey(e => e.Sno).HasName("PK__leaveapp__DDDF6446998DB0AD");

            entity.ToTable("leaveapprove_hr");

            entity.Property(e => e.Sno).HasColumnName("sno");
            entity.Property(e => e.Approve)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Dayss).HasColumnName("dayss");
            entity.Property(e => e.EmpId).HasColumnName("Emp_Id");
            entity.Property(e => e.EmpName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Emp_name");
            entity.Property(e => e.Empcode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FromDate)
                .HasColumnType("datetime")
                .HasColumnName("from_date");
            entity.Property(e => e.FromStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("from_status");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchId");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_companyId");
            entity.Property(e => e.PnDesignationId).HasColumnName("pn_DesignationId");
            entity.Property(e => e.PnLeaveId).HasColumnName("pn_LeaveId");
            entity.Property(e => e.PnLeaveName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("pn_leaveName");
            entity.Property(e => e.PnLeavecode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("pn_Leavecode");
            entity.Property(e => e.SubmittedDate)
                .HasColumnType("datetime")
                .HasColumnName("Submitted_date");
            entity.Property(e => e.ToDate)
                .HasColumnType("datetime")
                .HasColumnName("To_date");
            entity.Property(e => e.ToStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("To_status");
            entity.Property(e => e.YearEnd)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<LeaveapproveManager>(entity =>
        {
            entity.HasKey(e => e.Sno).HasName("PK__leaveapp__DDDF644691C89941");

            entity.ToTable("leaveapprove_manager");

            entity.Property(e => e.Sno).HasColumnName("sno");
            entity.Property(e => e.Approve)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Dayss).HasColumnName("dayss");
            entity.Property(e => e.EmpId).HasColumnName("Emp_Id");
            entity.Property(e => e.EmpName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Emp_name");
            entity.Property(e => e.Empcode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FromDate)
                .HasColumnType("datetime")
                .HasColumnName("from_date");
            entity.Property(e => e.FromStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("from_status");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchId");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_companyId");
            entity.Property(e => e.PnDesignationId).HasColumnName("pn_DesignationId");
            entity.Property(e => e.PnLeaveId).HasColumnName("pn_LeaveId");
            entity.Property(e => e.PnLeaveName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("pn_leaveName");
            entity.Property(e => e.PnLeavecode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("pn_Leavecode");
            entity.Property(e => e.SubmittedDate)
                .HasColumnType("datetime")
                .HasColumnName("Submitted_date");
            entity.Property(e => e.ToDate)
                .HasColumnType("datetime")
                .HasColumnName("To_date");
            entity.Property(e => e.ToStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("To_status");
            entity.Property(e => e.YearEnd)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<LoanEntry>(entity =>
        {
            entity.HasKey(e => e.LoanAppid).HasName("loan_key");

            entity.ToTable("LoanEntry");

            entity.Property(e => e.LoanAppid)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("loan_appid");
            entity.Property(e => e.BalanceAmt)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("Balance_Amt");
            entity.Property(e => e.CStatus)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("c_status");
            entity.Property(e => e.Comments)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("comments");
            entity.Property(e => e.DEffdate)
                .HasColumnType("datetime")
                .HasColumnName("d_effdate");
            entity.Property(e => e.EmpName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("emp_name");
            entity.Property(e => e.FnLoanId).HasColumnName("fn_LoanID");
            entity.Property(e => e.InstalmentAmt).HasColumnType("decimal(8, 2)");
            entity.Property(e => e.Interest)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("interest");
            entity.Property(e => e.LasttransactionFrom)
                .HasColumnType("datetime")
                .HasColumnName("lasttransaction_from");
            entity.Property(e => e.LasttransactionTo)
                .HasColumnType("datetime")
                .HasColumnName("lasttransaction_to");
            entity.Property(e => e.LoanAmt)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("Loan_Amt");
            entity.Property(e => e.LoanAutoId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Loan_AutoID");
            entity.Property(e => e.LoanCalculation)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("loan_calculation");
            entity.Property(e => e.LoanName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("loan_name");
            entity.Property(e => e.LoanProcess)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("loan_process");
            entity.Property(e => e.LoanStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("loan_status");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.SanDate)
                .HasColumnType("datetime")
                .HasColumnName("san_date");
            entity.Property(e => e.TotInterestAmt)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("tot_interest_amt");

            entity.HasOne(d => d.PaymLoan).WithMany(p => p.LoanEntries)
                .HasForeignKey(d => new { d.PnCompanyId, d.FnLoanId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_loanentry_loanid");

            entity.HasOne(d => d.PaymBranch).WithMany(p => p.LoanEntries)
                .HasForeignKey(d => new { d.PnCompanyId, d.PnBranchId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_loanentry_company");
        });

        modelBuilder.Entity<LoanPost>(entity =>
        {
            entity.HasKey(e => e.LoanReqno).HasName("PK__loan_pos__E62AF50BD2297B3E");

            entity.ToTable("loan_post");

            entity.Property(e => e.LoanReqno)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("loan_reqno");
            entity.Property(e => e.ApproveBy)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("approve_by");
            entity.Property(e => e.BalanceAmt)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("balance_amt");
            entity.Property(e => e.Employeeid).HasColumnName("employeeid");
            entity.Property(e => e.Employeename)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("employeename");
            entity.Property(e => e.LoanAmount)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("loan_amount");
            entity.Property(e => e.LoanAppid)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("loan_appid");
            entity.Property(e => e.LoanName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("loan_name");
            entity.Property(e => e.LoanType)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("loan_type");
            entity.Property(e => e.MonthPostedOn)
                .HasColumnType("datetime")
                .HasColumnName("month_posted_on");
            entity.Property(e => e.MonthToPosted)
                .HasColumnType("datetime")
                .HasColumnName("month_to_posted");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.Postedamt)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("postedamt");
            entity.Property(e => e.RemMonth).HasColumnName("rem_month");
            entity.Property(e => e.ReqDate)
                .HasColumnType("datetime")
                .HasColumnName("req_date");
        });

        modelBuilder.Entity<LoanPreCloser>(entity =>
        {
            entity.HasKey(e => e.LoanAppid).HasName("pk_loan_appid");

            entity.ToTable("Loan_PreCloser");

            entity.Property(e => e.LoanAppid)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("loan_appid");
            entity.Property(e => e.CStatus)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("c_status");
            entity.Property(e => e.DCheckdate)
                .HasColumnType("datetime")
                .HasColumnName("d_checkdate");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_date");
            entity.Property(e => e.IntAmt)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("int_amt");
            entity.Property(e => e.LoanInterest)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("loan_interest");
            entity.Property(e => e.LoanName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("loan_name");
            entity.Property(e => e.LoanProcess)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("loan_process");
            entity.Property(e => e.NBalanceamount).HasColumnName("n_balanceamount");
            entity.Property(e => e.NCheckamount).HasColumnName("n_checkamount");
            entity.Property(e => e.NCheckno)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("n_checkno");
            entity.Property(e => e.NClosureamount).HasColumnName("n_closureamount");
            entity.Property(e => e.NLoanamount)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("n_loanamount");
            entity.Property(e => e.NPaidamount).HasColumnName("n_paidamount");
            entity.Property(e => e.PaymentMode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("payment_mode");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.VBankname)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("v_bankname");
            entity.Property(e => e.VRemarks)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("v_Remarks");

            entity.HasOne(d => d.PaymBranch).WithMany(p => p.LoanPreClosers)
                .HasForeignKey(d => new { d.PnCompanyId, d.PnBranchId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_loancloser_company");
        });

        modelBuilder.Entity<Onduty>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyid, e.PnBranchid, e.RefNo }).HasName("pk_paym_onduty");

            entity.ToTable("onduty");

            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.RefNo)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Ref_no");
            entity.Property(e => e.Approval)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("approval");
            entity.Property(e => e.Empid)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("empid");
            entity.Property(e => e.Empname)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("empname");
            entity.Property(e => e.Fstatus)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("fstatus");
            entity.Property(e => e.Message1)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Message2)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Message3)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Message4)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.OndutyDat)
                .HasColumnType("datetime")
                .HasColumnName("onduty_dat");
            entity.Property(e => e.Priority)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("priority");
            entity.Property(e => e.Reason)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("reason");
            entity.Property(e => e.Sno)
                .ValueGeneratedOnAdd()
                .HasColumnName("sno");
            entity.Property(e => e.SubDat)
                .HasColumnType("datetime")
                .HasColumnName("sub_dat");
            entity.Property(e => e.Todat)
                .HasColumnType("datetime")
                .HasColumnName("todat");
            entity.Property(e => e.TotDays).HasColumnName("tot_days");
            entity.Property(e => e.Tstatus)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("tstatus");
        });

        modelBuilder.Entity<Otslab>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyid, e.PnBranchid, e.OtFrom, e.OtTo, e.PnCategory }).HasName("pk_otslab");

            entity.ToTable("otslab");

            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.OtFrom)
                .HasPrecision(3)
                .HasColumnName("ot_from");
            entity.Property(e => e.OtTo)
                .HasPrecision(3)
                .HasColumnName("ot_to");
            entity.Property(e => e.PnCategory)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("pn_category");
            entity.Property(e => e.OtHrs)
                .HasColumnType("decimal(2, 1)")
                .HasColumnName("ot_hrs");
            entity.Property(e => e.OtSlab1)
                .HasPrecision(3)
                .HasColumnName("ot_slab");
            entity.Property(e => e.SlabId)
                .ValueGeneratedOnAdd()
                .HasColumnName("slab_id");
        });

        modelBuilder.Entity<PayInput>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnBranchId, e.PnEmployeeId, e.DDate }).HasName("pk_PayInput");

            entity.ToTable("PayInput");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.AbsentDays).HasColumnName("Absent_Days");
            entity.Property(e => e.ActBasic).HasColumnName("Act_Basic");
            entity.Property(e => e.AttBonus)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Att_Bonus");
            entity.Property(e => e.AttBonusAmount).HasColumnName("Att_BonusAmount");
            entity.Property(e => e.CalcDays).HasColumnName("Calc_Days");
            entity.Property(e => e.CompoffDays).HasColumnName("Compoff_Days");
            entity.Property(e => e.DFromDate)
                .HasColumnType("datetime")
                .HasColumnName("d_From_Date");
            entity.Property(e => e.DToDate)
                .HasColumnType("datetime")
                .HasColumnName("d_To_Date");
            entity.Property(e => e.DedArrears).HasColumnName("Ded_Arrears");
            entity.Property(e => e.EarnArrears).HasColumnName("Earn_Arrears");
            entity.Property(e => e.EarnBasic).HasColumnName("Earn_Basic");
            entity.Property(e => e.Flag)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Mode)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.OnDutyDays).HasColumnName("OnDuty_days");
            entity.Property(e => e.OtAmt).HasColumnName("ot_Amt");
            entity.Property(e => e.OtHrs)
                .HasPrecision(3)
                .HasColumnName("OT_HRS");
            entity.Property(e => e.OtValue).HasColumnName("ot_value");
            entity.Property(e => e.PaidDays).HasColumnName("Paid_Days");
            entity.Property(e => e.PresentDays).HasColumnName("Present_Days");
            entity.Property(e => e.PtGross).HasColumnName("PT_Gross");
            entity.Property(e => e.TotLeaveDays).HasColumnName("TotLeave_Days");
            entity.Property(e => e.TourDays).HasColumnName("Tour_Days");

            entity.HasOne(d => d.PaymBranch).WithMany(p => p.PayInputs)
                .HasForeignKey(d => new { d.PnCompanyId, d.PnBranchId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_PayInput");
        });

        modelBuilder.Entity<PayOutputActual>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnEmployeeId, e.DDate }).HasName("pk_PayOutput_Actuals");

            entity.ToTable("PayOutput_Actuals");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.ActBasic).HasColumnName("Act_basic");
            entity.Property(e => e.DFromDate)
                .HasColumnType("datetime")
                .HasColumnName("d_From_Date");
            entity.Property(e => e.DToDate)
                .HasColumnType("datetime")
                .HasColumnName("d_To_Date");
            entity.Property(e => e.DedActAmount).HasColumnName("Ded_Act_Amount");
            entity.Property(e => e.EarnActAmount).HasColumnName("Earn_Act_Amount");
            entity.Property(e => e.PeriodCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Period_code");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
        });

        modelBuilder.Entity<PayOutputDeduction>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnEmployeeId, e.PnDeductionId, e.Flag, e.DDate }).HasName("pk_PayOutput_Deductions");

            entity.ToTable("PayOutput_Deductions");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.PnDeductionId).HasColumnName("pn_DeductionID");
            entity.Property(e => e.Flag)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.ActAmount).HasColumnName("Act_Amount");
            entity.Property(e => e.DFromDate)
                .HasColumnType("datetime")
                .HasColumnName("d_From_Date");
            entity.Property(e => e.DToDate)
                .HasColumnType("datetime")
                .HasColumnName("d_To_Date");
            entity.Property(e => e.Mode)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnDepartmentName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("pn_DepartmentName");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PayOutputDeductions)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_paym_PayOutput_Deductions");
        });

        modelBuilder.Entity<PayOutputEarning>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnEmployeeId, e.PnEarningsId, e.DDate }).HasName("pk_PayOutput_Earnings");

            entity.ToTable("PayOutput_Earnings");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.PnEarningsId).HasColumnName("pn_EarningsID");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.ActAmount).HasColumnName("Act_Amount");
            entity.Property(e => e.DFromDate)
                .HasColumnType("datetime")
                .HasColumnName("d_From_Date");
            entity.Property(e => e.DToDate)
                .HasColumnType("datetime")
                .HasColumnName("d_To_Date");
            entity.Property(e => e.Flag)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Mode)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnDepartmentName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Pn_DepartmentName");
        });

        modelBuilder.Entity<PayOutputEsi>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnEmployeeId, e.DDate }).HasName("pk_PayOutput_ESI");

            entity.ToTable("PayOutput_ESI");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.AbsentDays).HasColumnName("Absent_Days");
            entity.Property(e => e.DFromDate)
                .HasColumnType("datetime")
                .HasColumnName("d_From_Date");
            entity.Property(e => e.DToDate)
                .HasColumnType("datetime")
                .HasColumnName("d_To_Date");
            entity.Property(e => e.EsiEmp).HasColumnName("ESI_EMP");
            entity.Property(e => e.EsiEpr).HasColumnName("ESI_EPR");
            entity.Property(e => e.PaidDays).HasColumnName("Paid_Days");
            entity.Property(e => e.PeriodCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Period_code");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.VEsino)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("v_ESIno");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PayOutputEsis)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_PayOutput_ESI");
        });

        modelBuilder.Entity<PayOutputNetPay>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnEmployeeId, e.DDate }).HasName("pk_PayOutput_NetPay");

            entity.ToTable("PayOutput_NetPay");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.ActBasic).HasColumnName("Act_basic");
            entity.Property(e => e.DFromDate)
                .HasColumnType("datetime")
                .HasColumnName("d_From_Date");
            entity.Property(e => e.DToDate)
                .HasColumnType("datetime")
                .HasColumnName("d_To_Date");
            entity.Property(e => e.DedActAmount).HasColumnName("Ded_Act_Amount");
            entity.Property(e => e.DedAmount).HasColumnName("Ded_Amount");
            entity.Property(e => e.EarnActAmount).HasColumnName("Earn_Act_Amount");
            entity.Property(e => e.EarnAmount).HasColumnName("Earn_Amount");
            entity.Property(e => e.EarnedBasic).HasColumnName("Earned_basic");
            entity.Property(e => e.GrossSalary).HasColumnName("Gross_salary");
            entity.Property(e => e.NetSalary).HasColumnName("Net_salary");
            entity.Property(e => e.OtAmt).HasColumnName("OT_amt");
            entity.Property(e => e.PeriodCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Period_code");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PayOutputNetPays)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_PayOutput_NetPay");
        });

        modelBuilder.Entity<PayOutputPf>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnEmployeeId, e.DDate }).HasName("pk_PayOutput_PF");

            entity.ToTable("PayOutput_PF");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.AbsentDays).HasColumnName("Absent_Days");
            entity.Property(e => e.DFromDate)
                .HasColumnType("datetime")
                .HasColumnName("d_From_Date");
            entity.Property(e => e.DToDate)
                .HasColumnType("datetime")
                .HasColumnName("d_To_Date");
            entity.Property(e => e.Epf).HasColumnName("EPF");
            entity.Property(e => e.Fpf).HasColumnName("FPF");
            entity.Property(e => e.PaidDays).HasColumnName("Paid_Days");
            entity.Property(e => e.PeriodCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Period_Code");
            entity.Property(e => e.Pf).HasColumnName("PF");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.TotPf).HasColumnName("Tot_pf");
            entity.Property(e => e.VPfno)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("v_PFno");
            entity.Property(e => e.Vpf).HasColumnName("VPF");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PayOutputPfs)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_PayOutput_PF");
        });

        modelBuilder.Entity<PayProcess>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PayProce__3213E83FA5CD3307");

            entity.ToTable("PayProcess");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.DFromDate)
                .HasColumnType("datetime")
                .HasColumnName("d_From_Date");
            entity.Property(e => e.DToDate)
                .HasColumnType("datetime")
                .HasColumnName("d_To_Date");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.ProcessDate).HasColumnType("datetime");
            entity.Property(e => e.SalaryPeriod)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("salary_period");
        });

        modelBuilder.Entity<PaymAttbonu>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("paym_attbonus");

            entity.Property(e => e.AttbonusId).ValueGeneratedOnAdd();
            entity.Property(e => e.CategoryId)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.CategoryName)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Fullatt).HasColumnType("decimal(7, 2)");
            entity.Property(e => e.Halfatt).HasColumnType("decimal(7, 2)");
            entity.Property(e => e.Oneatt).HasColumnType("decimal(7, 2)");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchId");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyId");
        });

        modelBuilder.Entity<PaymBank>(entity =>
        {
            entity.HasKey(e => e.PnBankId).HasName("pk_paym_Bank");

            entity.ToTable("paym_Bank");

            entity.Property(e => e.PnBankId).HasColumnName("pn_BankID");
            entity.Property(e => e.AccountType)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Account_Type");
            entity.Property(e => e.Address)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.BranchName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Branch_Name");
            entity.Property(e => e.IfscCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Ifsc_Code");
            entity.Property(e => e.MicrCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Micr_Code");
            entity.Property(e => e.Others)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("others");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");
            entity.Property(e => e.VBankCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("v_BankCode");
            entity.Property(e => e.VBankName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("v_BankName");
        });

        modelBuilder.Entity<PaymBranch>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnBranchId }).HasName("pk_paym_Branch");

            entity.ToTable("paym_Branch");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnBranchId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_BranchID");
            entity.Property(e => e.AddressLine1)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Address_Line1");
            entity.Property(e => e.AddressLine2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Address_Line2");
            entity.Property(e => e.AlternateEmailId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("AlternateEmail_Id");
            entity.Property(e => e.BranchCode)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.BranchName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.BranchPassword)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Branch_Password");
            entity.Property(e => e.BranchUserId)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Branch_User_Id");
            entity.Property(e => e.City)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Country)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EmailId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Email_Id");
            entity.Property(e => e.EndDate)
                .HasColumnType("datetime")
                .HasColumnName("end_date");

            entity.Property(e => e.FaxNo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Fax_No");
            ;
            entity.Property(e => e.PhoneNo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Phone_No");
            entity.Property(e => e.StartDate)
                .HasColumnType("datetime")
                .HasColumnName("start_date");
            entity.Property(e => e.State)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");
            entity.Property(e => e.ZipCode)
                .HasMaxLength(50)
                .IsUnicode(false);
           

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PaymBranches)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_paym_Branch");
        });

        modelBuilder.Entity<PaymCarryForward>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__paym_Car__3213E83FEEB41019");

            entity.ToTable("paym_CarryForward");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AllowDays)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("Allow_Days");
            entity.Property(e => e.BalDays)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("Bal_Days");
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.MaxDays)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("Max_Days");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchId");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyId");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeId");
            entity.Property(e => e.PnLeaveId).HasColumnName("Pn_LeaveId");
            entity.Property(e => e.TakenDays)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("Taken_Days");
            entity.Property(e => e.YearEnd)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PaymCategory>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.BranchId, e.PnCategoryId });

            entity.ToTable("paym_Category");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.PnCategoryId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_CategoryID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");
            entity.Property(e => e.VCategoryName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_CategoryName");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PaymCategories)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Category_Company");
        });

        modelBuilder.Entity<PaymCompany>(entity =>
        {
            entity.HasKey(e => e.PnCompanyId).HasName("PK__paym_Com__71C964047F483DA6");

            entity.ToTable("paym_Company");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.AddressLine1)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Address_Line1");
            entity.Property(e => e.AddressLine2)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Address_Line2");
            entity.Property(e => e.AlternateEmailId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("AlternateEmail_Id");
            entity.Property(e => e.City)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CompanyCode)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.CompanyName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Country)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EmailId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Email_Id");
            entity.Property(e => e.EndDate)
                .HasColumnType("datetime")
                .HasColumnName("end_date");
          
            entity.Property(e => e.FaxNo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Fax_No");
          
            entity.Property(e => e.PhoneNo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Phone_No");
            entity.Property(e => e.StartDate)
                .HasColumnType("datetime")
                .HasColumnName("start_date");

            entity.Property(e => e.CompanyUserId)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Company_User_Id");
            entity.Property(e => e.CompanyPassword)
              .HasMaxLength(10)
              .IsUnicode(false)
              .HasColumnName("Company_password"); 
            entity.Property(e => e.State)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ZipCode)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PaymComputation>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnBranchId, e.PnEarningsCode }).HasName("pk_paym_Computation");

            entity.ToTable("paym_Computation");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnEarningsCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("pn_EarningsCode");
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnName("id");
            entity.Property(e => e.Type)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PaymDeduction>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnDeductionId }).HasName("pk_paym_Deduction");

            entity.ToTable("paym_Deduction");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnDeductionId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_DeductionID");
            entity.Property(e => e.CPrint)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("c_Print");
            entity.Property(e => e.CRegular)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("c_Regular");
            entity.Property(e => e.DOrder).HasColumnName("d_order");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");
            entity.Property(e => e.VDeductionCode)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_DeductionCode");
            entity.Property(e => e.VDeductionName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_DeductionName");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PaymDeductions)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Deduction_Company");
        });

        modelBuilder.Entity<PaymDepartment>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnBranchId, e.PnDepartmentId });

            entity.ToTable("paym_Department");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnDepartmentId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_DepartmentID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");
            entity.Property(e => e.VDepartmentName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_DepartmentName");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PaymDepartments)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Department_Company");
        });

        modelBuilder.Entity<PaymDesignation>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.BranchId, e.VDesignationName }).HasName("PK_paym_Designation_1");

            entity.ToTable("paym_Designation");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.VDesignationName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_DesignationName");
            entity.Property(e => e.Authority)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.PnDesignationId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_DesignationID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PaymDesignations)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Designation_Company");
        });

        modelBuilder.Entity<PaymDivision>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.BranchId, e.VDivisionName }).HasName("PK_paym_Division_1");

            entity.ToTable("paym_Division");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.VDivisionName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_DivisionName");
            entity.Property(e => e.PnDivisionId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_DivisionID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PaymDivisions)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Division_Company");
        });

        modelBuilder.Entity<PaymEarning>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnEarningsId }).HasName("pk_paym_Earnings");

            entity.ToTable("paym_Earnings");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEarningsId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_EarningsID");
            entity.Property(e => e.CEsi)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("c_ESI");
            entity.Property(e => e.CLop)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("c_LOP");
            entity.Property(e => e.COt)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("c_OT");
            entity.Property(e => e.CPf)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("c_PF");
            entity.Property(e => e.CPrint)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("c_Print");
            entity.Property(e => e.CPt)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("c_PT");
            entity.Property(e => e.CRegular)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("c_Regular");
            entity.Property(e => e.DOrder).HasColumnName("d_order");
            entity.Property(e => e.Payslip)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("payslip");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");
            entity.Property(e => e.VEarningsCode)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_EarningsCode");
            entity.Property(e => e.VEarningsName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_EarningsName");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PaymEarnings)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Earnings_Company");
        });

        modelBuilder.Entity<PaymEmpDeduction>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnBranchId, e.PnEmployeeId, e.PnDeductionId, e.DDate }).HasName("pk_paym_Emp_Deduction");

            entity.ToTable("paym_Emp_Deduction");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.PnDeductionId).HasColumnName("pn_DeductionID");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.CEligible)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("c_eligible");
            entity.Property(e => e.FromDate)
                .HasColumnType("datetime")
                .HasColumnName("from_date");
            entity.Property(e => e.NAmount).HasColumnName("n_Amount");
            entity.Property(e => e.PeriodCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("period_code");
            entity.Property(e => e.ToDate)
                .HasColumnType("datetime")
                .HasColumnName("to_date");

            entity.HasOne(d => d.PaymBranch).WithMany(p => p.PaymEmpDeductions)
                .HasForeignKey(d => new { d.PnCompanyId, d.PnBranchId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_paym_Deduction_Branch");

            entity.HasOne(d => d.PaymDeduction).WithMany(p => p.PaymEmpDeductions)
                .HasForeignKey(d => new { d.PnCompanyId, d.PnDeductionId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_paym_Deduction_Deduction");

            entity.HasOne(d => d.PaymEmployee).WithMany(p => p.PaymEmpDeductions)
                .HasForeignKey(d => new { d.PnCompanyId, d.PnBranchId, d.PnEmployeeId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_paym_Deduction_Employee");
        });

        modelBuilder.Entity<PaymEmpEarning>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnBranchId, e.PnEmployeeId, e.PnEarningsId, e.Pid, e.DDate }).HasName("pk_paym_Emp_Earnings");

            entity.ToTable("paym_Emp_Earnings");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.PnEarningsId).HasColumnName("pn_EarningsID");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.CEligible)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("c_eligible");
            entity.Property(e => e.Flag)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.FromDate)
                .HasColumnType("datetime")
                .HasColumnName("from_date");
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnName("ID");
            entity.Property(e => e.NAmount).HasColumnName("n_Amount");
            entity.Property(e => e.ToDate)
                .HasColumnType("datetime")
                .HasColumnName("to_date");

            entity.HasOne(d => d.PaymBranch).WithMany(p => p.PaymEmpEarnings)
                .HasForeignKey(d => new { d.PnCompanyId, d.PnBranchId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_paym_Earnings_Branch");

            entity.HasOne(d => d.PaymEarning).WithMany(p => p.PaymEmpEarnings)
                .HasForeignKey(d => new { d.PnCompanyId, d.PnEarningsId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_paym_Earnings_Earnings");

            entity.HasOne(d => d.PaymEmployee).WithMany(p => p.PaymEmpEarnings)
                .HasForeignKey(d => new { d.PnCompanyId, d.PnBranchId, d.PnEmployeeId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_paym_Earnings_Employee");
        });

        modelBuilder.Entity<PaymEmployee>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnBranchId, e.PnEmployeeId }).HasName("pk_paym_Employee");

            entity.ToTable("paym_Employee");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnEmployeeId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_EmployeeID");

            entity.Property(e => e.EmployeeCode).HasMaxLength(50).IsUnicode(false);
            entity.Property(e => e.EmployeeFirstName).HasMaxLength(50).IsUnicode(false).HasColumnName("Employee_First_Name");
            entity.Property(e => e.EmployeeMiddleName).HasMaxLength(50).IsUnicode(false).HasColumnName("Employee_Middle_Name");
            entity.Property(e => e.EmployeeLastName).HasMaxLength(50).IsUnicode(false).HasColumnName("Employee_Last_Name");
            entity.Property(e => e.EmployeeFullName).HasMaxLength(70).IsUnicode(false).HasColumnName("Employee_Full_Name");

            entity.Property(e => e.DateofBirth).HasColumnType("datetime");
            entity.Property(e => e.Password).HasMaxLength(20).IsUnicode(false);
            entity.Property(e => e.Gender).HasMaxLength(20).IsUnicode(false);
            entity.Property(e => e.Status).HasMaxLength(1).IsUnicode(false).IsFixedLength().HasColumnName("status");

            entity.Property(e => e.Readerid);
            entity.Property(e => e.OtEligible).HasMaxLength(1).IsUnicode(false).IsFixedLength().HasColumnName("OT_Eligible");
            entity.Property(e => e.Pfno).HasMaxLength(20).IsUnicode(false);
            entity.Property(e => e.Esino).HasMaxLength(20).IsUnicode(false);
            entity.Property(e => e.OtCalc).HasColumnName("OT_calc");
            entity.Property(e => e.Ctc).HasColumnName("CTC");
            entity.Property(e => e.BasicSalary).HasColumnName("basic_salary");

            entity.Property(e => e.BankCode).HasMaxLength(10).IsUnicode(false).HasColumnName("Bank_code");
            entity.Property(e => e.BankName).HasMaxLength(30).IsUnicode(false).HasColumnName("Bank_Name");
            entity.Property(e => e.BranchName).HasMaxLength(30).IsUnicode(false).HasColumnName("Branch_Name");
            entity.Property(e => e.AccountType).HasMaxLength(20).IsUnicode(false).HasColumnName("Account_Type");
            entity.Property(e => e.MicrCode).HasMaxLength(20).IsUnicode(false).HasColumnName("MICR_code");
            entity.Property(e => e.IfscCode).HasMaxLength(20).IsUnicode(false).HasColumnName("IFSC_Code");
          //  entity.Property(e => e.Address).HasMaxLength(50).IsUnicode(false);
            entity.Property(e => e.OtherInfo).HasMaxLength(100).IsUnicode(false).HasColumnName("Other_Info");

            entity.Property(e => e.ReportingPerson).HasMaxLength(50).IsUnicode(false).HasColumnName("Reporting_person");
            entity.Property(e => e.ReportingId).HasColumnName("ReportingID");
            entity.Property(e => e.ReportingEmail).HasMaxLength(50).IsUnicode(false).HasColumnName("Reporting_email");

            entity.Property(e => e.PanNo).HasMaxLength(20).IsUnicode(false).HasColumnName("Pan_no");
            entity.Property(e => e.SalaryType).HasMaxLength(5).IsUnicode(false).HasColumnName("salary_type");
            entity.Property(e => e.TdsApplicable).HasMaxLength(1).IsUnicode(false).IsFixedLength().HasColumnName("TDS_Applicable");
            entity.Property(e => e.Flag).HasMaxLength(1).IsUnicode(false);
            entity.Property(e => e.Role).HasColumnName("role");
            entity.Property(e => e.AccountNo).HasMaxLength(50).IsUnicode(false).HasColumnName("accountNo");

            // Additional Columns
            entity.Property(e => e.BloodGroup).HasMaxLength(20).IsUnicode(false).HasColumnName("Blood_Group");
            entity.Property(e => e.PhoneNo).HasMaxLength(20).IsUnicode(false).HasColumnName("Phone_No");
            entity.Property(e => e.AlternatePhoneNo).HasMaxLength(20).IsUnicode(false).HasColumnName("Alternate_Phone_No");
            entity.Property(e => e.PermanentAddress).HasMaxLength(200).IsUnicode(false).HasColumnName("permanent_address");
            entity.Property(e => e.AadharCard).HasMaxLength(20).IsUnicode(false).HasColumnName("Aadhar_Card");
            entity.Property(e => e.CurrentAddress).HasMaxLength(200).IsUnicode(false).HasColumnName("Current_Address");
            entity.Property(e => e.FatherName).HasMaxLength(200).IsUnicode(false).HasColumnName("Father_Name");
            entity.Property(e => e.Email).HasMaxLength(100).IsUnicode(false);
            entity.Property(e => e.AlternateEmail).HasMaxLength(100).IsUnicode(false).HasColumnName("Alternate_Email");
            entity.Property(e => e.Grade).HasMaxLength(30).IsUnicode(false);
            entity.Property(e => e.OverallExperience).HasColumnName("Overall_Experience");
            entity.Property(e => e.HighestQualification).HasMaxLength(100).IsUnicode(false);
            entity.Property(e => e.UniversityName).HasMaxLength(100).IsUnicode(false);
            entity.Property(e => e.YearOfPassing).HasColumnName("YearOfPassing");
            entity.Property(e => e.Certifications).HasMaxLength(255).IsUnicode(false);
            entity.Property(e => e.Skills).IsUnicode().HasColumnName("Skills");
            entity.Property(e => e.UAN).HasMaxLength(25).IsUnicode(false);
            entity.Property(e => e.PaymentMode).HasMaxLength(100).IsUnicode(false);
            entity.Property(e => e.PassportNumber).HasMaxLength(20).IsUnicode(false);
            entity.Property(e => e.VisaDetails).HasMaxLength(200).IsUnicode(false);
            entity.Property(e => e.JoiningDate).HasColumnType("date");
            entity.Property(e => e.ExitDate).HasColumnType("date");
            entity.Property(e => e.ExitReason).HasMaxLength(100).IsUnicode(false);
            entity.Property(e => e.PreviousCompany).HasMaxLength(100).IsUnicode(false);
            entity.Property(e => e.PreviousDesignation).HasMaxLength(100).IsUnicode(false);
            entity.Property(e => e.PreviousEmploymentDuration).HasMaxLength(50).IsUnicode(false);
            entity.Property(e => e.ReasonForLeaving).HasMaxLength(255).IsUnicode(false);
            entity.Property(e => e.PerformanceRating).HasColumnType("decimal(3,2)");
            entity.Property(e => e.TrainingRecords).HasMaxLength(255).IsUnicode(false);
            entity.Property(e => e.DisciplinaryActions).HasMaxLength(255).IsUnicode(false);
            entity.Property(e => e.Awards).HasMaxLength(255).IsUnicode(false);
            entity.Property(e => e.VehicleDetails).HasMaxLength(255).IsUnicode(false);
            entity.Property(e => e.HealthInsuranceDetails).HasMaxLength(255).IsUnicode(false);
            entity.Property(e => e.NomineeDetails).HasMaxLength(255).IsUnicode(false);
            entity.Property(e => e.AssetName).HasMaxLength(100).IsUnicode(false).HasColumnName("Asset_Name");
            entity.Property(e => e.AssetSerialNumber).HasMaxLength(100).IsUnicode(false).HasColumnName("Asset_SerialNumber");

            // Foreign Key
            entity.HasOne(d => d.PaymBranch)
                .WithMany(p => p.PaymEmployees)
                .HasForeignKey(d => new { d.PnCompanyId, d.PnBranchId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_paym_Employee");
        });
        modelBuilder.Entity<PaymEmployeeLeave>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__paym_Emp__3213E83F54C7D58B");

            entity.ToTable("paym_Employee_leave");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.FromDate)
                .HasColumnType("datetime")
                .HasColumnName("From_Date");
            entity.Property(e => e.FromStatus)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("From_Status");
            entity.Property(e => e.LeaveCount).HasColumnName("Leave_Count");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.PnLeaveId).HasColumnName("pn_leaveID");
            entity.Property(e => e.ToDate)
                .HasColumnType("datetime")
                .HasColumnName("To_Date");
            entity.Property(e => e.ToStatus)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("To_Status");
        });

        modelBuilder.Entity<PaymEmployeeProfile1>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__paym_emp__3214EC0705F41DE2");

            entity.ToTable("paym_employee_profile1");

            entity.Property(e => e.d_Date)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCategoryId).HasColumnName("pn_CategoryId");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnDepartmentId).HasColumnName("pn_DepartmentId");
            entity.Property(e => e.PnDesingnationId).HasColumnName("pn_DesingnationId");
            entity.Property(e => e.PnDivisionId).HasColumnName("pn_DivisionId");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.PnGradeId).HasColumnName("pn_GradeId");
            entity.Property(e => e.PnJobStatusId).HasColumnName("pn_JobStatusId");
            entity.Property(e => e.PnLevelId).HasColumnName("pn_LevelID");
            entity.Property(e => e.PnProjectsiteId).HasColumnName("pn_projectsiteID");
            entity.Property(e => e.PnShiftId).HasColumnName("pn_ShiftId");
            entity.Property(e => e.RDepartment).HasColumnName("r_Department");
            entity.Property(e => e.VReason)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("v_Reason");
            entity.Property(e => e.ImageData)
     .HasColumnName("image_data")
     .HasColumnType("varbinary(max)");

            entity.HasOne(d => d.PaymCategory).WithMany(p => p.PaymEmployeeProfile1s)
                .HasForeignKey(d => new { d.PnCompanyId, d.PnBranchId, d.PnCategoryId })
                .HasConstraintName("fk_paym_Employee_Category");

            entity.HasOne(d => d.PaymDepartment).WithMany(p => p.PaymEmployeeProfile1s)
                .HasForeignKey(d => new { d.PnCompanyId, d.PnBranchId, d.PnDepartmentId })
                .HasConstraintName("fk_paym_Employee_Profile1");

            // ADD THIS
            entity.HasOne(d => d.PaymEmployee)
       .WithMany(p => p.PaymEmployeeProfile1s)
       .HasForeignKey(d => new { d.PnCompanyId, d.PnBranchId, d.PnEmployeeId })
       .HasConstraintName("fk_paym_Employee_Profile1_Parent");

        });
        modelBuilder.Entity<PaymEmployeeWorkDetail>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnBranchId, e.PnEmployeeId }).HasName("pk_paym_Employee_workdetails");

            entity.ToTable("paym_Employee_WorkDetails");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.ConfirmationDate).HasColumnType("datetime");
            entity.Property(e => e.ContractRenviewDate).HasColumnType("datetime");
            entity.Property(e => e.ExtendedUpto).HasColumnType("datetime");
            entity.Property(e => e.JoiningDate).HasColumnType("datetime");
            entity.Property(e => e.OfferDate).HasColumnType("datetime");
            entity.Property(e => e.ProbationUpto).HasColumnType("datetime");
            entity.Property(e => e.RetirementDate).HasColumnType("datetime");
            entity.Property(e => e.VReason)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("v_Reason");

            entity.HasOne(d => d.PaymEmployee).WithOne(p => p.PaymEmployeeWorkDetail)
                .HasForeignKey<PaymEmployeeWorkDetail>(d => new { d.PnCompanyId, d.PnBranchId, d.PnEmployeeId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_paym_Employee_WorkDetails");
        });

        modelBuilder.Entity<PaymEncashmentDetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__paym_Enc__3213E83FD6E8B726");

            entity.ToTable("paym_EncashmentDetails");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AllowDays)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("Allow_Days");
            entity.Property(e => e.BalDays)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("Bal_Days");
            entity.Property(e => e.BasicPerDay)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("Basic_PerDay");
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.MaxDays)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("Max_Days");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchId");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyId");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeId");
            entity.Property(e => e.PnLeaveId).HasColumnName("Pn_LeaveId");
            entity.Property(e => e.TakenDays)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("Taken_Days");
            entity.Property(e => e.TotalAmt)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("Total_Amt");
            entity.Property(e => e.YearEnd)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PaymGrade>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.BranchId, e.VGradeName }).HasName("PK_paym_Grade_1");

            entity.ToTable("paym_Grade");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.VGradeName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_GradeName");
            entity.Property(e => e.PnGradeId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_GradeID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PaymGrades)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Grade_Company");
        });

        modelBuilder.Entity<PaymHoliday>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__paym_hol__3213E83F64508E2E");

            entity.ToTable("paym_holiday");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Days).HasColumnName("days");
            entity.Property(e => e.FromDate)
                .HasColumnType("datetime")
                .HasColumnName("From_date");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnHolidaycode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("pn_Holidaycode");
            entity.Property(e => e.PnHolidayname)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("pn_Holidayname");
            entity.Property(e => e.ToDate)
                .HasColumnType("datetime")
                .HasColumnName("To_date");
        });

        modelBuilder.Entity<PaymJobStatus>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.BranchId, e.VJobStatusName }).HasName("PK_paym_JobStatus_1");

            entity.ToTable("paym_JobStatus");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.VJobStatusName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_JobStatusName");
            entity.Property(e => e.PnJobStatusId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_JobStatusID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PaymJobStatuses)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_JobStatus_Company");
        });

        modelBuilder.Entity<PaymLeave>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnLeaveId }).HasName("pk_paym_leave");

            entity.ToTable("paym_leave");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnLeaveId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_leaveID");
            //entity.Property(e => e.AnnualLeave)
            //    .HasMaxLength(30)
            //    .IsUnicode(false)
            //    .HasColumnName("annual_leave");
            //entity.Property(e => e.El)
            //    .HasMaxLength(6)
            //    .IsUnicode(false)
            //    .HasColumnName("EL");
            entity.Property(e => e.MaxDays).HasColumnName("max_days");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCount).HasColumnName("pn_Count");
            entity.Property(e => e.PnLeaveCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("pn_leaveCode");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");
            entity.Property(e => e.Type)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.VLeaveName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_leaveName");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PaymLeaves)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_leave_Company");
        });

        modelBuilder.Entity<PaymLeaveAllocation1>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyid, e.PnBranchid, e.PnLeaveid, e.PnEmployeeid, e.Yearend });

            entity.ToTable("paym_leaveAllocation1");

            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnLeaveid).HasColumnName("pn_leaveid");
            entity.Property(e => e.PnEmployeeid).HasColumnName("pn_employeeid");
            entity.Property(e => e.Yearend).HasColumnName("yearend");
            entity.Property(e => e.CyCount).HasColumnName("cy_count");
            entity.Property(e => e.Leaveby)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.NCount).HasColumnName("n_count");
        });

        modelBuilder.Entity<PaymLevel>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.BranchId, e.VLevelName }).HasName("PK_paym_Level_1");

            entity.ToTable("paym_Level");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.VLevelName)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_LevelName");
            entity.Property(e => e.PnLevelId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_LevelID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PaymLevels)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Level_Company");
        });

        modelBuilder.Entity<PaymLoan>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyid, e.PnLoanId }).HasName("pk_paym_loan");

            entity.ToTable("paym_Loan");

            entity.Property(e => e.PnCompanyid).HasColumnName("pn_Companyid");
            entity.Property(e => e.PnLoanId)
                .ValueGeneratedOnAdd()
                .HasColumnName("pn_LoanID");
            entity.Property(e => e.PnBranchId).HasColumnName("Pn_BranchID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");
            entity.Property(e => e.VLoanCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("v_LoanCode");
            entity.Property(e => e.VLoanName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("v_LoanName");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PaymLoans)
                .HasForeignKey(d => d.PnCompanyid)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_paym_loan");
        });

        modelBuilder.Entity<PaymLoanDiminishing>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__paym_loa__3213E83FCDBD660B");

            entity.ToTable("paym_loan_diminishing");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.BalanceAmt)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("balance_amt");
            entity.Property(e => e.EffDate)
                .HasColumnType("datetime")
                .HasColumnName("eff_date");
            entity.Property(e => e.FnLoanId).HasColumnName("fn_LoanId");
            entity.Property(e => e.FromDate)
                .HasColumnType("datetime")
                .HasColumnName("from_date");
            entity.Property(e => e.InstalAmt)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("instal_amt");
            entity.Property(e => e.InstallementCount).HasColumnName("installement_count");
            entity.Property(e => e.LoanAmount).HasColumnName("loan_amount");
            entity.Property(e => e.LoanAppid)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("loan_appid");
            entity.Property(e => e.LoanStatus)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("loan_status");
            entity.Property(e => e.Months).HasColumnName("months");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.PnEmployeeid).HasColumnName("pn_employeeid");
            entity.Property(e => e.ToDate)
                .HasColumnType("datetime")
                .HasColumnName("to_date");
        });

        modelBuilder.Entity<PaymOverHeadingCost>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.BranchId, e.OverHeadingName }).HasName("PK_paym_OverHeadingCost_1");

            entity.ToTable("paym_OverHeadingCost");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.OverHeadingName)
                .HasMaxLength(40)
                .IsUnicode(false);
            entity.Property(e => e.OverHeadingId)
                .ValueGeneratedOnAdd()
                .HasColumnName("overHeadingID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("status");

            entity.HasOne(d => d.PnCompany).WithMany(p => p.PaymOverHeadingCosts)
                .HasForeignKey(d => d.PnCompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_OverHeading_Company");
        });

        modelBuilder.Entity<PaymPaybill>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__paym_pay__3213E83FDAE0CC77");

            entity.ToTable("paym_paybill");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AbsentDays).HasColumnName("Absent_Days");
            entity.Property(e => e.ActBasic).HasColumnName("Act_Basic");
            entity.Property(e => e.AddressLine1)
                .HasMaxLength(500)
                .HasColumnName("Address_line1");
            entity.Property(e => e.AddressLine2)
                .HasMaxLength(500)
                .HasColumnName("Address_Line2");
            entity.Property(e => e.Allowance1).HasMaxLength(50);
            entity.Property(e => e.Allowance10).HasMaxLength(50);
            entity.Property(e => e.Allowance2).HasMaxLength(50);
            entity.Property(e => e.Allowance3).HasMaxLength(50);
            entity.Property(e => e.Allowance4).HasMaxLength(50);
            entity.Property(e => e.Allowance5).HasMaxLength(50);
            entity.Property(e => e.Allowance6).HasMaxLength(50);
            entity.Property(e => e.Allowance7).HasMaxLength(50);
            entity.Property(e => e.Allowance8).HasMaxLength(50);
            entity.Property(e => e.Allowance9).HasMaxLength(50);
            entity.Property(e => e.CalcDays).HasColumnName("Calc_Days");
            entity.Property(e => e.CategoryName).HasMaxLength(50);
            entity.Property(e => e.City).HasMaxLength(50);
            entity.Property(e => e.CompanyName).HasMaxLength(50);
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_date");
            entity.Property(e => e.DedAmount).HasColumnName("Ded_Amount");
            entity.Property(e => e.Deduction1).HasMaxLength(50);
            entity.Property(e => e.Deduction10).HasMaxLength(50);
            entity.Property(e => e.Deduction2).HasMaxLength(50);
            entity.Property(e => e.Deduction3).HasMaxLength(50);
            entity.Property(e => e.Deduction4).HasMaxLength(50);
            entity.Property(e => e.Deduction5).HasMaxLength(50);
            entity.Property(e => e.Deduction6).HasMaxLength(50);
            entity.Property(e => e.Deduction7).HasMaxLength(50);
            entity.Property(e => e.Deduction8).HasMaxLength(50);
            entity.Property(e => e.Deduction9).HasMaxLength(50);
            entity.Property(e => e.DepartmentName).HasMaxLength(50);
            entity.Property(e => e.DesignationName).HasMaxLength(50);
            entity.Property(e => e.EarnAmount).HasColumnName("Earn_Amount");
            entity.Property(e => e.EarnedBasic).HasColumnName("Earned_Basic");
            entity.Property(e => e.EmployeeCode).HasMaxLength(50);
            entity.Property(e => e.EmployeeFirstName)
                .HasMaxLength(50)
                .HasColumnName("Employee_First_Name");
            entity.Property(e => e.Epf).HasColumnName("EPF");
            entity.Property(e => e.Fpf).HasColumnName("FPF");
            entity.Property(e => e.GradeName).HasMaxLength(50);
            entity.Property(e => e.GrossSalary).HasColumnName("Gross_salary");
            entity.Property(e => e.JoiningDate).HasMaxLength(50);
            entity.Property(e => e.MaxAmount).HasColumnName("max_amount");
            entity.Property(e => e.NetSalary).HasColumnName("Net_salary");
            entity.Property(e => e.OtAmt).HasColumnName("ot_amt");
            entity.Property(e => e.OtHrs)
                .HasColumnType("datetime")
                .HasColumnName("ot_hrs");
            entity.Property(e => e.OtValue).HasColumnName("ot_value");
            entity.Property(e => e.PaidDays).HasColumnName("Paid_Days");
            entity.Property(e => e.PeriodCode)
                .HasMaxLength(50)
                .HasColumnName("period_code");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.PresentDays).HasColumnName("Present_Days");
            entity.Property(e => e.TotLeaveDays).HasColumnName("TotLeave_Days");
            entity.Property(e => e.Value1).HasColumnName("value1");
            entity.Property(e => e.Value10).HasColumnName("value10");
            entity.Property(e => e.Value2).HasColumnName("value2");
            entity.Property(e => e.Value3).HasColumnName("value3");
            entity.Property(e => e.Value4).HasColumnName("value4");
            entity.Property(e => e.Value5).HasColumnName("value5");
            entity.Property(e => e.Value6).HasColumnName("value6");
            entity.Property(e => e.Value7).HasColumnName("value7");
            entity.Property(e => e.Value8).HasColumnName("value8");
            entity.Property(e => e.Value9).HasColumnName("value9");
            entity.Property(e => e.ValueA1).HasColumnName("valueA1");
            entity.Property(e => e.ValueA10).HasColumnName("valueA10");
            entity.Property(e => e.ValueA2).HasColumnName("valueA2");
            entity.Property(e => e.ValueA3).HasColumnName("valueA3");
            entity.Property(e => e.ValueA4).HasColumnName("valueA4");
            entity.Property(e => e.ValueA5).HasColumnName("valueA5");
            entity.Property(e => e.ValueA6).HasColumnName("valueA6");
            entity.Property(e => e.ValueA7).HasColumnName("valueA7");
            entity.Property(e => e.ValueA8).HasColumnName("valueA8");
            entity.Property(e => e.ValueA9).HasColumnName("valueA9");
        });

        modelBuilder.Entity<PaymPermission>(entity =>
        {
            entity.HasKey(e => new { e.CompanyId, e.BranchId, e.EmployeeId, e.Date, e.Session }).HasName("PK_Paym_Permission_1");

            entity.ToTable("Paym_Permission");

            entity.Property(e => e.CompanyId).HasColumnName("CompanyID");
            entity.Property(e => e.BranchId).HasColumnName("BranchID");
            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.Session).HasMaxLength(50);
            entity.Property(e => e.EmployeeName).HasMaxLength(50);
            entity.Property(e => e.PermissionId)
                .ValueGeneratedOnAdd()
                .HasColumnName("PermissionID");
            entity.Property(e => e.Status).HasMaxLength(50);
        });

        modelBuilder.Entity<PaymPf>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyId, e.PnBranchId, e.DDate }).HasName("pk_paym_PF");

            entity.ToTable("paym_PF");

            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_date");
            entity.Property(e => e.AdminCharges).HasColumnName("Admin_Charges");
            entity.Property(e => e.CRound)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("c_Round");
            entity.Property(e => e.CheckAllowance)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("check_allowance");
            entity.Property(e => e.CheckCeiling)
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasColumnName("check_ceiling");
            entity.Property(e => e.EligibilityAmt).HasColumnName("Eligibility_Amt");
            entity.Property(e => e.EmpConEpf).HasColumnName("Emp_Con_EPF");
            entity.Property(e => e.EmpConFpf).HasColumnName("Emp_Con_FPF");
            entity.Property(e => e.EmpConPf).HasColumnName("Emp_Con_PF");
            entity.Property(e => e.MaxAmount).HasColumnName("max_amount");
            entity.Property(e => e.Month)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("month");
            entity.Property(e => e.Year).HasColumnName("year");

            entity.HasOne(d => d.PaymBranch).WithMany(p => p.PaymPfs)
                .HasForeignKey(d => new { d.PnCompanyId, d.PnBranchId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_paym_PF");
        });
        modelBuilder.Entity<PaymShift>(entity =>
        {
            entity.HasKey(e => e.pn_ShiftID).HasName("pk_paym_Shift");

            entity.ToTable("paym_Shift");

            entity.Property(e => e.pn_ShiftID)
                .ValueGeneratedOnAdd();

            entity.Property(e => e.pn_CompanyID).IsRequired();
            entity.Property(e => e.pn_branchid).IsRequired();

            entity.Property(e => e.shift_code)
                .HasMaxLength(20)
                .IsUnicode(false)
                .IsRequired();

            entity.Property(e => e.start_time);
            entity.Property(e => e.break_time_out);
            entity.Property(e => e.break_time_in);
            entity.Property(e => e.end_time);

            entity.Property(e => e.shift_indicator)
                .HasMaxLength(30)
                .IsUnicode(false);

            entity.Property(e => e.Shift_Type)
                .HasMaxLength(40)
                .IsUnicode(false);

            // ✅ Fix foreign key mapping to PaymCompany
            entity.HasOne(e => e.PaymCompany)
                .WithMany(c => c.PaymShifts) // assuming collection navigation on company side
                .HasForeignKey(e => e.pn_CompanyID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Shift_Company");
        });

        modelBuilder.Entity<PaymVpf>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Paym_vpf__3213E83F27E967C9");

            entity.ToTable("Paym_vpf");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ContributionType)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("contribution_type");
            entity.Property(e => e.Employeename)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("employeename");
            entity.Property(e => e.Monthlycontribution)
                .HasColumnType("money")
                .HasColumnName("monthlycontribution");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.PnEmployeeId)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("pn_EmployeeID");
            entity.Property(e => e.Salaryfrom)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("salaryfrom");
            entity.Property(e => e.Vpfamount)
                .HasColumnType("money")
                .HasColumnName("vpfamount");
        });

        modelBuilder.Entity<PayoutputLoan>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__payoutpu__3213E83F0E217D2D");

            entity.ToTable("payoutput_loan");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Amount).HasColumnType("decimal(8, 2)");
            entity.Property(e => e.BalanceAmt)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("balance_amt");
            entity.Property(e => e.CountInstallement).HasColumnName("count_installement");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.DFromDate)
                .HasColumnType("datetime")
                .HasColumnName("d_From_Date");
            entity.Property(e => e.DToDate)
                .HasColumnType("datetime")
                .HasColumnName("d_To_Date");
            entity.Property(e => e.InstalAmt)
                .HasColumnType("decimal(8, 2)")
                .HasColumnName("instal_amt");
            entity.Property(e => e.InstallementCount).HasColumnName("installement_count");
            entity.Property(e => e.LoanAppid)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("loan_appid");
            entity.Property(e => e.LoanStatus)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("loan_status");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.PnEmployeeid).HasColumnName("pn_employeeid");
            entity.Property(e => e.PnLoanid).HasColumnName("pn_loanid");
        });

        modelBuilder.Entity<PayrollFinalSettlement>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyid, e.PnEmployeeid, e.ReferenceNo }).HasName("pk_Payroll_final_settlement");

            entity.ToTable("Payroll_final_settlement");

            entity.Property(e => e.PnCompanyid).HasColumnName("Pn_companyid");
            entity.Property(e => e.PnEmployeeid).HasColumnName("pn_employeeid");
            entity.Property(e => e.ReferenceNo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.DeductSalaryAmount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Deduct_Salary_Amount");
            entity.Property(e => e.EncashmentAmount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Encashment_Amount");
            entity.Property(e => e.FinalAmount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Final_Amount");
            entity.Property(e => e.GrauityAmount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Grauity_Amount");
            entity.Property(e => e.JoiningDate)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("joining_date");
            entity.Property(e => e.LastWorkingDate)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Last_Working_date");
            entity.Property(e => e.LoanAmount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("Loan_Amount");
            entity.Property(e => e.PfAmount)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("PF_Amount");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PfEp>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PF_EPS__3214EC070EC3C3D2");

            entity.ToTable("PF_EPS");

            entity.Property(e => e.Address1)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("address1");
            entity.Property(e => e.City)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("city");
            entity.Property(e => e.Disabled)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.District)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Dob)
                .HasColumnType("datetime")
                .HasColumnName("DOB");
            entity.Property(e => e.FamilyMemberName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("FamilyMember_Name");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.PinNo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("pin_no");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_companyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_employeeID");
            entity.Property(e => e.Relationship)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.State)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PfEpf>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PF_EPF__3214EC07ABA7CB1D");

            entity.ToTable("PF_EPF");

            entity.Property(e => e.Address1)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("address1");
            entity.Property(e => e.City)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("city");
            entity.Property(e => e.District)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Dob)
                .HasColumnType("datetime")
                .HasColumnName("DOB");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.NomineeName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Nominee_Name");
            entity.Property(e => e.PfShare)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("PF_Share");
            entity.Property(e => e.PinNo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("pin_no");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_companyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_employeeID");
            entity.Property(e => e.Relationship)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.State)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PunchDetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__punch_de__3213E83FADD46089");

            entity.ToTable("punch_details");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CardNo)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("card_no");
            entity.Property(e => e.Dates)
                .HasColumnType("datetime")
                .HasColumnName("dates");
            entity.Property(e => e.Days)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("days");
            entity.Property(e => e.EmpCode)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("emp_code");
            entity.Property(e => e.EmpName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("emp_name");
            entity.Property(e => e.MachineNum).HasColumnName("machine_num");
            entity.Property(e => e.OtHrs).HasColumnName("ot_hrs");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.ShiftCode)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("shift_code");
            entity.Property(e => e.Status)
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.Times).HasColumnName("times");
        });

        modelBuilder.Entity<SalaryPeriod>(entity =>
        {
            entity.HasKey(e => new { e.FromDate, e.ToDate }).HasName("PK__salary_p__72A39BB58DB9AB84");

            entity.ToTable("salary_period");

            entity.Property(e => e.FromDate)
                .HasColumnType("datetime")
                .HasColumnName("from_date");
            entity.Property(e => e.ToDate)
                .HasColumnType("datetime")
                .HasColumnName("to_date");
            entity.Property(e => e.OtInclude)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("ot_include");
            entity.Property(e => e.PMonth)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("p_month");
            entity.Property(e => e.PYear).HasColumnName("p_year");
            entity.Property(e => e.PayDate)
                .HasColumnType("datetime")
                .HasColumnName("pay_date");
            entity.Property(e => e.PeriodCode)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("period_code");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.Selection)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("selection");
            entity.Property(e => e.TotalDays).HasColumnName("total_days");
        });

        modelBuilder.Entity<SalaryStructure>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__salary_s__3214EC07FE5A238D");

            entity.ToTable("salary_structure");

            entity.Property(e => e.EffectiveDate)
                .HasColumnType("datetime")
                .HasColumnName("Effective_date");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.Remarks)
                .HasMaxLength(30)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ShiftBalance>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__shift_ba__3214EC07DB1A80BB");

            entity.ToTable("shift_balance");

            entity.Property(e => e.BalanceDays).HasColumnName("balance_days");
            entity.Property(e => e.Monthyear)
                .HasMaxLength(8)
                .IsUnicode(false)
                .HasColumnName("monthyear");
            entity.Property(e => e.PatternCode)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("pattern_code");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.PnEmployeecode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("pn_employeecode");
            entity.Property(e => e.PnEmployeename)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("pn_employeename");
            entity.Property(e => e.Slot).HasColumnName("slot");

            entity.HasOne(d => d.ShiftPattern).WithMany(p => p.ShiftBalances)
                .HasForeignKey(d => new { d.PnCompanyid, d.PnBranchid, d.PatternCode })
                .HasConstraintName("fk_paym_Shift_Balance");
        });

        modelBuilder.Entity<ShiftDetail>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyid, e.PnBranchid, e.ShiftCode }).IsClustered(false);

            entity.ToTable("shift_details");

            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.ShiftCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("shift_code");
            entity.Property(e => e.BreakTimeIn)
                .HasColumnType("datetime")
                .HasColumnName("break_time_in");
            entity.Property(e => e.BreakTimeOut)
                .HasColumnType("datetime")
                .HasColumnName("break_time_out");
            entity.Property(e => e.EndTime)
                .HasColumnType("datetime")
                .HasColumnName("end_time");
            entity.Property(e => e.ShiftIndicator)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("shift_indicator");
            entity.Property(e => e.StartTime)
                .HasColumnType("datetime")
                .HasColumnName("start_time");
        });

        modelBuilder.Entity<ShiftMonth>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__shift_mo__3214EC0737D50719");

            entity.ToTable("shift_month");

            entity.Property(e => e.Date)
                .HasColumnType("datetime")
                .HasColumnName("date");
            entity.Property(e => e.Monthyear)
                .HasMaxLength(8)
                .IsUnicode(false)
                .HasColumnName("monthyear");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("pn_EmployeeCode");
            entity.Property(e => e.PnEmployeeName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("pn_EmployeeName");
            entity.Property(e => e.ShiftCode)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("shift_Code");
        });

        modelBuilder.Entity<ShiftPattern>(entity =>
        {
            entity.HasKey(e => new { e.PnCompanyid, e.PnBranchid, e.PatternCode }).HasName("pk_shift_pattern");

            entity.ToTable("shift_pattern");

            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PatternCode)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("pattern_code");
            entity.Property(e => e.Days1)
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasColumnName("days1");
            entity.Property(e => e.Days2)
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasColumnName("days2");
            entity.Property(e => e.Days3)
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasColumnName("days3");
            entity.Property(e => e.Days4).HasColumnName("days4");
            entity.Property(e => e.Days5).HasColumnName("days5");
            entity.Property(e => e.Days6).HasColumnName("days6");
            entity.Property(e => e.Days7).HasColumnName("days7");
            entity.Property(e => e.Days8).HasColumnName("days8");
            entity.Property(e => e.ShiftCode1)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("shift_code1");
            entity.Property(e => e.ShiftCode2)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("shift_code2");
            entity.Property(e => e.ShiftCode3)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("shift_code3");
            entity.Property(e => e.ShiftCode4)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("shift_code4");
            entity.Property(e => e.ShiftCode5)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("shift_code5");
            entity.Property(e => e.ShiftCode6)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("shift_code6");
            entity.Property(e => e.ShiftCode7)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("shift_code7");
            entity.Property(e => e.ShiftCode8)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("shift_code8");
        });

        modelBuilder.Entity<TempDeduction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__temp_ded__3214EC077840C8A1");

            entity.ToTable("temp_deductions");

            entity.Property(e => e.ActAmount).HasColumnName("Act_Amount");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.DFromDate)
                .HasColumnType("datetime")
                .HasColumnName("d_From_Date");
            entity.Property(e => e.DToDate)
                .HasColumnType("datetime")
                .HasColumnName("d_To_Date");
            entity.Property(e => e.Flag)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Mode)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnDeductionId).HasColumnName("pn_DeductionID");
            entity.Property(e => e.PnDepartmentName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("pn_DepartmentName");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.VDeductionname)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_deductionname");
        });

        modelBuilder.Entity<TempEarning>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__temp_ear__3214EC076976C659");

            entity.ToTable("temp_earnings");

            entity.Property(e => e.ActAmount).HasColumnName("Act_Amount");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.DFromDate)
                .HasColumnType("datetime")
                .HasColumnName("d_From_Date");
            entity.Property(e => e.DToDate)
                .HasColumnType("datetime")
                .HasColumnName("d_To_Date");
            entity.Property(e => e.Flag)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Mode)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnDepartmentName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("Pn_DepartmentName");
            entity.Property(e => e.PnEarningsId).HasColumnName("pn_EarningsID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.VEarningsname)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("v_earningsname");
        });

        modelBuilder.Entity<TempEmployeeId>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Temp_Emp__3214EC07008168C6");

            entity.ToTable("Temp_EmployeeID");

            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_date");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
        });

        modelBuilder.Entity<TempMuster>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Temp_Mus__3214EC079FDDDD06");

            entity.ToTable("Temp_Muster");

            entity.Property(e => e.EmpCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Emp_code");
            entity.Property(e => e.EmpName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Emp_name");
            entity.Property(e => e.FromDate)
                .HasColumnType("datetime")
                .HasColumnName("From_date");
            entity.Property(e => e.LeaveDays).HasColumnName("leaveDays");
            entity.Property(e => e.M1)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M10)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M11)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M12)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M13)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M14)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M15)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M16)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M17)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M18)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M19)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M2)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M20)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M21)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M22)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M23)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M24)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M25)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M26)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M27)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M28)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M29)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M3)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M30)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M31)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M4)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M5)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M6)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M7)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M8)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.M9)
                .HasMaxLength(2)
                .IsUnicode(false);
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnGradeId).HasColumnName("pn_GradeID");
            entity.Property(e => e.ToDate)
                .HasColumnType("datetime")
                .HasColumnName("To_Date");
        });

        modelBuilder.Entity<TempNetpay>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__temp_net__3214EC076CBE8450");

            entity.ToTable("temp_netpay");

            entity.Property(e => e.ActBasic).HasColumnName("Act_basic");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.DFromDate)
                .HasColumnType("datetime")
                .HasColumnName("d_From_Date");
            entity.Property(e => e.DToDate)
                .HasColumnType("datetime")
                .HasColumnName("d_To_Date");
            entity.Property(e => e.DedActAmount).HasColumnName("Ded_Act_Amount");
            entity.Property(e => e.DedAmount).HasColumnName("Ded_Amount");
            entity.Property(e => e.EarnActAmount).HasColumnName("Earn_Act_Amount");
            entity.Property(e => e.EarnAmount).HasColumnName("Earn_Amount");
            entity.Property(e => e.EarnedBasic).HasColumnName("Earned_basic");
            entity.Property(e => e.Epf).HasColumnName("EPF");
            entity.Property(e => e.Fpf).HasColumnName("FPF");
            entity.Property(e => e.GrossSalary).HasColumnName("Gross_salary");
            entity.Property(e => e.NetSalary).HasColumnName("Net_salary");
            entity.Property(e => e.OtAmt).HasColumnName("OT_amt");
            entity.Property(e => e.PeriodCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Period_code");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
        });

        modelBuilder.Entity<TempPayinput>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__temp_Pay__3214EC07BB90E82F");

            entity.ToTable("temp_Payinput");

            entity.Property(e => e.AbsentDays).HasColumnName("Absent_Days");
            entity.Property(e => e.ActBasic).HasColumnName("Act_Basic");
            entity.Property(e => e.AttBonus)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Att_Bonus");
            entity.Property(e => e.AttBonusAmount).HasColumnName("Att_BonusAmount");
            entity.Property(e => e.CalcDays).HasColumnName("Calc_Days");
            entity.Property(e => e.CompoffDays).HasColumnName("Compoff_Days");
            entity.Property(e => e.DDate)
                .HasColumnType("datetime")
                .HasColumnName("d_Date");
            entity.Property(e => e.DFromDate)
                .HasColumnType("datetime")
                .HasColumnName("d_From_Date");
            entity.Property(e => e.DToDate)
                .HasColumnType("datetime")
                .HasColumnName("d_To_Date");
            entity.Property(e => e.DedArrears).HasColumnName("Ded_Arrears");
            entity.Property(e => e.EarnArrears).HasColumnName("Earn_Arrears");
            entity.Property(e => e.EarnBasic).HasColumnName("Earn_Basic");
            entity.Property(e => e.Flag)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.MaxAmount).HasColumnName("max_amount");
            entity.Property(e => e.Mode)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.OnDutyDays).HasColumnName("OnDuty_days");
            entity.Property(e => e.OtAmt).HasColumnName("ot_Amt");
            entity.Property(e => e.OtHrs)
                .HasPrecision(3)
                .HasColumnName("OT_HRS");
            entity.Property(e => e.OtValue).HasColumnName("ot_value");
            entity.Property(e => e.PaidDays).HasColumnName("Paid_Days");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnEmployeeId).HasColumnName("pn_EmployeeID");
            entity.Property(e => e.PresentDays).HasColumnName("Present_Days");
            entity.Property(e => e.PtGross).HasColumnName("PT_Gross");
            entity.Property(e => e.TotLeaveDays).HasColumnName("TotLeave_Days");
            entity.Property(e => e.TourDays).HasColumnName("Tour_Days");
        });

        modelBuilder.Entity<TempTimecard>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__temp_tim__3214EC073EAF5DB2");

            entity.ToTable("temp_timecard");

            entity.Property(e => e.BranchCode)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.BreakIn).HasColumnName("break_in");
            entity.Property(e => e.BreakOut).HasColumnName("break_out");
            entity.Property(e => e.Dates)
                .HasColumnType("datetime")
                .HasColumnName("dates");
            entity.Property(e => e.Days)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("days");
            entity.Property(e => e.EarlyOut).HasColumnName("early_out");
            entity.Property(e => e.EmpCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("emp_code");
            entity.Property(e => e.EmpName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("emp_name");
            entity.Property(e => e.Intime).HasColumnName("intime");
            entity.Property(e => e.LateIn).HasColumnName("late_in");
            entity.Property(e => e.LateOut).HasColumnName("late_out");
            entity.Property(e => e.LeaveCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("leave_code");
            entity.Property(e => e.OtHrs)
                .HasColumnType("datetime")
                .HasColumnName("ot_hrs");
            entity.Property(e => e.Outtime).HasColumnName("outtime");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.ShiftCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("shift_code");
            entity.Property(e => e.Status)
                .HasMaxLength(2)
                .IsUnicode(false)
                .HasColumnName("status");
        });

        modelBuilder.Entity<Tempsattendance>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tempsatt__3214EC0711F4FC2E");

            entity.ToTable("tempsattendance");

            entity.Property(e => e.Dates)
                .HasColumnType("datetime")
                .HasColumnName("dates");
            entity.Property(e => e.Department)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Earlyout)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("earlyout");
            entity.Property(e => e.Intime)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("intime");
            entity.Property(e => e.Latein)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("latein");
            entity.Property(e => e.Lateout)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("lateout");
            entity.Property(e => e.LeaveName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Leave_name");
            entity.Property(e => e.Outtime)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("outtime");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.PnGradeId).HasColumnName("pn_gradeID");
            entity.Property(e => e.RegisterNo)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ShiftCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Shift_code");
            entity.Property(e => e.Status)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.StudentName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ToDate)
                .HasColumnType("datetime")
                .HasColumnName("To_Date");
            entity.Property(e => e.Whours)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("whours");
            entity.Property(e => e.WorkHrs)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("work_hrs");
        });

        modelBuilder.Entity<Tempshift>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tempshif__3214EC078F697CA7");

            entity.ToTable("tempshift");

            entity.Property(e => e.Dates)
                .HasColumnType("datetime")
                .HasColumnName("dates");
            entity.Property(e => e.Department)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Intime)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("intime");
            entity.Property(e => e.Latein)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("latein");
            entity.Property(e => e.Lateout)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("lateout");
            entity.Property(e => e.Outtime)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("outtime");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.RegisterNo)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("status");
            entity.Property(e => e.StudentName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Whours)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("whours");
        });

        modelBuilder.Entity<Tempshiftdetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tempshif__3214EC07CF02F516");

            entity.ToTable("tempshiftdetails");

            entity.Property(e => e.Dates)
                .HasColumnType("datetime")
                .HasColumnName("dates");
            entity.Property(e => e.Department)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Intime)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("intime");
            entity.Property(e => e.Latein)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("latein");
            entity.Property(e => e.Lateout)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("lateout");
            entity.Property(e => e.Outtime)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("outtime");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.RegisterNo)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.ShiftCode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("shift_code");
            entity.Property(e => e.StudentName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ToDate)
                .HasColumnType("datetime")
                .HasColumnName("To_Date");
            entity.Property(e => e.Whours)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("whours");
        });

        modelBuilder.Entity<TimeCard>(entity =>
        {
            entity.HasKey(e => e.Sno).HasName("PK__time_car__CA1FE46490B92598");

            entity.ToTable("time_card");

            entity.Property(e => e.BreakIn)
                .HasColumnType("datetime")
                .HasColumnName("break_in");
            entity.Property(e => e.BreakOut)
                .HasColumnType("datetime")
                .HasColumnName("break_out");
            entity.Property(e => e.Data)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("data");
            entity.Property(e => e.Dates)
                .HasColumnType("datetime")
                .HasColumnName("dates");
            entity.Property(e => e.Days)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("days");
            entity.Property(e => e.EarlyOut)
                .HasColumnType("datetime")
                .HasColumnName("early_out");
            entity.Property(e => e.EmpCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("emp_code");
            entity.Property(e => e.EmpName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("emp_name");
            entity.Property(e => e.Flag)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("flag");
            entity.Property(e => e.Intime)
                .HasColumnType("datetime")
                .HasColumnName("intime");
            entity.Property(e => e.LateIn)
                .HasColumnType("datetime")
                .HasColumnName("Late_in");
            entity.Property(e => e.LateOut)
                .HasColumnType("datetime")
                .HasColumnName("Late_out");
            entity.Property(e => e.LeaveCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("leave_code");
            entity.Property(e => e.OtHrs)
                .HasColumnType("datetime")
                .HasColumnName("ot_hrs");
            entity.Property(e => e.Outtime)
                .HasColumnType("datetime")
                .HasColumnName("outtime");
            entity.Property(e => e.PnBranchid).HasColumnName("pn_branchid");
            entity.Property(e => e.PnCompanyid).HasColumnName("pn_companyid");
            entity.Property(e => e.PnEmployeeId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("pn_EmployeeID");
            entity.Property(e => e.ShiftCode)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("shift_code");
            entity.Property(e => e.Status)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("status");
        });

        modelBuilder.Entity<Yearend>(entity =>
        {
            entity.HasKey(e => e.StartDate);

            entity.ToTable("Yearend");

            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_BranchID");
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.ProcessDate).HasColumnType("datetime");
        });
        modelBuilder.Entity<PfSettings>(entity =>
        {
            // Match the exact SQL Column Names from your table design
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_CompanyID");
            entity.Property(e => e.EffectiveMonthFrom).HasColumnName("Effective_Month_From");
            entity.Property(e => e.EffectiveFromYear).HasColumnName("Effective_From_Year");
            entity.Property(e => e.MaxCeiling).HasColumnName("Max_Ceiling");
            entity.Property(e => e.UpperLimit).HasColumnName("Upper_Limit").HasPrecision(18, 2);
            entity.Property(e => e.EligibilityAmount).HasColumnName("Eligibility_Amount").HasPrecision(18, 2);
            entity.Property(e => e.RoundingOptions).HasColumnName("Rounding_Options");

            // CRITICAL: Match the exact names from your screenshot for float columns
            // Do NOT use HasPrecision here; float/double handles its own precision.
            entity.Property(e => e.PfContributionPercentage).HasColumnName("PF_Contribution(%)");
            entity.Property(e => e.EpfContributionPercentage).HasColumnName("EPF_Contribution(%)");
            entity.Property(e => e.EpsContributionPercentage).HasColumnName("EPS_Contribution(%)");
            entity.Property(e => e.AdminChargesPercentage).HasColumnName("Admin_Charges(%)");
        });
        modelBuilder.Entity<GradeSlabBranch>(entity =>
        {
            // 1. Point to the correct table
            entity.ToTable("GradeSlab_Branch");

            // 2. Primary Key
            entity.HasKey(e => e.PnGradeSlabID);
            entity.Property(e => e.PnGradeSlabID).HasColumnName("pn_GradeSlabID");

            // 3. Foreign Keys/Standard Columns
            entity.Property(e => e.PnCompanyId).HasColumnName("pn_companyid");
            entity.Property(e => e.PnBranchId).HasColumnName("pn_branchid");
            entity.Property(e => e.SlabType).HasColumnName("Slab_Type");
            entity.Property(e => e.GradeName).HasColumnName("Grade_Name");
            entity.Property(e => e.LevelName).HasColumnName("Level_Name");
            entity.Property(e => e.ExperienceFrom).HasColumnName("Experience_From");
            entity.Property(e => e.ExperienceTo).HasColumnName("Experience_To");
            entity.Property(e => e.CTC).HasColumnName("CTC").HasPrecision(18, 2);
            entity.Property(e => e.Valuetype).HasColumnName("Value_type");

            // 4. The "Bucket" Columns (Value1 to Value10)
            // We map these to nullable decimals to handle cases where they might be empty in the DB
            entity.Property(e => e.Value1).HasColumnName("value1").HasPrecision(18, 2);
            entity.Property(e => e.Value2).HasColumnName("value2").HasPrecision(18, 2);
            entity.Property(e => e.Value3).HasColumnName("value3").HasPrecision(18, 2);
            entity.Property(e => e.Value4).HasColumnName("value4").HasPrecision(18, 2);
            entity.Property(e => e.Value5).HasColumnName("value5").HasPrecision(18, 2);
            entity.Property(e => e.Value6).HasColumnName("value6").HasPrecision(18, 2);
            entity.Property(e => e.Value7).HasColumnName("value7").HasPrecision(18, 2);
            entity.Property(e => e.Value8).HasColumnName("value8").HasPrecision(18, 2);
            entity.Property(e => e.Value9).HasColumnName("value9").HasPrecision(18, 2);
            entity.Property(e => e.Value10).HasColumnName("value10").HasPrecision(18, 2);
        });
        modelBuilder.Entity<GradeSlabDivision>(entity =>
        {
            entity.ToTable("GradeSlab_Division");
            entity.HasKey(e => e.GradeSlabID);

            // Map Financials to Precision
            entity.Property(e => e.CTC).HasPrecision(18, 2);
            entity.Property(e => e.Value1).HasPrecision(18, 2);
            entity.Property(e => e.Value2).HasPrecision(18, 2);
            entity.Property(e => e.Value3).HasPrecision(18, 2);
            entity.Property(e => e.Value4).HasPrecision(18, 2);
        });
        modelBuilder.Entity<CTCSlab>(entity =>
        {
            entity.ToTable("CTCSlab");
            entity.HasKey(e => e.CTCSlabID);

            // Explicit column mappings
            entity.Property(e => e.CTCSlabID).HasColumnName("CTCSlabID");
            entity.Property(e => e.MinCTC).HasColumnName("MinCTC").HasPrecision(18, 2);
            entity.Property(e => e.MaxCTC).HasColumnName("MaxCTC").HasPrecision(18, 2);
            entity.Property(e => e.MaxLoanAmount).HasColumnName("MaxLoanAmount").HasPrecision(18, 2);
            entity.Property(e => e.InterestRate).HasColumnName("InterestRate").HasPrecision(5, 2);
            entity.Property(e => e.PnCompanyID).HasColumnName("pn_CompanyID");
            entity.Property(e => e.PnBranchID).HasColumnName("pn_BranchID");
            entity.Property(e => e.LoanType).HasColumnName("LoanType");
            entity.Property(e => e.LoanID).HasColumnName("LoanID");
        });
        modelBuilder.Entity<PaymLoanTypeMaster>(entity =>
        {
            entity.ToTable("paym_LoanTypeMaster");

            entity.HasKey(e => e.PnLoanTypeId)
                  .HasName("pk_m_loantypemaster");

            entity.Property(e => e.PnLoanTypeId)
                  .HasColumnName("pn_LoanTypeID")
                  .ValueGeneratedOnAdd();

            entity.Property(e => e.VLoanTypeName)
                  .HasColumnName("v_LoanTypeName")
                  .HasMaxLength(100)
                  .IsRequired();

            entity.Property(e => e.PnCompanyID)
                  .HasColumnName("pn_CompanyID");

            entity.Property(e => e.Status)
                  .HasColumnName("status")
                  .HasMaxLength(20);
        });
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
