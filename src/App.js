// import logo from "./logo.svg";
import "./App.css";

// import MainPage from "./components/nav";
// import ServiceCard from './components/servicecard';
import Login from "./components/Authentication/Login";
import { useState } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
// import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
// import LoginOthers from "./components/Authentication/LoginOthers";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
// import ServiceCard from "./components/servicecard";
// import Layoutcomp from "./components/layoutcomp";
// import DailyTimeCardForm from "./components/DailyTimeCard/DailyTimeCardForm";
// import DailyTimeCardTables from "./components/DailyTimeCard/DailyTimeCardTables";
// import AttendenceForm from "./components/AttendeceCeiling/attendenceform";
// import AttendenceTable from "./components/AttendeceCeiling/AttendenceTable";
import AssetsTable from "./components/Assets/AssetsTable";
// import SampleForm from "./components/Assets/sampleform";
import EarnDeductTable from "./components/Earn Deduct/EarnDeductTable";
// import EarnDeductForm from "./components/Earn Deduct/EarnDeductForm";
// import Form7table from "./components/Form7/Form7table";
// import SampleForm7 from "./components/Form7/form7form";
// import HrAuthForm from "./components/hrauthentication/HrAuthenticationForm";
// import HrAuthenticationTable from "./components/hrauthentication/HrAuthenticationTable";
// import Hrmcoursetable from "./components/hrmcourse/hrmcoursetable";
// import CourseForm from "./components/hrmcourse/HrmmCourseForm";
// import Hrmskillmastertable from "./components/hrmskillmaster/Hrmskillmastertable";
// import SkillsMasterForm from "./components/hrmskillmaster/HrmmSkillsMasterForm";
// import HrmmSpecializationtable from "./components/hrmSpecilization/HrmmSpecializationtable";
// import SpecializationForm from "./components/hrmSpecilization/HrmmSpecializationForm";
// import PaymJobStatusTable from "./components/JobStatus/paymJobStatusTables";
// import JobStatusForm from "./components/JobStatus/paymJobStatusForm";
// import LeaveAllocationMasterTable from "./components/LeaveAllocationMaster/LeaveAllocationMasterTable";
// import LeaveAllocationForm from "./components/LeaveAllocationMaster/LeaveAllocationMasterForm";
// import LeaveApplyTable from "./components/LeaveApply/LeaveApplyTable";
// import LeaveAppForm from "./components/LeaveApply/LeaveApplyForm";
// import ApprovehrForm from "./components/LeaveApproveHr/LeaveApproveHrForm";
// import LeaveApproveHrTable from "./components/LeaveApproveHr/LeaveApproveHrTable";
// import ApproveManagerForm from "./components/LeaveApproveManager/LeaveApproveManagerForm";
// import LeaveApproveManagerTable from "./components/LeaveApproveManager/LeaveApproveManagerTable";
// import LeaveSettleForm from "./components/LeaveSettlement/LeaveSettlementForm";
// import LeaveSettlementTable from "./components/LeaveSettlement/LeaveSettlementTable";
// import LoanEntForm from "./components/LoanEntry/LoanEntryForm";
// import LoanEntryTable from "./components/LoanEntry/LoanEntryTable";
// import LoanPostForm from "./components/LoanPost/LoanPostForm";
// import LoanPostTable from "./components/LoanPost/LoanPostTable";
// import LoanPreclosForm from "./components/LoanPreCloser/LoanPreclosureForm";
// import LoanPreCloserTable from "./components/LoanPreCloser/LoanPreCloserTable";
// import OndutyForm from "./components/OnDuty/ondutyForm";
// import OnDutyTable from "./components/OnDuty/OnDutyTable";
// import OTSlabForm from "./components/OtsLabs/OTSLabForm";
// import OtsLabTable from "./components/OtsLabs/OtsLabTable";
// import PayInputTable from "./components/payinputs/payInputTable";
// import PayinputForm from "./components/payinputs/PayInputForm";
// import PaymAttBonusTable from "./components/PaymAttBonus/PaymAttBonusTable";
// import PaymattbonusForm from "./components/PaymAttBonus/PaymAttBonusForm";
// import PaymBankTable from "./components/PaymBank/paymbankTables";
// import PaybankForm from "./components/PaymBank/paymbankForm";
// import PayBranchForm from "./components/PaymBranch/PaymBranchForm";
// import PaymcarryForwardTable from "./components/paymcarryForward/PaymcarryForwardTable";
// import PaymCarrForwardForm from "./components/paymcarryForward/paymCarryForwardForm";
// import Paymcategoryform from "./components/PaymCategory/PaymCategoryForm";
// import PaymCategoryTable from "./components/PaymCategory/PaymCategoryTable";
// import PaycompanyTable from "./components/paymCompany/PaycompanyTable";
// import CompanyForm from "./components/paymCompany/paymCompanyForm";
// import ComputationForm from "./components/PaymComputation/paymComputationForm";
// import PaymComputationtables from "./components/PaymComputation/PaymComputationtables";
// import PaymDeductionTable from "./components/PaymDeduction/paymDeductionTable";
// import DeductionForm from "./components/PaymDeduction/paymDeductionForm";
// import PaymDesignationTable from "./components/paymDesignation/PaymDesignationTable";
// import DesignationForm from "./components/paymDesignation/PaymDesignationForm";
// import PaymDIvisionTable from "./components/paymDivision/PaymDivisionTable";
// import DivisionForm from "./components/paymDivision/paymDivisionForm";
// import PaymEarningsTable from "./components/PaymEarnings/PaymEarningTable";
// import EarningsForm from "./components/PaymEarnings/paymEarningsForm";
// import PaymEmpDeductionTable from "./components/PaymEmpDeduction/PaymEmpDeductionTable";
// import EmpDeductionForm from "./components/PaymEmpDeduction/paymEmpDeductionForm";
// import PaymEmployeeLeaveTable from "./components/PaymEmpEarning/PaymEmpEarningTable";
// import EmpEarningsForm from "./components/PaymEmpEarning/paymEmpEarningsForm";
import PaymEmpTable from "./components/paymEmployee/PaymEmpTable";
// import EmployeeForm from "./components/paymEmployee/paymEmployeeForm";
import PaymEmployeeForm from "./components/paymEmployee/paymEmployeeForm";
// import EmployeeLeaveForm from "./components/PaymEmployeeLeave/paymEmployeeLeaveForm";
// import PaymEmployeeProfile1Tables from "./components/paymEmployeeProfile/paymEmployeeProfileTables";
// import EmployeeProfile1Form from "./components/paymEmployeeProfile/paymEmployeeProfile1Form";
// import PaymEmployeeWorkDetailTables from "./components/PaymEmployeeWorkDetails/paymEmployeeWorkDetailsTable";
// import EmployeeWorkDetailsForm from "./components/PaymEmployeeWorkDetails/paymEmployeeWorkDetailsForm";
// import PaymEncashmentDetailsTables from "./components/PaymEncashmentDetails/paymEncashmentDetailsTable";
// import EncashmentDetailsForm from "./components/PaymEncashmentDetails/paymEncashmentDetailsForm";
// import PaymgradeTables from "./components/PaymGrade/PaymGradeTables";
// import GradeForm from "./components/PaymGrade/paymGradeForm";
// import PaymHolidayTables from "./components/PaymHolidays/PaymHolidaysTables";
// import HolidayForm from "./components/PaymHolidays/paymHolidaysForm";
// import PaymleaveTables from "./components/PaymLeave/paymleaveTable";
// import LeaveForm from "./components/PaymLeave/paymleaveForm";
// import Paymleaveallocation1Tables from "./components/PaymLeaveAllocation1/paymLeaveAllocation1table";
// import LeaveAllocation1Form from "./components/PaymLeaveAllocation1/paymleaveAllocation1Form";
// import PaymlevelTables from "./components/PaymLevel/paymLevelTables";
// import LevelForm from "./components/PaymLevel/paymLevelForm";
// import PaymLoanTable from "./components/PaymLoan/PaymLoanTable";
// import Sample28 from "./components/PaymLoan/PayLoanForm";
// import PayLoanForm from "./components/PaymLoan/PayLoanForm";
// import PaymLoanDiminishingTable from "./components/PaymloanDiminshing/paymloandiminshingTable";
// import Sample27 from "./components/PaymloanDiminshing/paymloandiminishingForm";
// import Sample26 from "./components/PaymOverHeadingCost/paymoverheadingCostForm";
// import PaymOverHeadingcostTable from "./components/PaymOverHeadingCost/paymoverheadingcostTable";
// import PaympfTable from "./components/PaymPaybill/paympaybillTables";
// import Sample25 from "./components/PaymPaybill/paympaybillForm";
// import PaymPaybillTable from "./components/PaymPf/paympfTable";
// import Sample24 from "./components/PaymPf/paymPfForm";
// import PaymshiftTable from "./components/PaymShift/paymshiftTable";
// import Sample23 from "./components/PaymShift/paymshiftform";
// import PaympayoutputloanTable from "./components/PayoutputLoan/payoutputloanTable";
// import Sample22 from "./components/PayoutputLoan/payoutputloanForm";
// import PayrollFinalSettlemetTable from "./components/Payrollfinalsettlement/payrollfinalsettlementTables";
// import Sample21 from "./components/Payrollfinalsettlement/payrollfinalsettlementForm";
// import PfepTable from "./components/PfEp/pfepTable";
// import Sample20 from "./components/PfEp/pfepform";
// import PfepfTable from "./components/PfEPF/pfepfTable";
// import Sample19 from "./components/PfEPF/pfEpfForm";
// import PunchdetailsTable from "./components/PunchDetails/punchdetailsTables";
// import Sample18 from "./components/PunchDetails/punchdetailform";
// import SalaryPeriodTable from "./components/SalaryPeriod/salaryperiodTable";
// import Sample17 from "./components/SalaryPeriod/salaryperiodform";
// import Sample16 from "./components/SalaryStructure/salarystructureform";
// import SalaryStructureTable from "./components/SalaryStructure/salarystructureTable";
// import ShiftBalanceTable from "./components/ShiftBalance/shiftbalanceTable";
// import Sample15 from "./components/ShiftBalance/shiftbalanceform";
// import ShiftDetailsTable from "./components/ShiftDetails/shiftdetailsTables";
// import DetailsForm from "./components/ShiftDetails/shiftdetailform";
// import ShiftMonthTable from "./components/ShiftMonth/shiftmonthTable";
// import Sample13 from "./components/ShiftMonth/shiftmonthform";
// import ShiftPatternTable from "./components/ShiftPattern/shiftpatternTable";
// import Sample12 from "./components/ShiftPattern/shiftpatternform";
// import TempshiftdetailsTables from "./components/TempShiftDetails/tempshiftdetailsTable";
// import YearEndTable from "./components/Yearend/yearendTable";
// import Sample1 from "./components/Yearend/yearendform";
// import TempShiftDetailsForm from "./components/TempShiftDetails/tempshiftdetailsForm";
// import PaymEmployeeEarningsTable from "./components/PaymEmpEarning/PaymEmpEarningTable";
// import PaymEmployeeLeaveForm from "./components/PaymEmployeeLeave/paymEmployeeLeaveForm";
// import PaymEmpLeaveTable from "./components/PaymEmployeeLeave/PaymEmployeeLeaveTable";
// import PaymEmpLeaveForm from "./components/PaymEmployeeLeave/paymEmployeeLeaveForm";
// import PaymEmpEarningsTable from "./components/PaymEmpEarning/PaymEmpEarningTable";
// import PaymEmpEarningsForm from "./components/PaymEmpEarning/paymEmpEarningsForm";
// import PaymEarnTable from "./components/PaymEarnings/PaymEarningTable";
// import PaymEarnForm from "./components/PaymEarnings/paymEarningsForm";
// import LoginForm from "./components/Authentication/Login";
import Paycalc from "./components/payslips/Payslips";
// import TimesheetManage from "./components/Timesheet/TimeSheetManger";
// import TimesheetManager from "./components/Timesheet/TimeSheetManger";
// import PaymDepartmentTable from "./components/paymDepartment/paymDepartmentTable";
// import DepartmentForm from "./components/paymDepartment/paymDepartmentForm";
// import PaymBranchtable from "./components/PaymBranch/PaymBranchtablenew";
// import Mrgabs from "./components/ReportFormates/AttendanceD2";
// import ButtonEsi from "./components/ReportFormates/AttendanceD2Button";
// import ButtonEsi2 from "./components/ReportFormates/OTHoursReportsButtonPrint";
// import ButtonEsi3 from "./components/ReportFormates/OTSummaryButton";
// import ButtonEsi4 from "./components/ReportFormates/WorkDetailsButtonPrint";
// import ButtonEsi5 from "./components/ReportFormates/AttedanceDetailsButton";
// import ButtonEsi6 from "./components/ReportFormates/AbsentDetailsButton";
// import ButtonEsi7 from "./components/ReportFormates/AdvanceReportButton";
// import ButtonEsi8 from "./components/ReportFormates/TAandDButton";
// import MasterrollButton from "./components/ReportFormates/masterrollButton";
// import LeaveApprovenew from "./components/LeaveApply/LeaveApplyNew";
// import Leaveapprovenew from "./components/LeaveApply/LeaveApplyNew";
// import { createStore } from "redux";
// import { Provider } from "react-redux";
// import entityReducer from "./reduxcomp/actions/reducer/entityreducer";
// import AttendanceNew from "./components/Attendance/Attendance";
// import OtHrsNewForm from "./components/OtHrsNew/OtHrsNewForm";
import LoginOthers from "./components/Authentication/LoginOthers";
// import DashBoard from "./components/dashboredsss/DashBoard";
// import BasicDateCalendar from "./components/Nattendance/Nattendance";
import GroupUi from "./components/Group UI/GroupUi";
// import Chatbot from "./components/Chatbot/chatbot";
import AddInfos from "./components/Group UI/AddInfos";
// import PaympaybillTable from "./components/PaymPaybill/paympaybillTables";
// import PaymPaypfTable from "./components/PaymPf/paympfTable";
import GroupShift from "./components/Group UI/GroupShift";
// import Medical from "./components/Medical/Medical";
// import MedicalSlipGenerator from "./components/Medical/MedicalSlipGenerator";
// import MedicalSlipView from "./components/Medical/MedicalSlipView";
// import ViewMedical from "./components/Medical/ViewMedical";
// import EarlyAndLate from "./components/Early and Late entries/Earlyandlateentriesform";
// import Mastterrol from "./components/masterrols/Masterrols";
// import Setup from "./components/masterrols/setup";
// import Setup2 from "./components/masterrols/Setup2";
// import Shiftpattern from "./components/masterrols/shiftpattern";
// import Shiftpattern007 from "./components/masterrols/shiftpattern";
// import Shiftdetails007 from "./components/masterrols/shiftpattern";
// import Shiftpatterns0009 from "./components/masterrols/emshiftpatern";
// import LeaveSetup from "./components/masterrols/leavesetup";
// import Leavesettlement from "./components/masterrols/Leavesettlement";
import HomePage from "./components/Home Page/HomePage";
import MastersTemplate from "./components/Masters/MastersTemplate";
// import CompanyForm01 from "./components/Masters/CompanyMasters"
import PayBranchForm01 from "./components/Masters/BranchMaster";
import PaymEmployeeMasters from "./components/Masters/EmployeeMasters";
// import DepartmentMasters from "./components/paymDepartment/paymDepartmentForm";
import DesignationMasters from "./components/Masters/DesignationMasters";
import ShiftMasters from "./components/Masters/ShiftMasters";
// import EarnDeductMasters from "./components/Masters/EarnDeductMasters";
import SlabTemplate from "./components/SlabsTemplate/SlabTemplate";
import Departmensmasters from "./components/Masters/DepartmentMasters";
import LeaveApplyRequestHigher from "./components/Home Page/LeaveRequestshigher";
import LeaveRequestManager from "./components/Home Page/LeaveRequestManager";
import LeaveRequestEmployee from "./components/Home Page/LeaveRequestEmployee";
import CompanyMasters from "./components/Masters/CompanyMasters";
import AttendanceHome from "./components/Home Page/Attendance";
import SalaryPeriod from "./component/Masters-company/SalaryPeriod/SalaryPeriod";

