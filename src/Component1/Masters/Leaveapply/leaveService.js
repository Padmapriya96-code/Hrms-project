// src/services/leaveService.js
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";

const dbname = () => sessionStorage.getItem("databaseName");

export async function createLeaveMaster(payload) {
  // payload: { pn_CompanyID, pn_BranchID, v_leaveName, pn_leaveCode, pn_Count, max_days, Type }
  const q = `
    INSERT INTO [${dbname()}].[dbo].[paym_leave]
      (pn_CompanyID, pn_BranchID, v_leaveName, pn_leaveCode, pn_Count, max_days, Type, status)
    VALUES
      (${payload.pn_CompanyID}, ${payload.pn_BranchID}, '${payload.v_leaveName}', '${payload.pn_leaveCode}', ${payload.pn_Count}, ${payload.max_days}, '${payload.Type}', 'Active')
  `;
  return postRequest(ServerConfig.url, SAVE, { query: q });
}

/**
 * When a new leave master is created, create encashment rows for employees in that company/branch.
 * This inserts entries into paym_EncashmentDetails for all employees OR for a single employee depending on params.
 */
export async function createEncashmentForNewLeave({ pn_CompanyID, pn_BranchID, pn_LeaveId, allowDays }) {
  // Create encashment entries for all active employees in the branch/company
  const q = `
    INSERT INTO [${dbname()}].[dbo].[paym_EncashmentDetails]
      (pn_CompanyId, pn_BranchId, pn_EmployeeId, Pn_LeaveId, Allow_Days, Taken_Days, Bal_Days, [Date], YearEnd)
    SELECT 
      E.pn_CompanyID,
      E.pn_BranchID,
      E.pn_EmployeeID,
      ${pn_LeaveId},
      ${allowDays},
      0,
      ${allowDays},
      GETDATE(),
      NULL
    FROM [${dbname()}].[dbo].[paym_Employee] E
    WHERE E.pn_CompanyID = ${pn_CompanyID}
      AND E.pn_BranchID = ${pn_BranchID}
      -- optionally filter active employees
  `;
  return postRequest(ServerConfig.url, SAVE, { query: q });
}

/**
 * Employee applies leave (inserts into leave_apply). Use existing validations in UI.
 * payload should match leave_apply columns used in earlier code.
 */
export async function applyLeave(payload) {
  // payload contains the fields used in your earlier insert (employee object, LeaveId, leaveCode, dates, days, reason, fileHex maybe)
  const {
    pn_CompanyID, pn_BranchID, pn_EmployeeID, Emp_code, Emp_name,
    pn_LeaveID, pn_Leavename, pn_leavecode,
    fromDate, toDate, days, reason, fileHex
  } = payload;

  const fileVal = fileHex ? `CONVERT(varbinary(max), '0x${fileHex}', 1)` : "NULL";

  const q = `
    INSERT INTO [${dbname()}].[dbo].[leave_apply]
    ([pn_CompanyID],[pn_BranchID],[pn_EmployeeID],[Emp_code],[Emp_name],
     [pn_LeaveID],[pn_Leavename],[pn_leavecode],
     [from_date],[from_status],[to_date],[status],
     [days],[reason],[submitted_date],[approve],
     [reminder],[priority],[comments],[record],[flag],[yearend],[attachfile])
    VALUES
    (${pn_CompanyID},${pn_BranchID},${pn_EmployeeID},'${Emp_code}','${Emp_name}',
     ${pn_LeaveID},'${pn_Leavename}','${pn_leavecode}',
     '${fromDate}','P','${toDate}','P',
     ${days},'${reason}',GETDATE(), 'Pending', GETDATE(), 'NULL', 'None','NULL','N',NULL, ${fileVal}
    );
  `;
  return postRequest(ServerConfig.url, SAVE, { query: q });
}

/**
 * HR approves a leave (set status = 'A') and then recalculates encashment details for that employee.
 * Approve by leave_apply record identifier (you might use sno or primary id column)
 */
