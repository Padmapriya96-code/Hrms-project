import { Grid,Card,
    TextField,
    Button,
    Typography,
    Box,
    CardContent,
    Select,
  MenuItem  
  } from '@mui/material';
  import {connect} from "react-redux"
  import { addEntity,viewById } from '../reduxcomp/actions/actionfunctions'
  import {inputpaymEmployeeForm} from './paymEmployee';
  import { useState,useEffect } from 'react';
   import { getRequest, postRequest } from '../serverconfiguration/requestcomp';  
 import { ServerConfig } from '../serverconfiguration/serverconfig';
import { PAYMCOMPANIES,PAYMBRANCHES, PAYMEMPLOYEE } from '../serverconfiguration/controllers';
   function EmployeeForm(props) {
    const [branchData,setBranchData]=useState([])
   
    const [companydata,setCompanyData]=useState([])
    
   const [companyId,setCompanyId]=useState(0)
   const [branchId,setBranchId]=useState(0)
    useEffect(()=>{
      getRequest(ServerConfig.url,PAYMCOMPANIES).then((e)=>{
        console.log(e.data)
        setCompanyData(e.data)
      })
      getRequest(ServerConfig.url,PAYMBRANCHES).then((e)=>{
        console.log(e.data)
        setBranchData(e.data)
      })
     

    },[])
    const[formData,setFormData]=useState([])
   
    const margin={margin:"0 5px"}

   return (
      <div className="App">
        <Grid style ={{ padding: "80px 5px0 5px" }}>
        <Card style ={{ maxWidth: 600, margin: "0 auto" ,font:'initial'}}>
        <CardContent>
        <Typography sx={{ mt: 3 }} align='center' color='primary' variant="h5">Paym Employee</Typography>
        <form onSubmit={(e)=>{
        e.preventDefault()
        let pnCompanyID=companyId
        let pnBranchId=branchId
        let employeecode=e.currentTarget.elements.EmployeeCode.value
        let empfirstname=e.currentTarget.elements.Employee_First_Name.value
        let empmiddlename=e.currentTarget.elements.Employee_Middle_Name.value
        let emplastname=e.currentTarget.elements.Employee_Last_Name.value
        let dateofbirth="1992-12-07T00:00:00"
        let password=e.currentTarget.elements.Password.value
        let gender=e.currentTarget.elements.Gender.value
        let status=e.currentTarget.elements.Status.value

        let empfullname=e.currentTarget.elements.Employee_Full_Name.value

        let readerid=e.currentTarget.elements.Reader_Id.value

        let oteligible=e.currentTarget.elements.OT_Eligible.value
        let pfno=e.currentTarget.elements.PF_No.value

        let esino=e.currentTarget.elements.Esi_No.value

        let otCalc=e.currentTarget.elements.OT_Calc.value
        let ctc=e.currentTarget.elements.CTC.value
        let basicsalary=e.currentTarget.elements.Basic_Salary.value
        let bankcode=e.currentTarget.elements.Bank_code.value
        let bankname=e.currentTarget.elements.Bank_Name.value
        let branchname=e.currentTarget.elements.Branch_Name.value

        let accounttype=e.currentTarget.elements.Account_Type.value

        let micrCode=e.currentTarget.elements.MICR_code.value

        let ifscCode=e.currentTarget.elements.IFSC_Code.value

        let address=e.currentTarget.elements.Address.value

        let otherinfo=e.currentTarget.elements.Other_Info.value

        let reportingperson=e.currentTarget.elements.Reporting_Person.value
        let reportingid=e.currentTarget.elements.Reporting_Id.value

        let reportingEmail=e.currentTarget.elements.Reporting_Email.value

        let  panNo =e.currentTarget.elements.Pan_No.value

        let cardNo=e.currentTarget.elements.Card_No.value
        let  salaryType =e.currentTarget.elements.Salary_Type.value
        let  tdsApplicable =e.currentTarget.elements.TDS_Applicable.value
        let  flag =e.currentTarget.elements.Flag.value
        let  role =e.currentTarget.elements.Role.value
      

       
/*       var obj= {
          "pnCompanyId": pnCompanyID,
          "pnBranchId": pnBranchId,
          "employeeCode": employeecode,
          "employeeFirstName": empfirstname,
          "employeeMiddleName": empmiddlename,
          "employeeLastName": emplastname,
          "dateofBirth":dateofbirth,
          "password": password,
          "gender": gender,
          "status": status,
          "employeeFullName": empfullname,
          "readerid": readerid,
          "otEligible":oteligible,
          "pfno": pfno,
          "esino": esino,
          "otCalc":otCalc,
          "ctc": ctc,
          "basicSalary":basicsalary,
          "bankCode": bankcode,
          "bankName": bankname,
          "branchName": branchname,
          "accountType": accounttype,
          "micrCode":micrCode,
          "ifscCode":ifscCode,
          "address": address,
          "otherInfo":otherinfo,
          "reportingPerson": reportingperson,
          "reportingId": reportingid,
          "reportingEmail": reportingEmail,
          "panNo": panNo,
          "cardNo": cardNo,
          "salaryType": salaryType,
          "tdsApplicable": tdsApplicable,
          "flag": flag,
          "role": role

      }
*/
var obj={
  "pnCompanyId": 1,
  "pnBranchId": 1,
  "pnEmployeeId": 0,
  "employeeCode": "str003",
  "employeeFirstName": "Peter",
  "employeeMiddleName": "Erric",
  "employeeLastName": "Jones",
  "dateofBirth": "2024-04-16T04:37:14.153Z",
  "password": "12345",
  "gender": "Male",
  "status": "Married",
  "employeeFullName": "Peter Griffin",
  "readerid": 1,
  "otEligible": "Yes",
  "pfno": "string",
  "esino": "string",
  "otCalc": 0,
  "ctc": 0,
  "basicSalary": 0,
  "bankCode": "string",
  "bankName": "string",
  "branchName": "string",
  "accountType": "string",
  "micrCode": "string",
  "ifscCode": "string",
  "address": "string",
  "otherInfo": "string",
  "reportingPerson": "string",
  "reportingId": 0,
  "reportingEmail": "string",
  "panNo": "string",
  "cardNo": "string",
  "salaryType": "string",
  "tdsApplicable": "string",
  "flag": "string",
  "role": 0,
  "paymBranch": {
    "pnCompanyId": 0,
    "pnBranchId": 0,
    "branchCode": "string",
    "branchName": "string",
    "addressLine1": "string",
    "addressLine2": "string",
    "city": "string",
    "zipCode": "string",
    "country": "string",
    "state": "string",
    "phoneNo": "string",
    "faxNo": "string",
    "emailId": "string",
    "alternateEmailId": "string",
    "branchUserId": "string",
    "branchPassword": "string",
    "status": "string",
    "pfno": "string",
    "esino": "string",
    "startDate": "2024-04-16T04:37:14.153Z",
    "endDate": "2024-04-16T04:37:14.153Z",
    "loanEntries": [
      {
        "pnCompanyId": 0,
        "pnBranchId": 0,
        "pnEmployeeId": 0,
        "loanAutoId": "string",
        "fnLoanId": 0,
        "sanDate": "2024-04-16T04:37:14.153Z",
        "dEffdate": "2024-04-16T04:37:14.153Z",
        "loanAmt": 0,
        "instalmentAmt": 0,
        "instalmentcount": 0,
        "balanceAmt": 0,
        "cStatus": "string",
        "loanName": "string",
        "loanProcess": "string",
        "loanCalculation": "string",
        "comments": "string",
        "loanAppid": "string",
        "interest": 0,
        "totInterestAmt": 0,
        "empName": "string",
        "loanStatus": "string",
        "lasttransactionFrom": "2024-04-16T04:37:14.153Z",
        "lasttransactionTo": "2024-04-16T04:37:14.153Z",
        "paymBranch": "string",
        "paymLoan": {
          "pnCompanyid": 0,
          "pnLoanId": 0,
          "vLoanName": "string",
          "vLoanCode": "string",
          "status": "string",
          "pnBranchId": 0,
          "loanEntries": [
            "string"
          ],
          "pnCompany": "string"
        }
      }
    ],
    "loanPreClosers": [
      {
        "pnCompanyId": 0,
        "pnBranchId": 0,
        "pnEmployeeId": 0,
        "loanAppid": "string",
        "dDate": "2024-04-16T04:37:14.153Z",
        "nLoanamount": 0,
        "nBalanceamount": 0,
        "nPaidamount": 0,
        "nClosureamount": 0,
        "nCheckno": "string",
        "dCheckdate": "2024-04-16T04:37:14.153Z",
        "nCheckamount": 0,
        "vBankname": "string",
        "vRemarks": "string",
        "cStatus": "string",
        "intAmt": 0,
        "paymentMode": "string",
        "loanProcess": "string",
        "loanInterest": 0,
        "loanName": "string",
        "paymBranch": "string"
      }
    ],
    "payInputs": [
      {
        "pnCompanyId": 0,
        "pnBranchId": 0,
        "pnEmployeeId": 0,
        "dDate": "2024-04-16T04:37:14.153Z",
        "dFromDate": "2024-04-16T04:37:14.153Z",
        "dToDate": "2024-04-16T04:37:14.153Z",
        "calcDays": 0,
        "paidDays": 0,
        "presentDays": 0,
        "absentDays": 0,
        "totLeaveDays": 0,
        "weekOffDays": 0,
        "holidays": 0,
        "onDutyDays": 0,
        "compoffDays": 0,
        "tourDays": 0,
        "attBonus": "string",
        "attBonusAmount": 0,
        "otHrs": "string",
        "earnArrears": 0,
        "dedArrears": 0,
        "otValue": 0,
        "otAmt": 0,
        "actBasic": 0,
        "earnBasic": 0,
        "mode": "string",
        "flag": "string",
        "ptGross": 0,
        "paymBranch": "string"
      }
    ],
    "paymEmpDeductions": [
      {
        "pnCompanyId": 0,
        "pnBranchId": 0,
        "pnEmployeeId": 0,
        "pnDeductionId": 0,
        "nAmount": 0,
        "dDate": "2024-04-16T04:37:14.153Z",
        "cEligible": "string",
        "fromDate": "2024-04-16T04:37:14.153Z",
        "toDate": "2024-04-16T04:37:14.153Z",
        "periodCode": "string",
        "paymBranch": "string",
        "paymDeduction": {
          "pnCompanyId": 0,
          "pnBranchId": 0,
          "pnDeductionId": 0,
          "vDeductionCode": "string",
          "vDeductionName": "string",
          "cRegular": "string",
          "cPrint": "string",
          "status": "string",
          "dOrder": 0,
          "paymEmpDeductions": [
            "string"
          ],
          "pnCompany": {
            "pnCompanyId": 0,
            "companyCode": "string",
            "companyName": "string",
            "addressLine1": "string",
            "addressLine2": "string",
            "city": "string",
            "zipCode": "string",
            "country": "string",
            "state": "string",
            "phoneNo": "string",
            "faxNo": "string",
            "emailId": "string",
            "alternateEmailId": "string",
            "pfno": "string",
            "esino": "string",
            "startDate": "2024-04-16T04:37:14.153Z",
            "endDate": "2024-04-16T04:37:14.153Z",
            "hrmmCourses": [
              {
                "pnCompanyId": 0,
                "pnCourseId": 0,
                "vCourseName": "string",
                "status": "string",
                "branchId": 0,
                "pnCompany": "string"
              }
            ],
            "hrmmSkillsMasters": [
              {
                "pnCompanyId": 0,
                "pnSkillId": 0,
                "vSkillName": "string",
                "status": "string",
                "branchId": 0,
                "pnCompany": "string"
              }
            ],
            "hrmmSpecializations": [
              {
                "pnCompanyId": 0,
                "pnSpecializationId": 0,
                "vSpecializationName": "string",
                "status": "string",
                "pnBranchId": 0,
                "pnCompany": "string"
              }
            ],
            "payOutputDeductions": [
              {
                "pnCompanyId": 0,
                "pnEmployeeId": 0,
                "pnDeductionId": 0,
                "pnDepartmentName": "string",
                "dDate": "2024-04-16T04:37:14.153Z",
                "dFromDate": "2024-04-16T04:37:14.153Z",
                "dToDate": "2024-04-16T04:37:14.153Z",
                "mode": "string",
                "flag": "string",
                "actAmount": 0,
                "amount": 0,
                "pnBranchId": 0,
                "pnCompany": "string"
              }
            ],
            "payOutputEsis": [
              {
                "pnCompanyId": 0,
                "pnEmployeeId": 0,
                "vEsino": "string",
                "dDate": "2024-04-16T04:37:14.153Z",
                "dFromDate": "2024-04-16T04:37:14.153Z",
                "dToDate": "2024-04-16T04:37:14.153Z",
                "netPay": 0,
                "esiEmp": 0,
                "esiEpr": 0,
                "paidDays": 0,
                "absentDays": 0,
                "weekOffDays": 0,
                "periodCode": "string",
                "pnBranchId": 0,
                "pnCompany": "string"
              }
            ],
            "payOutputNetPays": [
              {
                "pnCompanyId": 0,
                "pnBranchId": 0,
                "pnEmployeeId": 0,
                "dDate": "2024-04-16T04:37:14.153Z",
                "dFromDate": "2024-04-16T04:37:14.153Z",
                "dToDate": "2024-04-16T04:37:14.153Z",
                "earnActAmount": 0,
                "earnAmount": 0,
                "otAmt": 0,
                "dedActAmount": 0,
                "dedAmount": 0,
                "netPay": 0,
                "actBasic": 0,
                "earnedBasic": 0,
                "grossSalary": 0,
                "netSalary": 0,
                "periodCode": "string",
                "pnCompany": "string"
              }
            ],
            "payOutputPfs": [
              {
                "pnCompanyId": 0,
                "pnEmployeeId": 0,
                "vPfno": "string",
                "dDate": "2024-04-16T04:37:14.153Z",
                "dFromDate": "2024-04-16T04:37:14.153Z",
                "dToDate": "2024-04-16T04:37:14.153Z",
                "netPay": 0,
                "pf": 0,
                "totPf": 0,
                "epf": 0,
                "fpf": 0,
                "vpf": 0,
                "paidDays": 0,
                "absentDays": 0,
                "weekOffDays": 0,
                "periodCode": "string",
                "pnBranchId": 0,
                "pnCompany": "string"
              }
            ],
            "paymBranches": [
              "string"
            ],
            "paymCategories": [
              {
                "pnCompanyId": 0,
                "branchId": 0,
                "pnCategoryId": 0,
                "vCategoryName": "string",
                "status": "string",
                "paymEmployeeProfile1s": [
                  {
                    "id": 0,
                    "pnCompanyId": 0,
                    "pnBranchId": 0,
                    "pnEmployeeId": 0,
                    "pnDivisionId": 0,
                    "pnDepartmentId": 0,
                    "pnDesingnationId": 0,
                    "pnGradeId": 0,
                    "pnShiftId": 0,
                    "pnCategoryId": 0,
                    "pnJobStatusId": 0,
                    "pnLevelId": 0,
                    "pnProjectsiteId": 0,
                    "dDate": "2024-04-16T04:37:14.153Z",
                    "vReason": "string",
                    "rDepartment": 0,
                    "paymCategory": "string",
                    "paymDepartment": "string"
                  }
                ],
                "pnCompany": "string"
              }
            ],
            "paymDeductions": [
              "string"
            ],
            "paymDepartments": [
              {
                "pnCompanyId": 0,
                "pnBranchId": 0,
                "pnDepartmentId": 0,
                "vDepartmentName": "string",
                "status": "string",
                "paymEmployeeProfile1s": [
                  {
                    "id": 0,
                    "pnCompanyId": 0,
                    "pnBranchId": 0,
                    "pnEmployeeId": 0,
                    "pnDivisionId": 0,
                    "pnDepartmentId": 0,
                    "pnDesingnationId": 0,
                    "pnGradeId": 0,
                    "pnShiftId": 0,
                    "pnCategoryId": 0,
                    "pnJobStatusId": 0,
                    "pnLevelId": 0,
                    "pnProjectsiteId": 0,
                    "dDate": "2024-04-16T04:37:14.153Z",
                    "vReason": "string",
                    "rDepartment": 0,
                    "paymCategory": "string",
                    "paymDepartment": "string"
                  }
                ],
                "pnCompany": "string"
              }
            ],
            "paymDesignations": [
              {
                "pnCompanyId": 0,
                "branchId": 0,
                "pnDesignationId": 0,
                "vDesignationName": "string",
                "authority": "string",
                "status": "string",
                "pnCompany": "string"
              }
            ],
            "paymDivisions": [
              {
                "pnCompanyId": 0,
                "branchId": 0,
                "pnDivisionId": 0,
                "vDivisionName": "string",
                "status": "string",
                "pnCompany": "string"
              }
            ],
            "paymEarnings": [
              "string"
            ],
            "paymGrades": [
              {
                "pnCompanyId": 0,
                "branchId": 0,
                "pnGradeId": 0,
                "vGradeName": "string",
                "status": "string",
                "pnCompany": "string"
              }
            ],
            "paymJobStatuses": [
              {
                "pnCompanyId": 0,
                "branchId": 0,
                "pnJobStatusId": 0,
                "vJobStatusName": "string",
                "status": "string",
                "pnCompany": "string"
              }
            ],
            "paymLeaves": [
              {
                "pnCompanyId": 0,
                "pnLeaveId": 0,
                "vLeaveName": "string",
                "pnLeaveCode": "string",
                "pnCount": 0,
                "status": "string",
                "pnBranchId": 0,
                "annualLeave": "string",
                "maxDays": 0,
                "el": "string",
                "type": "string",
                "pnCompany": "string"
              }
            ],
            "paymLevels": [
              {
                "pnCompanyId": 0,
                "branchId": 0,
                "pnLevelId": 0,
                "vLevelName": "string",
                "status": "string",
                "pnCompany": "string"
              }
            ],
            "paymLoans": [
              {
                "pnCompanyid": 0,
                "pnLoanId": 0,
                "vLoanName": "string",
                "vLoanCode": "string",
                "status": "string",
                "pnBranchId": 0,
                "loanEntries": [
                  "string"
                ],
                "pnCompany": "string"
              }
            ],
            "paymOverHeadingCosts": [
              {
                "pnCompanyId": 0,
                "branchId": 0,
                "overHeadingId": 0,
                "overHeadingName": "string",
                "status": "string",
                "pnCompany": "string"
              }
            ],
            "paymShifts": [
              {
                "pnCompanyId": 0,
                "pnShiftId": 0,
                "vShiftName": "string",
                "vShiftFrom": "string",
                "vShiftTo": "string",
                "status": "string",
                "branchId": 0,
                "vShiftCategory": "string",
                "pnCompany": "string"
              }
            ]
          }
        },
        "paymEmployee": "string"
      }
    ],
    "paymEmpEarnings": [
      {
        "pnCompanyId": 0,
        "pnBranchId": 0,
        "pnEmployeeId": 0,
        "pnEarningsId": 0,
        "pid": 0,
        "id": 0,
        "nAmount": 0,
        "dDate": "2024-04-16T04:37:14.153Z",
        "cEligible": "string",
        "fromDate": "2024-04-16T04:37:14.153Z",
        "toDate": "2024-04-16T04:37:14.153Z",
        "flag": "string",
        "paymBranch": "string",
        "paymEarning": {
          "pnCompanyId": 0,
          "pnEarningsId": 0,
          "vEarningsCode": "string",
          "vEarningsName": "string",
          "cRegular": "string",
          "cPf": "string",
          "cEsi": "string",
          "cOt": "string",
          "cLop": "string",
          "cPt": "string",
          "cPrint": "string",
          "payslip": "string",
          "status": "string",
          "dOrder": 0,
          "pnBranchId": 0,
          "paymEmpEarnings": [
            "string"
          ],
          "pnCompany": {
            "pnCompanyId": 0,
            "companyCode": "string",
            "companyName": "string",
            "addressLine1": "string",
            "addressLine2": "string",
            "city": "string",
            "zipCode": "string",
            "country": "string",
            "state": "string",
            "phoneNo": "string",
            "faxNo": "string",
            "emailId": "string",
            "alternateEmailId": "string",
            "pfno": "string",
            "esino": "string",
            "startDate": "2024-04-16T04:37:14.153Z",
            "endDate": "2024-04-16T04:37:14.153Z",
            "hrmmCourses": [
              {
                "pnCompanyId": 0,
                "pnCourseId": 0,
                "vCourseName": "string",
                "status": "string",
                "branchId": 0,
                "pnCompany": "string"
              }
            ],
            "hrmmSkillsMasters": [
              {
                "pnCompanyId": 0,
                "pnSkillId": 0,
                "vSkillName": "string",
                "status": "string",
                "branchId": 0,
                "pnCompany": "string"
              }
            ],
            "hrmmSpecializations": [
              {
                "pnCompanyId": 0,
                "pnSpecializationId": 0,
                "vSpecializationName": "string",
                "status": "string",
                "pnBranchId": 0,
                "pnCompany": "string"
              }
            ],
            "payOutputDeductions": [
              {
                "pnCompanyId": 0,
                "pnEmployeeId": 0,
                "pnDeductionId": 0,
                "pnDepartmentName": "string",
                "dDate": "2024-04-16T04:37:14.153Z",
                "dFromDate": "2024-04-16T04:37:14.153Z",
                "dToDate": "2024-04-16T04:37:14.153Z",
                "mode": "string",
                "flag": "string",
                "actAmount": 0,
                "amount": 0,
                "pnBranchId": 0,
                "pnCompany": "string"
              }
            ],
            "payOutputEsis": [
              {
                "pnCompanyId": 0,
                "pnEmployeeId": 0,
                "vEsino": "string",
                "dDate": "2024-04-16T04:37:14.153Z",
                "dFromDate": "2024-04-16T04:37:14.153Z",
                "dToDate": "2024-04-16T04:37:14.153Z",
                "netPay": 0,
                "esiEmp": 0,
                "esiEpr": 0,
                "paidDays": 0,
                "absentDays": 0,
                "weekOffDays": 0,
                "periodCode": "string",
                "pnBranchId": 0,
                "pnCompany": "string"
              }
            ],
            "payOutputNetPays": [
              {
                "pnCompanyId": 0,
                "pnBranchId": 0,
                "pnEmployeeId": 0,
                "dDate": "2024-04-16T04:37:14.153Z",
                "dFromDate": "2024-04-16T04:37:14.153Z",
                "dToDate": "2024-04-16T04:37:14.153Z",
                "earnActAmount": 0,
                "earnAmount": 0,
                "otAmt": 0,
                "dedActAmount": 0,
                "dedAmount": 0,
                "netPay": 0,
                "actBasic": 0,
                "earnedBasic": 0,
                "grossSalary": 0,
                "netSalary": 0,
                "periodCode": "string",
                "pnCompany": "string"
              }
            ],
            "payOutputPfs": [
              {
                "pnCompanyId": 0,
                "pnEmployeeId": 0,
                "vPfno": "string",
                "dDate": "2024-04-16T04:37:14.153Z",
                "dFromDate": "2024-04-16T04:37:14.153Z",
                "dToDate": "2024-04-16T04:37:14.153Z",
                "netPay": 0,
                "pf": 0,
                "totPf": 0,
                "epf": 0,
                "fpf": 0,
                "vpf": 0,
                "paidDays": 0,
                "absentDays": 0,
                "weekOffDays": 0,
                "periodCode": "string",
                "pnBranchId": 0,
                "pnCompany": "string"
              }
            ],
            "paymBranches": [
              "string"
            ],
            "paymCategories": [
              {
                "pnCompanyId": 0,
                "branchId": 0,
                "pnCategoryId": 0,
                "vCategoryName": "string",
                "status": "string",
                "paymEmployeeProfile1s": [
                  {
                    "id": 0,
                    "pnCompanyId": 0,
                    "pnBranchId": 0,
                    "pnEmployeeId": 0,
                    "pnDivisionId": 0,
                    "pnDepartmentId": 0,
                    "pnDesingnationId": 0,
                    "pnGradeId": 0,
                    "pnShiftId": 0,
                    "pnCategoryId": 0,
                    "pnJobStatusId": 0,
                    "pnLevelId": 0,
                    "pnProjectsiteId": 0,
                    "dDate": "2024-04-16T04:37:14.153Z",
                    "vReason": "string",
                    "rDepartment": 0,
                    "paymCategory": "string",
                    "paymDepartment": "string"
                  }
                ],
                "pnCompany": "string"
              }
            ],
            "paymDeductions": [
              "string"
            ],
            "paymDepartments": [
              {
                "pnCompanyId": 0,
                "pnBranchId": 0,
                "pnDepartmentId": 0,
                "vDepartmentName": "string",
                "status": "string",
                "paymEmployeeProfile1s": [
                  {
                    "id": 0,
                    "pnCompanyId": 0,
                    "pnBranchId": 0,
                    "pnEmployeeId": 0,
                    "pnDivisionId": 0,
                    "pnDepartmentId": 0,
                    "pnDesingnationId": 0,
                    "pnGradeId": 0,
                    "pnShiftId": 0,
                    "pnCategoryId": 0,
                    "pnJobStatusId": 0,
                    "pnLevelId": 0,
                    "pnProjectsiteId": 0,
                    "dDate": "2024-04-16T04:37:14.153Z",
                    "vReason": "string",
                    "rDepartment": 0,
                    "paymCategory": "string",
                    "paymDepartment": "string"
                  }
                ],
                "pnCompany": "string"
              }
            ],
            "paymDesignations": [
              {
                "pnCompanyId": 0,
                "branchId": 0,
                "pnDesignationId": 0,
                "vDesignationName": "string",
                "authority": "string",
                "status": "string",
                "pnCompany": "string"
              }
            ],
            "paymDivisions": [
              {
                "pnCompanyId": 0,
                "branchId": 0,
                "pnDivisionId": 0,
                "vDivisionName": "string",
                "status": "string",
                "pnCompany": "string"
              }
            ],
            "paymEarnings": [
              "string"
            ],
            "paymGrades": [
              {
                "pnCompanyId": 0,
                "branchId": 0,
                "pnGradeId": 0,
                "vGradeName": "string",
                "status": "string",
                "pnCompany": "string"
              }
            ],
            "paymJobStatuses": [
              {
                "pnCompanyId": 0,
                "branchId": 0,
                "pnJobStatusId": 0,
                "vJobStatusName": "string",
                "status": "string",
                "pnCompany": "string"
              }
            ],
            "paymLeaves": [
              {
                "pnCompanyId": 0,
                "pnLeaveId": 0,
                "vLeaveName": "string",
                "pnLeaveCode": "string",
                "pnCount": 0,
                "status": "string",
                "pnBranchId": 0,
                "annualLeave": "string",
                "maxDays": 0,
                "el": "string",
                "type": "string",
                "pnCompany": "string"
              }
            ],
            "paymLevels": [
              {
                "pnCompanyId": 0,
                "branchId": 0,
                "pnLevelId": 0,
                "vLevelName": "string",
                "status": "string",
                "pnCompany": "string"
              }
            ],
            "paymLoans": [
              {
                "pnCompanyid": 0,
                "pnLoanId": 0,
                "vLoanName": "string",
                "vLoanCode": "string",
                "status": "string",
                "pnBranchId": 0,
                "loanEntries": [
                  "string"
                ],
                "pnCompany": "string"
              }
            ],
            "paymOverHeadingCosts": [
              {
                "pnCompanyId": 0,
                "branchId": 0,
                "overHeadingId": 0,
                "overHeadingName": "string",
                "status": "string",
                "pnCompany": "string"
              }
            ],
            "paymShifts": [
              {
                "pnCompanyId": 0,
                "pnShiftId": 0,
                "vShiftName": "string",
                "vShiftFrom": "string",
                "vShiftTo": "string",
                "status": "string",
                "branchId": 0,
                "vShiftCategory": "string",
                "pnCompany": "string"
              }
            ]
          }
        },
        "paymEmployee": "string"
      }
    ],
    "paymEmployees": [
      "string"
    ],
    "paymPfs": [
      {
        "pnCompanyId": 0,
        "pnBranchId": 0,
        "empConPf": 0,
        "empConEpf": 0,
        "empConFpf": 0,
        "adminCharges": 0,
        "eligibilityAmt": 0,
        "cRound": "string",
        "dDate": "2024-04-16T04:37:14.153Z",
        "checkCeiling": "string",
        "maxAmount": 0,
        "checkAllowance": "string",
        "month": "string",
        "year": 0,
        "paymBranch": "string"
      }
    ],
    "pnCompany": {
      "pnCompanyId": 0,
      "companyCode": "string",
      "companyName": "string",
      "addressLine1": "string",
      "addressLine2": "string",
      "city": "string",
      "zipCode": "string",
      "country": "string",
      "state": "string",
      "phoneNo": "string",
      "faxNo": "string",
      "emailId": "string",
      "alternateEmailId": "string",
      "pfno": "string",
      "esino": "string",
      "startDate": "2024-04-16T04:37:14.154Z",
      "endDate": "2024-04-16T04:37:14.154Z",
      "hrmmCourses": [
        {
          "pnCompanyId": 0,
          "pnCourseId": 0,
          "vCourseName": "string",
          "status": "string",
          "branchId": 0,
          "pnCompany": "string"
        }
      ],
      "hrmmSkillsMasters": [
        {
          "pnCompanyId": 0,
          "pnSkillId": 0,
          "vSkillName": "string",
          "status": "string",
          "branchId": 0,
          "pnCompany": "string"
        }
      ],
      "hrmmSpecializations": [
        {
          "pnCompanyId": 0,
          "pnSpecializationId": 0,
          "vSpecializationName": "string",
          "status": "string",
          "pnBranchId": 0,
          "pnCompany": "string"
        }
      ],
      "payOutputDeductions": [
        {
          "pnCompanyId": 0,
          "pnEmployeeId": 0,
          "pnDeductionId": 0,
          "pnDepartmentName": "string",
          "dDate": "2024-04-16T04:37:14.154Z",
          "dFromDate": "2024-04-16T04:37:14.154Z",
          "dToDate": "2024-04-16T04:37:14.154Z",
          "mode": "string",
          "flag": "string",
          "actAmount": 0,
          "amount": 0,
          "pnBranchId": 0,
          "pnCompany": "string"
        }
      ],
      "payOutputEsis": [
        {
          "pnCompanyId": 0,
          "pnEmployeeId": 0,
          "vEsino": "string",
          "dDate": "2024-04-16T04:37:14.154Z",
          "dFromDate": "2024-04-16T04:37:14.154Z",
          "dToDate": "2024-04-16T04:37:14.154Z",
          "netPay": 0,
          "esiEmp": 0,
          "esiEpr": 0,
          "paidDays": 0,
          "absentDays": 0,
          "weekOffDays": 0,
          "periodCode": "string",
          "pnBranchId": 0,
          "pnCompany": "string"
        }
      ],
      "payOutputNetPays": [
        {
          "pnCompanyId": 0,
          "pnBranchId": 0,
          "pnEmployeeId": 0,
          "dDate": "2024-04-16T04:37:14.154Z",
          "dFromDate": "2024-04-16T04:37:14.154Z",
          "dToDate": "2024-04-16T04:37:14.154Z",
          "earnActAmount": 0,
          "earnAmount": 0,
          "otAmt": 0,
          "dedActAmount": 0,
          "dedAmount": 0,
          "netPay": 0,
          "actBasic": 0,
          "earnedBasic": 0,
          "grossSalary": 0,
          "netSalary": 0,
          "periodCode": "string",
          "pnCompany": "string"
        }
      ],
      "payOutputPfs": [
        {
          "pnCompanyId": 0,
          "pnEmployeeId": 0,
          "vPfno": "string",
          "dDate": "2024-04-16T04:37:14.154Z",
          "dFromDate": "2024-04-16T04:37:14.154Z",
          "dToDate": "2024-04-16T04:37:14.154Z",
          "netPay": 0,
          "pf": 0,
          "totPf": 0,
          "epf": 0,
          "fpf": 0,
          "vpf": 0,
          "paidDays": 0,
          "absentDays": 0,
          "weekOffDays": 0,
          "periodCode": "string",
          "pnBranchId": 0,
          "pnCompany": "string"
        }
      ],
      "paymBranches": [
        "string"
      ],
      "paymCategories": [
        {
          "pnCompanyId": 0,
          "branchId": 0,
          "pnCategoryId": 0,
          "vCategoryName": "string",
          "status": "string",
          "paymEmployeeProfile1s": [
            {
              "id": 0,
              "pnCompanyId": 0,
              "pnBranchId": 0,
              "pnEmployeeId": 0,
              "pnDivisionId": 0,
              "pnDepartmentId": 0,
              "pnDesingnationId": 0,
              "pnGradeId": 0,
              "pnShiftId": 0,
              "pnCategoryId": 0,
              "pnJobStatusId": 0,
              "pnLevelId": 0,
              "pnProjectsiteId": 0,
              "dDate": "2024-04-16T04:37:14.154Z",
              "vReason": "string",
              "rDepartment": 0,
              "paymCategory": "string",
              "paymDepartment": "string"
            }
          ],
          "pnCompany": "string"
        }
      ],
      "paymDeductions": [
        "string"
      ],
      "paymDepartments": [
        {
          "pnCompanyId": 0,
          "pnBranchId": 0,
          "pnDepartmentId": 0,
          "vDepartmentName": "string",
          "status": "string",
          "paymEmployeeProfile1s": [
            {
              "id": 0,
              "pnCompanyId": 0,
              "pnBranchId": 0,
              "pnEmployeeId": 0,
              "pnDivisionId": 0,
              "pnDepartmentId": 0,
              "pnDesingnationId": 0,
              "pnGradeId": 0,
              "pnShiftId": 0,
              "pnCategoryId": 0,
              "pnJobStatusId": 0,
              "pnLevelId": 0,
              "pnProjectsiteId": 0,
              "dDate": "2024-04-16T04:37:14.154Z",
              "vReason": "string",
              "rDepartment": 0,
              "paymCategory": "string",
              "paymDepartment": "string"
            }
          ],
          "pnCompany": "string"
        }
      ],
      "paymDesignations": [
        {
          "pnCompanyId": 0,
          "branchId": 0,
          "pnDesignationId": 0,
          "vDesignationName": "string",
          "authority": "string",
          "status": "string",
          "pnCompany": "string"
        }
      ],
      "paymDivisions": [
        {
          "pnCompanyId": 0,
          "branchId": 0,
          "pnDivisionId": 0,
          "vDivisionName": "string",
          "status": "string",
          "pnCompany": "string"
        }
      ],
      "paymEarnings": [
        "string"
      ],
      "paymGrades": [
        {
          "pnCompanyId": 0,
          "branchId": 0,
          "pnGradeId": 0,
          "vGradeName": "string",
          "status": "string",
          "pnCompany": "string"
        }
      ],
      "paymJobStatuses": [
        {
          "pnCompanyId": 0,
          "branchId": 0,
          "pnJobStatusId": 0,
          "vJobStatusName": "string",
          "status": "string",
          "pnCompany": "string"
        }
      ],
      "paymLeaves": [
        {
          "pnCompanyId": 0,
          "pnLeaveId": 0,
          "vLeaveName": "string",
          "pnLeaveCode": "string",
          "pnCount": 0,
          "status": "string",
          "pnBranchId": 0,
          "annualLeave": "string",
          "maxDays": 0,
          "el": "string",
          "type": "string",
          "pnCompany": "string"
        }
      ],
      "paymLevels": [
        {
          "pnCompanyId": 0,
          "branchId": 0,
          "pnLevelId": 0,
          "vLevelName": "string",
          "status": "string",
          "pnCompany": "string"
        }
      ],
      "paymLoans": [
        {
          "pnCompanyid": 0,
          "pnLoanId": 0,
          "vLoanName": "string",
          "vLoanCode": "string",
          "status": "string",
          "pnBranchId": 0,
          "loanEntries": [
            "string"
          ],
          "pnCompany": "string"
        }
      ],
      "paymOverHeadingCosts": [
        {
          "pnCompanyId": 0,
          "branchId": 0,
          "overHeadingId": 0,
          "overHeadingName": "string",
          "status": "string",
          "pnCompany": "string"
        }
      ],
      "paymShifts": [
        {
          "pnCompanyId": 0,
          "pnShiftId": 0,
          "vShiftName": "string",
          "vShiftFrom": "string",
          "vShiftTo": "string",
          "status": "string",
          "branchId": 0,
          "vShiftCategory": "string",
          "pnCompany": "string"
        }
      ]
    }
  },
  "paymEmpDeductions": [
    {
      "pnCompanyId": 0,
      "pnBranchId": 0,
      "pnEmployeeId": 0,
      "pnDeductionId": 0,
      "nAmount": 0,
      "dDate": "2024-04-16T04:37:14.154Z",
      "cEligible": "string",
      "fromDate": "2024-04-16T04:37:14.154Z",
      "toDate": "2024-04-16T04:37:14.154Z",
      "periodCode": "string",
      "paymBranch": "string",
      "paymDeduction": {
        "pnCompanyId": 0,
        "pnBranchId": 0,
        "pnDeductionId": 0,
        "vDeductionCode": "string",
        "vDeductionName": "string",
        "cRegular": "string",
        "cPrint": "string",
        "status": "string",
        "dOrder": 0,
        "paymEmpDeductions": [
          "string"
        ],
        "pnCompany": {
          "pnCompanyId": 0,
          "companyCode": "string",
          "companyName": "string",
          "addressLine1": "string",
          "addressLine2": "string",
          "city": "string",
          "zipCode": "string",
          "country": "string",
          "state": "string",
          "phoneNo": "string",
          "faxNo": "string",
          "emailId": "string",
          "alternateEmailId": "string",
          "pfno": "string",
          "esino": "string",
          "startDate": "2024-04-16T04:37:14.154Z",
          "endDate": "2024-04-16T04:37:14.154Z",
          "hrmmCourses": [
            {
              "pnCompanyId": 0,
              "pnCourseId": 0,
              "vCourseName": "string",
              "status": "string",
              "branchId": 0,
              "pnCompany": "string"
            }
          ],
          "hrmmSkillsMasters": [
            {
              "pnCompanyId": 0,
              "pnSkillId": 0,
              "vSkillName": "string",
              "status": "string",
              "branchId": 0,
              "pnCompany": "string"
            }
          ],
          "hrmmSpecializations": [
            {
              "pnCompanyId": 0,
              "pnSpecializationId": 0,
              "vSpecializationName": "string",
              "status": "string",
              "pnBranchId": 0,
              "pnCompany": "string"
            }
          ],
          "payOutputDeductions": [
            {
              "pnCompanyId": 0,
              "pnEmployeeId": 0,
              "pnDeductionId": 0,
              "pnDepartmentName": "string",
              "dDate": "2024-04-16T04:37:14.154Z",
              "dFromDate": "2024-04-16T04:37:14.154Z",
              "dToDate": "2024-04-16T04:37:14.154Z",
              "mode": "string",
              "flag": "string",
              "actAmount": 0,
              "amount": 0,
              "pnBranchId": 0,
              "pnCompany": "string"
            }
          ],
          "payOutputEsis": [
            {
              "pnCompanyId": 0,
              "pnEmployeeId": 0,
              "vEsino": "string",
              "dDate": "2024-04-16T04:37:14.154Z",
              "dFromDate": "2024-04-16T04:37:14.154Z",
              "dToDate": "2024-04-16T04:37:14.154Z",
              "netPay": 0,
              "esiEmp": 0,
              "esiEpr": 0,
              "paidDays": 0,
              "absentDays": 0,
              "weekOffDays": 0,
              "periodCode": "string",
              "pnBranchId": 0,
              "pnCompany": "string"
            }
          ],
          "payOutputNetPays": [
            {
              "pnCompanyId": 0,
              "pnBranchId": 0,
              "pnEmployeeId": 0,
              "dDate": "2024-04-16T04:37:14.154Z",
              "dFromDate": "2024-04-16T04:37:14.154Z",
              "dToDate": "2024-04-16T04:37:14.154Z",
              "earnActAmount": 0,
              "earnAmount": 0,
              "otAmt": 0,
              "dedActAmount": 0,
              "dedAmount": 0,
              "netPay": 0,
              "actBasic": 0,
              "earnedBasic": 0,
              "grossSalary": 0,
              "netSalary": 0,
              "periodCode": "string",
              "pnCompany": "string"
            }
          ],
          "payOutputPfs": [
            {
              "pnCompanyId": 0,
              "pnEmployeeId": 0,
              "vPfno": "string",
              "dDate": "2024-04-16T04:37:14.154Z",
              "dFromDate": "2024-04-16T04:37:14.154Z",
              "dToDate": "2024-04-16T04:37:14.154Z",
              "netPay": 0,
              "pf": 0,
              "totPf": 0,
              "epf": 0,
              "fpf": 0,
              "vpf": 0,
              "paidDays": 0,
              "absentDays": 0,
              "weekOffDays": 0,
              "periodCode": "string",
              "pnBranchId": 0,
              "pnCompany": "string"
            }
          ],
          "paymBranches": [
            "string"
          ],
          "paymCategories": [
            {
              "pnCompanyId": 0,
              "branchId": 0,
              "pnCategoryId": 0,
              "vCategoryName": "string",
              "status": "string",
              "paymEmployeeProfile1s": [
                {
                  "id": 0,
                  "pnCompanyId": 0,
                  "pnBranchId": 0,
                  "pnEmployeeId": 0,
                  "pnDivisionId": 0,
                  "pnDepartmentId": 0,
                  "pnDesingnationId": 0,
                  "pnGradeId": 0,
                  "pnShiftId": 0,
                  "pnCategoryId": 0,
                  "pnJobStatusId": 0,
                  "pnLevelId": 0,
                  "pnProjectsiteId": 0,
                  "dDate": "2024-04-16T04:37:14.154Z",
                  "vReason": "string",
                  "rDepartment": 0,
                  "paymCategory": "string",
                  "paymDepartment": "string"
                }
              ],
              "pnCompany": "string"
            }
          ],
          "paymDeductions": [
            "string"
          ],
          "paymDepartments": [
            {
              "pnCompanyId": 0,
              "pnBranchId": 0,
              "pnDepartmentId": 0,
              "vDepartmentName": "string",
              "status": "string",
              "paymEmployeeProfile1s": [
                {
                  "id": 0,
                  "pnCompanyId": 0,
                  "pnBranchId": 0,
                  "pnEmployeeId": 0,
                  "pnDivisionId": 0,
                  "pnDepartmentId": 0,
                  "pnDesingnationId": 0,
                  "pnGradeId": 0,
                  "pnShiftId": 0,
                  "pnCategoryId": 0,
                  "pnJobStatusId": 0,
                  "pnLevelId": 0,
                  "pnProjectsiteId": 0,
                  "dDate": "2024-04-16T04:37:14.154Z",
                  "vReason": "string",
                  "rDepartment": 0,
                  "paymCategory": "string",
                  "paymDepartment": "string"
                }
              ],
              "pnCompany": "string"
            }
          ],
          "paymDesignations": [
            {
              "pnCompanyId": 0,
              "branchId": 0,
              "pnDesignationId": 0,
              "vDesignationName": "string",
              "authority": "string",
              "status": "string",
              "pnCompany": "string"
            }
          ],
          "paymDivisions": [
            {
              "pnCompanyId": 0,
              "branchId": 0,
              "pnDivisionId": 0,
              "vDivisionName": "string",
              "status": "string",
              "pnCompany": "string"
            }
          ],
          "paymEarnings": [
            "string"
          ],
          "paymGrades": [
            {
              "pnCompanyId": 0,
              "branchId": 0,
              "pnGradeId": 0,
              "vGradeName": "string",
              "status": "string",
              "pnCompany": "string"
            }
          ],
          "paymJobStatuses": [
            {
              "pnCompanyId": 0,
              "branchId": 0,
              "pnJobStatusId": 0,
              "vJobStatusName": "string",
              "status": "string",
              "pnCompany": "string"
            }
          ],
          "paymLeaves": [
            {
              "pnCompanyId": 0,
              "pnLeaveId": 0,
              "vLeaveName": "string",
              "pnLeaveCode": "string",
              "pnCount": 0,
              "status": "string",
              "pnBranchId": 0,
              "annualLeave": "string",
              "maxDays": 0,
              "el": "string",
              "type": "string",
              "pnCompany": "string"
            }
          ],
          "paymLevels": [
            {
              "pnCompanyId": 0,
              "branchId": 0,
              "pnLevelId": 0,
              "vLevelName": "string",
              "status": "string",
              "pnCompany": "string"
            }
          ],
          "paymLoans": [
            {
              "pnCompanyid": 0,
              "pnLoanId": 0,
              "vLoanName": "string",
              "vLoanCode": "string",
              "status": "string",
              "pnBranchId": 0,
              "loanEntries": [
                "string"
              ],
              "pnCompany": "string"
            }
          ],
          "paymOverHeadingCosts": [
            {
              "pnCompanyId": 0,
              "branchId": 0,
              "overHeadingId": 0,
              "overHeadingName": "string",
              "status": "string",
              "pnCompany": "string"
            }
          ],
          "paymShifts": [
            {
              "pnCompanyId": 0,
              "pnShiftId": 0,
              "vShiftName": "string",
              "vShiftFrom": "string",
              "vShiftTo": "string",
              "status": "string",
              "branchId": 0,
              "vShiftCategory": "string",
              "pnCompany": "string"
            }
          ]
        }
      },
      "paymEmployee": "string"
    }
  ],
  "paymEmpEarnings": [
    {
      "pnCompanyId": 0,
      "pnBranchId": 0,
      "pnEmployeeId": 0,
      "pnEarningsId": 0,
      "pid": 0,
      "id": 0,
      "nAmount": 0,
      "dDate": "2024-04-16T04:37:14.154Z",
      "cEligible": "string",
      "fromDate": "2024-04-16T04:37:14.154Z",
      "toDate": "2024-04-16T04:37:14.154Z",
      "flag": "string",
      "paymBranch": "string",
      "paymEarning": {
        "pnCompanyId": 0,
        "pnEarningsId": 0,
        "vEarningsCode": "string",
        "vEarningsName": "string",
        "cRegular": "string",
        "cPf": "string",
        "cEsi": "string",
        "cOt": "string",
        "cLop": "string",
        "cPt": "string",
        "cPrint": "string",
        "payslip": "string",
        "status": "string",
        "dOrder": 0,
        "pnBranchId": 0,
        "paymEmpEarnings": [
          "string"
        ],
        "pnCompany": {
          "pnCompanyId": 0,
          "companyCode": "string",
          "companyName": "string",
          "addressLine1": "string",
          "addressLine2": "string",
          "city": "string",
          "zipCode": "string",
          "country": "string",
          "state": "string",
          "phoneNo": "string",
          "faxNo": "string",
          "emailId": "string",
          "alternateEmailId": "string",
          "pfno": "string",
          "esino": "string",
          "startDate": "2024-04-16T04:37:14.154Z",
          "endDate": "2024-04-16T04:37:14.154Z",
          "hrmmCourses": [
            {
              "pnCompanyId": 0,
              "pnCourseId": 0,
              "vCourseName": "string",
              "status": "string",
              "branchId": 0,
              "pnCompany": "string"
            }
          ],
          "hrmmSkillsMasters": [
            {
              "pnCompanyId": 0,
              "pnSkillId": 0,
              "vSkillName": "string",
              "status": "string",
              "branchId": 0,
              "pnCompany": "string"
            }
          ],
          "hrmmSpecializations": [
            {
              "pnCompanyId": 0,
              "pnSpecializationId": 0,
              "vSpecializationName": "string",
              "status": "string",
              "pnBranchId": 0,
              "pnCompany": "string"
            }
          ],
          "payOutputDeductions": [
            {
              "pnCompanyId": 0,
              "pnEmployeeId": 0,
              "pnDeductionId": 0,
              "pnDepartmentName": "string",
              "dDate": "2024-04-16T04:37:14.154Z",
              "dFromDate": "2024-04-16T04:37:14.154Z",
              "dToDate": "2024-04-16T04:37:14.154Z",
              "mode": "string",
              "flag": "string",
              "actAmount": 0,
              "amount": 0,
              "pnBranchId": 0,
              "pnCompany": "string"
            }
          ],
          "payOutputEsis": [
            {
              "pnCompanyId": 0,
              "pnEmployeeId": 0,
              "vEsino": "string",
              "dDate": "2024-04-16T04:37:14.154Z",
              "dFromDate": "2024-04-16T04:37:14.154Z",
              "dToDate": "2024-04-16T04:37:14.154Z",
              "netPay": 0,
              "esiEmp": 0,
              "esiEpr": 0,
              "paidDays": 0,
              "absentDays": 0,
              "weekOffDays": 0,
              "periodCode": "string",
              "pnBranchId": 0,
              "pnCompany": "string"
            }
          ],
          "payOutputNetPays": [
            {
              "pnCompanyId": 0,
              "pnBranchId": 0,
              "pnEmployeeId": 0,
              "dDate": "2024-04-16T04:37:14.154Z",
              "dFromDate": "2024-04-16T04:37:14.154Z",
              "dToDate": "2024-04-16T04:37:14.154Z",
              "earnActAmount": 0,
              "earnAmount": 0,
              "otAmt": 0,
              "dedActAmount": 0,
              "dedAmount": 0,
              "netPay": 0,
              "actBasic": 0,
              "earnedBasic": 0,
              "grossSalary": 0,
              "netSalary": 0,
              "periodCode": "string",
              "pnCompany": "string"
            }
          ],
          "payOutputPfs": [
            {
              "pnCompanyId": 0,
              "pnEmployeeId": 0,
              "vPfno": "string",
              "dDate": "2024-04-16T04:37:14.154Z",
              "dFromDate": "2024-04-16T04:37:14.154Z",
              "dToDate": "2024-04-16T04:37:14.154Z",
              "netPay": 0,
              "pf": 0,
              "totPf": 0,
              "epf": 0,
              "fpf": 0,
              "vpf": 0,
              "paidDays": 0,
              "absentDays": 0,
              "weekOffDays": 0,
              "periodCode": "string",
              "pnBranchId": 0,
              "pnCompany": "string"
            }
          ],
          "paymBranches": [
            "string"
          ],
          "paymCategories": [
            {
              "pnCompanyId": 0,
              "branchId": 0,
              "pnCategoryId": 0,
              "vCategoryName": "string",
              "status": "string",
              "paymEmployeeProfile1s": [
                {
                  "id": 0,
                  "pnCompanyId": 0,
                  "pnBranchId": 0,
                  "pnEmployeeId": 0,
                  "pnDivisionId": 0,
                  "pnDepartmentId": 0,
                  "pnDesingnationId": 0,
                  "pnGradeId": 0,
                  "pnShiftId": 0,
                  "pnCategoryId": 0,
                  "pnJobStatusId": 0,
                  "pnLevelId": 0,
                  "pnProjectsiteId": 0,
                  "dDate": "2024-04-16T04:37:14.154Z",
                  "vReason": "string",
                  "rDepartment": 0,
                  "paymCategory": "string",
                  "paymDepartment": "string"
                }
              ],
              "pnCompany": "string"
            }
          ],
          "paymDeductions": [
            "string"
          ],
          "paymDepartments": [
            {
              "pnCompanyId": 0,
              "pnBranchId": 0,
              "pnDepartmentId": 0,
              "vDepartmentName": "string",
              "status": "string",
              "paymEmployeeProfile1s": [
                {
                  "id": 0,
                  "pnCompanyId": 0,
                  "pnBranchId": 0,
                  "pnEmployeeId": 0,
                  "pnDivisionId": 0,
                  "pnDepartmentId": 0,
                  "pnDesingnationId": 0,
                  "pnGradeId": 0,
                  "pnShiftId": 0,
                  "pnCategoryId": 0,
                  "pnJobStatusId": 0,
                  "pnLevelId": 0,
                  "pnProjectsiteId": 0,
                  "dDate": "2024-04-16T04:37:14.154Z",
                  "vReason": "string",
                  "rDepartment": 0,
                  "paymCategory": "string",
                  "paymDepartment": "string"
                }
              ],
              "pnCompany": "string"
            }
          ],
          "paymDesignations": [
            {
              "pnCompanyId": 0,
              "branchId": 0,
              "pnDesignationId": 0,
              "vDesignationName": "string",
              "authority": "string",
              "status": "string",
              "pnCompany": "string"
            }
          ],
          "paymDivisions": [
            {
              "pnCompanyId": 0,
              "branchId": 0,
              "pnDivisionId": 0,
              "vDivisionName": "string",
              "status": "string",
              "pnCompany": "string"
            }
          ],
          "paymEarnings": [
            "string"
          ],
          "paymGrades": [
            {
              "pnCompanyId": 0,
              "branchId": 0,
              "pnGradeId": 0,
              "vGradeName": "string",
              "status": "string",
              "pnCompany": "string"
            }
          ],
          "paymJobStatuses": [
            {
              "pnCompanyId": 0,
              "branchId": 0,
              "pnJobStatusId": 0,
              "vJobStatusName": "string",
              "status": "string",
              "pnCompany": "string"
            }
          ],
          "paymLeaves": [
            {
              "pnCompanyId": 0,
              "pnLeaveId": 0,
              "vLeaveName": "string",
              "pnLeaveCode": "string",
              "pnCount": 0,
              "status": "string",
              "pnBranchId": 0,
              "annualLeave": "string",
              "maxDays": 0,
              "el": "string",
              "type": "string",
              "pnCompany": "string"
            }
          ],
          "paymLevels": [
            {
              "pnCompanyId": 0,
              "branchId": 0,
              "pnLevelId": 0,
              "vLevelName": "string",
              "status": "string",
              "pnCompany": "string"
            }
          ],
          "paymLoans": [
            {
              "pnCompanyid": 0,
              "pnLoanId": 0,
              "vLoanName": "string",
              "vLoanCode": "string",
              "status": "string",
              "pnBranchId": 0,
              "loanEntries": [
                "string"
              ],
              "pnCompany": "string"
            }
          ],
          "paymOverHeadingCosts": [
            {
              "pnCompanyId": 0,
              "branchId": 0,
              "overHeadingId": 0,
              "overHeadingName": "string",
              "status": "string",
              "pnCompany": "string"
            }
          ],
          "paymShifts": [
            {
              "pnCompanyId": 0,
              "pnShiftId": 0,
              "vShiftName": "string",
              "vShiftFrom": "string",
              "vShiftTo": "string",
              "status": "string",
              "branchId": 0,
              "vShiftCategory": "string",
              "pnCompany": "string"
            }
          ]
        }
      },
      "paymEmployee": "string"
    }
  ],
  "paymEmployeeWorkDetail": {
    "pnCompanyId": 0,
    "pnBranchId": 0,
    "pnEmployeeId": 0,
    "joiningDate": "2024-04-16T04:37:14.155Z",
    "offerDate": "2024-04-16T04:37:14.155Z",
    "probationUpto": "2024-04-16T04:37:14.155Z",
    "extendedUpto": "2024-04-16T04:37:14.155Z",
    "confirmationDate": "2024-04-16T04:37:14.155Z",
    "retirementDate": "2024-04-16T04:37:14.155Z",
    "contractRenviewDate": "2024-04-16T04:37:14.155Z",
    "vReason": "string",
    "paymEmployee": "string"
  }
}

alert(obj)

postRequest(ServerConfig.url,PAYMEMPLOYEE,obj).then((e)=>console.log(e)).catch((e)=>console.log(e))




        }} id="frmemployee">
         
          <Grid container spacing={2} columns={12} >
          <Grid xs={12} sm={5}>
           <Select id="companyId" onChange={(e)=>{
            e.preventDefault()
            setCompanyId(e.target.value)
           }}>
             {
          companydata.map((e)=>{
            return <MenuItem value={e.pnCompanyId}>{e.pnCompanyId}</MenuItem>
          })
        }
            </Select>  
          </Grid>
          <Grid xs={12} sm={5}>
           <Select id="branchId" onChange={(e)=>{setBranchId(e.target.value)}}>
        {
          branchData.map((e)=>{
            return <MenuItem value={e.pnBranchId}>{e.pnBranchId}</MenuItem>
          })
        }
            </Select>  
          </Grid>
            {
            inputpaymEmployeeForm.map(input=> <Grid xs={input.xs} sm={input.sm} item>
                              <TextField {...input}  InputLabelProps={{shrink:true}}
                                 
                            ></TextField>
           </Grid>
          )
       
            }
             <Grid container spacing={1}>
             <Grid item xs={12} align="right">
              <Button type="reset" variant="contained" color="primary"style={{paddingRight:'3'}} >Reset</Button>
            <Button  type="submit" variant="contained" color="primary"
          
        
            >Submit</Button>
              </Grid>
            </Grid>
           
          </Grid>
        </form>
        </CardContent>
        </Card>
        </Grid>
      </div>
    );
  }
  const mapStateToProps=(state)=>({state:state})
const mapDispatchToProps=(dispatch)=>({dispatch:dispatch})
 export default (connect)(mapStateToProps,mapDispatchToProps)(EmployeeForm)