import "bootstrap/dist/css/bootstrap.min.css";

// import ResponsiveTable from "./components/Responsive-Tables/ResponsiveTable";

// import SpreadGrid1 from "./components/SpreadGrid";
// import MySpreadGrid from "./";
import SlabTemplateEmp from "./components/SlabsTemplate/SlabTemplateEmp";
// import RTN from "./components/Responsive-Tables/ResponsiveTableNew";
// import ResTable from "./components/Responsive-Tables/ResponsiveTableNew";
// import Example from "./components/Responsive-Tables/ResponsiveTableNew";
// import DataGridComponent from "./components/Responsive-Tables/ResponsiveTableNew";
// import DataGridComp from "./components/Responsive-Tables/ResponsiveTableNew";
// import BasicEditingGrid from "./components/Responsive-Tables/ResponsiveTableNew";
// import OverTime from "./components/Responsive-Tables/ResponsiveTableNew";
import PtGrid from "./components/Responsive-Tables/Responsive-Tables/Proftaxgrid";
import AttendanceBonusSetup from "./components/Responsive-Tables/Responsive-Tables/AttendanceBonus";
import OverTime from "./components/Responsive-Tables/Responsive-Tables/ResponsiveTable";
import Empcalendar from "./components/Masters/EmpCalendar";
import GraphCheckBox1 from "./components/Home Page/dashboard/Checkbox";
// import Dashboard from "./components/Home Page/dashboard/DBoard";
import DBoards from "./components/Home Page/dashboard/DBoard";
// import EmployeeHome220 from "./components/Masters/EmployeeCree/EmployeeMater";
import PaymEmployeeForm0045 from "./components/Masters/EmployeeCree/Employeeprofile";
// import PaymEmployeeFormCs from "./components/Masters/EmployeeCree/Employeeprofile";
import HolidaysPage from "./components/Masters/HolidayHr/Holiday";
import HolidayForm1 from "./components/Masters/HolidayHr/HolidayHr";
import EmployeeHome from "./components/Masters/EmployeeCree/EmployeeMater";
// import PaymEmployeeFormCss from "./components/Masters/EmployeeCree/Employeeprofile";
import PaymEmployeeFormm from "./components/Masters/EmployeeCree/Employeeprofile";
import Attendance01 from "./components/Masters/Attendance/Attendance1";
import LeaveRequestHr from "./components/Masters/LeaveApprove/Leaveapprove";
// import ReimbursementApprovalForm from "./components/Masters/Reimbursment/Reimbursement";
import EmployeeReimbursement from "./components/Masters/Reimbursment/Reimbursement";
// import EarnDeductMasterss from "./components/Masters/EarnDeduct/EarnDeduct";
// import Sandy from "./components/Masters/EmployeeCree/EmployeePrfile1Org";
import EarnDeductValueMasters from "./components/Masters/EarnDeduct/EarnductValues";
import EarnDeductMastersss from "./components/Masters/EarnDeduct/EarnDeduct";
// import Employeeprofile0909 from "./components/Masters/EmployeeCree/EmployeePrfile1Org";
import Editprofile from "./components/Masters/EmployeeCree/Viewprofile";
import EditEmployee from "./components/Masters/EmployeeCree/EditProfile1";
import DesignationMaster from "./components/Masters/Designation/Designation";
import DepartmentMaster from "./components/Masters/Department/Department";
import DepartmentHome from "./components/Masters/Department/DepartmentMaster";
import DesignationHome from "./components/Masters/Designation/Designationmaster";
import SlideAnimationComponent from "./components/timecard";
import HomePage1 from "./component/Home Page-comapny/HomePage1";
import CompanyMasterss1 from "./component/Masters-company/CompanyMasters1";
import CompanyMasterss1copy from "./component/Masters-company/CompanyMasters1 copy.js";
import DivisionMaster1 from "./component/Masters-company/Division";
import DivisionMaster1copy from "./component/Masters-company/Division copy.js";
import CategoryFormMaster1 from "./component/Masters-company/CategoryMater1";
import CategoryFormMaster1copy from "./component/Masters-company/CategoryMater1 copy";
import DepartmentFormMaster1 from "./component/Masters-company/DepartmentMasters1";
import DepartmentFormMaster1copy from "./component/Masters-company/DepartmentMasters1copy";
import DesignationMasterForm1 from "./component/Masters-company/DesignationMasters1";
import DesignationMasterForm1copy from "./component/Masters-company/DesignationMasters1 copy";
import GradeForm1 from "./component/Masters-company/Grade1";
import GradeForm1copy from "./component/Masters-company/Grade1copy";
// import ShiftFormMaster1 from "./component/Masters-company/ShiftDetailsMaster1";
import JobStatusFormMaster1 from "./component/Masters-company/Jobstatus1";
import JobStatusFormMaster1copy from "./component/Masters-company/Jobstatus1 copy";
import LevelFormMaster1 from "./component/Masters-company/LevelMaster1";
import LevelFormMaster1copy from "./component/Masters-company/LevelMaster1 copy";
import PaymLeaveMaster1 from "./component/Masters-company/PaymLeaveMaster1";
import PaymLeaveMaster1copy from "./component/Masters-company/PaymLeaveMaster1 copy";
import HomePage2 from "./Component1/Home Page3/HomePage2";
// import HolidaysPage2 from "./Component1/Masters/Leaveapply/Holiday2";
import LeaveapplyHr2 from "./Component1/Masters/Leaveapply/Leaveapply2";
import LeaveRequestTable2 from "./Component1/Masters/Leaveapply/LeaveApplyHistory2";
import LeaveBalances2 from "./Component1/Masters/Leaveapply/LeaveBalance2";
import LeaveCalendar2 from "./Component1/Masters/LeaveCalender2";
import ReimbursementForm2 from "./Component1/Masters/Reimbursement2";
import EmployeeDashBoard2 from "./Component1/Nattendance Epm/EmployeeDashBoard2";
import BasicDateCalendar2 from "./Component1/Nattendance Epm/Nattendance2";
import OldPayslip from "./Component1/Masters/PayslipNew format/Oldpayslip";
import OldPayslipGenerator from "./Component1/Masters/PayslipNew format/OldPayslipGenerator";
import Payslipelegant from "./Component1/Masters/PayslipNew format/Payslipelegant";
import PayslipGenerator from "./Component1/Masters/PayslipNew format/payslipgenerator";
import Payslipmonthly from "./Component1/Masters/PayslipNew format/Payslipmonthly";
import PayslipNewFormat from "./Component1/Masters/PayslipNew format/PayslipNewFormat";
import PaySlipTemplate from "./Component1/Masters/PayslipNew format/paysliptemplate";
import PaySlipFormTemplate from "./Component1/Masters/PayslipNew format/paysliptemplateform";
import PrintPayslip from "./Component1/Masters/PayslipNew format/PrintPayslip";
import HolidaysempPage2 from "./Component1/Masters/Holidayemp/Holidayemp2";
// import { LightThemeConfig } from "./component/Home Page-comapny/Theme";
// import { CssBaseline } from '@mui/material';
// import { ThemeProvider } from '@mui/material/styles';
import Grade_Slab from "./component/Masters-company/SlabGrade";
import GradeSlabcopy from "./component/Masters-company/SlabGrade copy";
import EarnDeductCompanyMasters from "./component/Masters-company/EarnDeductMaster";
// import YesNoButtons from "./components/Tmpemployeidform";
import BranchMaster1 from "./component/Masters-company/BranchMaster1.js";
import {BranchMaster1copy} from "./component/Masters-company/BranchMaster1copy.js";
import BranchMasters2 from "./component/Masters-company/BranchMaster2";
import EditEmployeeh1 from "./component/Masters-company/EmployeeCree/EditProfile1";
import Editprofileh1 from "./component/Masters-company/EmployeeCree/Viewprofile";
import EmployeeHomeH1 from "./component/Masters-company/EmployeeCree/EmployeeMater";
import PaymEmployeeFormmh1 from "./component/Masters-company/EmployeeCree/Employeeprofile";
// import Employeeprofile0909h1 from "./component/Masters-company/EmployeeCree/EmployeePrfile1Org";
import YesNoSwitch from "./components/Tmpemployeidform";
import LoanMaster from "./component/Masters-company/LoanModule/LoanMaster";
import LoanEntry from "./component/Masters-company/LoanModule/LoanEntry";
import CTCSlabTable from "./component/Masters-company/LoanModule/LoanSlab";
import CTCSlabTablecopy from "./component/Masters-company/LoanModule/LoanSlab copy";
// import Masterroll from "./components/ReportFormates/masteerrol";
import LoanApproval from "./component/Masters-company/LoanModule/Loanapprove";
import PFvalues from "./component/Masters-company/PayslipModule/PFmodule/PFModule";
import AllowanceMaster from "./component/Masters-company/PayslipModule/AllowanceModule/AllowanceMaster";
import AllowanceValues from "./component/Masters-company/PayslipModule/AllowanceModule/AllowanceValues";
import DeductionMaster from "./component/Masters-company/PayslipModule/DeductionModule.js/DeductionMaster";
import AllowanceSettings from "./component/Masters-company/PayslipModule/AllowanceModule/AllowanceSettings";
import AllowanceMasterBranch from "./components/Masters/PayslipModule/AllowanceModule/AllowanceMaster";
import AllowanceValuesBranch from "./components/Masters/PayslipModule/AllowanceModule/AllowanceValues";
import AllowanceSettingsBranch from "./components/Masters/PayslipModule/AllowanceModule/AllowanceSettings";
import ESIsettings from "./component/Masters-company/PayslipModule/DeductionModule.js/EsiSettings";
import PayslipReport from "./component/Masters-company/PayslipModule/AllowanceReports/AllowanceReports";
import ReportPage from "./component/Masters-company/PayslipModule/AllowanceReports/ReportPrintpage";
import Deductionmasterbranch from "./components/Masters/PayslipModule/DeductionModule/DeductionMasterBranch";
import AnimatedGallery from "./components/Masters/PayslipModule/DeductionModule/Framemotionanimation";
import Cutofdate from "./component/Masters-company/PayslipModule/AllowanceModule/Cutofdate";
import Payslipprocess from "./components/Masters/PayslipModule/Payslipprocess/Payslipprocess";
import PayRegister from "./component/PayRegister";
import Consolidation from "./component/Consolidation";
import Confetti from "./components/Masters/PayslipModule/Confetti";
import Permission from "./components/Permission";
import PayslipDashboard from "./components/Masters/PayslipModule/PayslipDashboard";
import LeaveSandwiching from "./component/Masters-company/LeaveModule/LeaveSandwiching";
import LateProvision from "./component/Masters-company/LateModule/LateModule";
import Demo from "./component/Masters-company/Demo/Demo";
import PFReport from "./component/Masters-company/PF Reports/PFReport";
import ShiftPattern from "./components/Masters/ShiftPattern/shiftpattern";
// import ShiftDetai from "./components/Masters/ShiftPattern/shiftDetails";
import ShiftDetails from "./components/Masters/ShiftPattern/shiftDetails";
import EmployeeShiftAllocation from "./components/Masters/ShiftPattern/ShiftAllocations";
import TimeCardSetup from "./components/Masters/ShiftPattern/Timecardsetup";
import ManualAttendance from "./components/Masters/ShiftPattern/ManualAttendance";
import RegisterPage from "./components/Authentication/Signup";
// import { ToastContainer } from "react-toastify";
// import { LOGIN } from "./serverconfiguration/controllers";
import EmployeeBulkExcelSheetUpload from "./components/Masters/ShiftPattern/Execel";
import EmployeeBulkExcelSheetUploadcopy from "./components/Masters/ShiftPattern/Execel copy";
import AssetGridForm from "./component/Masters-company/PayslipModule/AllowanceModule/Asset";
import AssetGridFormcopy from "./component/Masters-company/PayslipModule/AllowanceModule/Asset copy";
import ReaderAttendance from "./components/Masters/reader/Reader attendance";
import ReaderMaster from "./components/Masters/reader/Reader master";
import Payslip from "./components/Masters/Reimbursment/payslip";
// import Masters from "./components/Masters/Masters";
import Masters1 from "./components/Masters/Masters";
import Divisions from "./Component1/Masters/divisions";
import Departments from "./Component1/Masters/Departments";
import Designations from "./Component1/Masters/Designations";
import Grades from "./Component1/Masters/Grades";
import Categorys from "./Component1/Masters/Categorys";
import JobStatus from "./Component1/Masters/Jods status";
import Levels from "./Component1/Masters/levels";
import Leaves from "./Component1/Masters/Leaves.js";
import Assets from "./Component1/Masters/Assets.js";