export async function approveLeaveAndRecalc({ leaveApplyId /* primary key or sno */, approverName }) {
  // 1) Update leave_apply -> status 'A' and set approve
  const updateQ = `
    UPDATE [${dbname()}].[dbo].[leave_apply]
    SET [status] = 'A', approve = '${approverName}', submitted_date = submitted_date
    WHERE sno = ${leaveApplyId}
  `;
  await postRequest(ServerConfig.url, SAVE, { query: updateQ });

  // 2) Recalculate taken days per leave type for that employee and update paym_EncashmentDetails
  // We will:
  //   a) get employee id and pn_LeaveID from the updated leave_apply row
  //   b) sum approved days from leave_apply for that employee + leave type
  //   c) update or insert paym_EncashmentDetails accordingly.

  const fetchMetaQ = `
    SELECT pn_EmployeeID, pn_CompanyID, pn_BranchID, pn_LeaveID
    FROM [${dbname()}].[dbo].[leave_apply]
    WHERE sno = ${leaveApplyId};
  `;
  const metaRes = await postRequest(ServerConfig.url, REPORTS, { query: fetchMetaQ });
  if (!metaRes.data || metaRes.data.length === 0) throw new Error("leave_apply not found");

  const meta = metaRes.data[0];
  const { pn_EmployeeID, pn_CompanyID, pn_BranchID, pn_LeaveID } = meta;

  // b) sum approved days for this employee & leave id
  const takenQ = `
    SELECT ISNULL(SUM(days),0) AS TakenDays
    FROM [${dbname()}].[dbo].[leave_apply]
    WHERE pn_EmployeeID = ${pn_EmployeeID}
      AND pn_LeaveID = ${pn_LeaveID}
      AND status = 'A'
  `;
  const takenRes = await postRequest(ServerConfig.url, REPORTS, { query: takenQ });
  const takenDays = takenRes.data[0]?.TakenDays ?? 0;

  // fetch allowed days from paym_leave
  const allowQ = `
    SELECT pn_Count
    FROM [${dbname()}].[dbo].[paym_leave]
    WHERE pn_CompanyID = ${pn_CompanyID}
      AND pn_BranchID = ${pn_BranchID}
      AND pn_leaveID = ${pn_LeaveID}
  `;
  const allowRes = await postRequest(ServerConfig.url, REPORTS, { query: allowQ });
  const allowDays = allowRes.data[0]?.pn_Count ?? 0;

  const balDays = allowDays - takenDays;

  // Upsert into paym_EncashmentDetails
  // If row exists update, else insert
  const upsertQ = `
    IF EXISTS (
      SELECT 1 FROM [${dbname()}].[dbo].[paym_EncashmentDetails]
      WHERE pn_EmployeeId = ${pn_EmployeeID} AND Pn_LeaveId = ${pn_LeaveID}
    )
    BEGIN
      UPDATE [${dbname()}].[dbo].[paym_EncashmentDetails]
      SET Taken_Days = ${takenDays}, Allow_Days = ${allowDays}, Bal_Days = ${balDays}, [Date] = GETDATE()
      WHERE pn_EmployeeId = ${pn_EmployeeID} AND Pn_LeaveId = ${pn_LeaveID}
    END
    ELSE
    BEGIN
      INSERT INTO [${dbname()}].[dbo].[paym_EncashmentDetails]
        (pn_CompanyId, pn_BranchId, pn_EmployeeId, Pn_LeaveId, Allow_Days, Taken_Days, Bal_Days, [Date])
      VALUES
        (${pn_CompanyID}, ${pn_BranchID}, ${pn_EmployeeID}, ${pn_LeaveID}, ${allowDays}, ${takenDays}, ${balDays}, GETDATE())
    END
  `;
  return postRequest(ServerConfig.url, SAVE, { query: upsertQ });
}

/**
 * Fetch leave balances for an employee (reads paym_EncashmentDetails joined with paym_leave)
 */
export async function fetchLeaveBalancesForEmployee(pn_EmployeeId) {
  const q = `
    SELECT 
      E.pn_EmployeeId,
      EMP.Employee_Full_Name, 
      E.Pn_LeaveId,
      L.v_leaveName,
      E.Allow_Days,
      E.Taken_Days,
      E.Bal_Days
    FROM [${dbname()}].[dbo].[paym_EncashmentDetails] E
    JOIN [${dbname()}].[dbo].[paym_Employee] EMP ON EMP.pn_EmployeeID = E.pn_EmployeeId
    JOIN [${dbname()}].[dbo].[paym_Leave] L ON L.pn_leaveID = E.Pn_LeaveId
    WHERE E.pn_EmployeeId = ${pn_EmployeeId}
  `;
  return postRequest(ServerConfig.url, REPORTS, { query: q });
}