function App(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    // Check if the user is already logged in
    const loggedIn = sessionStorage.getItem("user") !== null;
    setIsLoggedIn(loggedIn);
    setLogin(loggedIn);
  }, []);

  function changeState(state) {
    setLogin(state);
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/LoginOthers" element={<LoginOthers />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/Permission" element={<Permission />} />
        
        {/*login Branch---------------------------------------------------------------------------------------------------*/}
        <Route path="/EmployeeBulkExcelSheetUpload" element={<EmployeeBulkExcelSheetUpload />} />
        <Route path="/EmployeeBulkExcelSheetUploadcopy" element={<EmployeeBulkExcelSheetUploadcopy />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/Masters" element={<MastersTemplate />} />
        <Route path="/CompanyForm01" element={<CompanyMasters />} />
        <Route path="/PayBranchForm01" element={<PayBranchForm01 />} />
        <Route path="/PaymEmployeeMasters" element={<PaymEmployeeMasters />} />
        <Route path="/Departmensmasters" element={<Departmensmasters />} />
        <Route path="/DesignationMasters" element={<DesignationMasters />} />
        <Route path="/ShiftMasters" element={<ShiftMasters />} />
        <Route path="/Group" element={<GroupUi />} />
        <Route path="/Group/addinfos" element={<AddInfos />} />
        <Route path="/EmployeeShift" element={<GroupShift />} />
        <Route path="/SlabTemplate" element={<SlabTemplate />} />
        <Route path="/LeaveApply" element={<LeaveApplyRequestHigher />} />
        <Route path="/LeaveRequestManager" element={<LeaveRequestManager />} />
        <Route path="/LeaveRequestEmployee" element={<LeaveRequestEmployee />} />
        <Route path="/Attendance" element={<AttendanceHome />} />
        <Route path="/AssetsTable" element={<AssetsTable />}></Route>
        <Route path="/EarnDeductTable" element={<EarnDeductTable />}></Route>
        <Route path="/SlabTemplateEmp" element={<SlabTemplateEmp />} />
        <Route path="/PaymEmployeeForm" element={<PaymEmployeeForm />} />
        <Route path="/PaymEmpTable" element={<PaymEmpTable />}></Route>
        {/* <Route path="/payslipgenerator" element={<PayslipGenerator />}></Route> */}
        {/* <Route path="/payslipgenerator/payslipmonthly" element={<Payslipmonthly />}></Route> */}
        {/* <Route path="/payslipelegant" element={<Payslipelegant />}></Route> */}
        <Route path="/classic" element={<PayslipNewFormat />}></Route>
        <Route path="/PtGrid" element={<PtGrid />}></Route>
        <Route path="/OverTime" element={<OverTime />}></Route>
        <Route path="/AttendanceBonusSetup" element={<AttendanceBonusSetup />}></Route>
        <Route path="/Empcalendar" element={<Empcalendar />}></Route>
        <Route path="/DBoards" element={<DBoards />} />
        <Route path="/GraphCheckBox1" element={<GraphCheckBox1 />}> </Route>
        <Route path="/EmployeeHome" element={<EmployeeHome />}></Route>
        <Route path="/PaymEmployeeForm0045" element={<PaymEmployeeForm0045 />}></Route>
        <Route path="/PaymEmployeeFormm" element={<PaymEmployeeFormm />} />
        <Route path="/HolidaysPage" element={<HolidaysPage />}></Route>
        <Route path="/HolidayForm1" element={<HolidayForm1 />}></Route>
        <Route path="/Attendance01" element={<Attendance01 />}></Route>
        <Route path="/LeaveRequestHr" element={<LeaveRequestHr />}></Route>
        <Route path="/EmployeeReimbursement" element={<EmployeeReimbursement />}></Route>
        <Route path="/EarnDeductMasters" element={<EarnDeductMastersss />} />
        {/* <Route path="/Employeeprofile0909" element={<Employeeprofile0909 />} /> */}
        <Route path="/EarnDeductValueMaters" element={<EarnDeductValueMasters />} />
        <Route path="/Editprofile/:id" element={<Editprofile />} />
        <Route path="/EditEmployee/:id" element={<EditEmployee />} />
        <Route path="/DesignationMaster" element={<DesignationMaster />} />
        <Route path="/DepartmentMaster" element={<DepartmentMaster />} />
        <Route path="/DepartmentHome" element={<DepartmentHome />} />
        <Route path="/DesignationHome" element={<DesignationHome />} />
        <Route path="/SlideAnimationComponent" element={<SlideAnimationComponent />}></Route>
        <Route path="/AllowanceMasterBranch" element={<AllowanceMasterBranch />} />
        <Route path="/DeductionMasterBranch" element={<Deductionmasterbranch />} />
        <Route path="/AnimatedGallery" element={<AnimatedGallery />} />
        <Route path="/Payslipprocess" element={<Payslipprocess />} />
        <Route path="/ShiftPattern" element={<ShiftPattern />} />
        <Route path="/ShiftDetails" element={<ShiftDetails />} />
        <Route path="/EmployeeShiftAllocation" element={<EmployeeShiftAllocation />} />
        <Route path="/TimeCardSetup" element={<TimeCardSetup />} />
        <Route path="/ManualAttendance" element={<ManualAttendance />} />
        <Route path="/ReaderAttendance" element={<ReaderAttendance />} />
        <Route path="/ReaderMaster" element={<ReaderMaster />} />
        <Route path="/Payslip" element={<Payslip />} />



        {/*login company---------------------------------------------------------------------------------------------------*/}
        <Route path="/HomePage1" element={<HomePage1 />} />
        <Route path="/CompanyMasterss1" element={<CompanyMasterss1 />} />
        <Route path="/CompanyMasterss1copy" element={<CompanyMasterss1copy />} />
        <Route path="/BranchMaster1" element={<BranchMaster1 />} />
        <Route path="/BranchMaster1copy" element={<BranchMaster1copy />} />
        <Route path="/BranchMasters2" element={<BranchMasters2 />} />
        <Route path="/CategoryFormMaster1" element={<CategoryFormMaster1 />} />
        <Route path="/CategoryFormMaster1copy" element={<CategoryFormMaster1copy />} />
        <Route path="/DivisionMaster1" element={<DivisionMaster1 />} />
        <Route path="/DivisionMaster1copy" element={<DivisionMaster1copy />} />
        <Route path="/DepartmentFormMaster1" element={<DepartmentFormMaster1 />} />
        <Route path="/DepartmentFormMaster1copy" element={<DepartmentFormMaster1copy />} />
        <Route path="/DesignationMasterForm1" element={<DesignationMasterForm1 />} />
        <Route path="/DesignationMasterForm1copy" element={<DesignationMasterForm1copy />} />
        <Route path="/GradeForm1" element={<GradeForm1 />} />
        <Route path="/GradeForm1copy" element={<GradeForm1copy />} />
        {/* <Route path="/ShiftFormMaster1" element={<ShiftFormMaster1/>}/>  */}
        <Route path="/JobStatusFormMaster1" element={<JobStatusFormMaster1 />} />
        <Route path="/JobStatusFormMaster1copy" element={<JobStatusFormMaster1copy />} />
        <Route path="/LevelFormMaster1" element={<LevelFormMaster1 />} />
        <Route path="/LevelFormMaster1copy" element={<LevelFormMaster1copy />} />
        <Route path="/PaymLeaveMaster1" element={<PaymLeaveMaster1 />} />
        <Route path="/PaymLeaveMaster1copy" element={<PaymLeaveMaster1copy />} />
        <Route path="/GradeSlab" element={<Grade_Slab />} />
        <Route path="/GradeSlabcopy" element={<GradeSlabcopy />} />
        <Route path="/EarnDeductCompanyMasters" element={<EarnDeductCompanyMasters />} />
        <Route path="/Editprofileh1/:employeeId" element={<Editprofileh1 />} />
        <Route path="/EditEmployeeh1/:employeeId" element={<EditEmployeeh1 />} />
        <Route path="/EmployeeHomeH1" element={<EmployeeHomeH1 />}></Route>
        <Route path="/PaymEmployeeFormmh1" element={<PaymEmployeeFormmh1 />} />
        {/* <Route path="/Employeeprofile0909h1" element={<Employeeprofile0909h1 />} /> */}
        <Route path="/PayslipReport" element={<PayslipReport />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/Cutofdate" element={<Cutofdate />} />
        <Route path="/SalaryPeriod" element={<SalaryPeriod />} />
        <Route path="/PayRegister" element={<PayRegister />} />
        <Route path="Confetti" element={<Confetti />} />
        <Route path="PayslipDashboard" element={<PayslipDashboard />} />
        <Route path="/LeaveSandwiching" element={<LeaveSandwiching />} />
        <Route path="/LateProvision" element={<LateProvision />} />
        <Route path="/Demo" element={<Demo />} />
        <Route path="/PFreport" element={<PFReport />} />



        {/*login employee---------------------------------------------------------------------------------------------------*/}
        <Route path="/" element={<Login/>} />
        <Route path="/HomePage2" element={<HomePage2 />} />
        <Route path="HolidaysempPage2" element={<HolidaysempPage2 />} />
        <Route path="/LeaveapplyHr2" element={<LeaveapplyHr2 />} />
        <Route path="/LeaveRequestTable2" element={<LeaveRequestTable2 />} />
        <Route path="/LeaveBalances2" element={<LeaveBalances2 />} />
        <Route path="/LeaveCalendar2" element={<LeaveCalendar2 />} />
        <Route path="/ReimbursementForm2" element={<ReimbursementForm2 />} />
        <Route path="/EmployeeDashBoard2" element={<EmployeeDashBoard2 />} />
        <Route path="/BasicDateCalendar2" element={<BasicDateCalendar2 />} />
        <Route path="/Consolidation" element={<Consolidation />} />
        <Route path="/OldPayslip" element={<OldPayslip />} />
        <Route path="/OldPayslipGenerator" element={<OldPayslipGenerator />} />
        <Route path="/payslipelegant" element={<Payslipelegant />} />
        <Route path="/payslipgenerator" element={<PayslipGenerator />} />
        <Route path="/payslipgenerator/Payslipmonthly" element={<Payslipmonthly />} />
        <Route path="/classic" element={<PayslipNewFormat />} />
        <Route path="/PaySlipTemplate" element={<PaySlipTemplate />} />
        <Route path="/PaySlipFormTemplate" element={<PaySlipFormTemplate />} />
        <Route path="/PrintPayslip" element={<PrintPayslip />} />
        <Route path="/YesNoSwitch" element={<YesNoSwitch />} />
        <Route path="/LoanMaster" element={<LoanMaster />} />
        <Route path="/LoanEntry" element={<LoanEntry />} />
        <Route path="/CTCSlabTable" element={<CTCSlabTable />} />
        <Route path="/CTCSlabTablecopy" element={<CTCSlabTablecopy />} />
        <Route path="/LoanApproval" element={<LoanApproval />} />
        <Route path="/PFvalues" element={<PFvalues />} />
        <Route path="/AllowanceMaster" element={<AllowanceMaster />} />
        <Route path="/AllowanceValues" element={<AllowanceValues />} />
        <Route path="/DeductionMaster" element={<DeductionMaster />} />
        <Route path="/AllowanceSettings" element={<AllowanceSettings />} />
        <Route path="/AllowanceValuesBranch" element={<AllowanceValuesBranch />} />
        <Route path="/AllowanceSettingsBranch" element={<AllowanceSettingsBranch />} />
        <Route path="/ESIsettings" element={<ESIsettings />} />
        <Route path="/AssetGridForm" element={<AssetGridForm />} />
        <Route path="/AssetGridFormcopy" element={<AssetGridFormcopy />} />
        <Route path="/Masters1" element={<Masters1 />} />
        <Route path="/Divisions" element={<Divisions />} />
        <Route path="/Departments" element={<Departments />} />
        <Route path="/Designations" element={<Designations />} />
        <Route path="/Grades" element={<Grades />} />
        <Route path="/Categorys" element={<Categorys />} />
        <Route path="/JobStatus" element={<JobStatus />} />
        <Route path="/Levels" element={<Levels />} />
        <Route path="/Leaves" element={<Leaves />} />
        <Route path="/Assets" element={<Assets />} />
      </Routes>
    </div>
  );
}
const mapStateToProps = (state) => ({ state: state });
const mapDispatchToProps = (dispatch) => ({ dispatch: dispatch });
export default connect(mapStateToProps, mapDispatchToProps)(App);
