import React, { useState, useEffect, useMemo, useCallback,useRef } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  MenuItem,
  Paper,
  FormControl,
  Select,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";
import { postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../serverconfiguration/controllers";
import Navbar from "../Home Page-comapny/Navbar1";
import Sidenav from "../Home Page-comapny/Sidenav1";
import { ca } from "date-fns/locale";
import axios from "axios";

const DivisionMaster = () => {
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [openView, setOpenView] = useState(false);
  const [viewData, setViewData] = useState(null);
  const authStr=sessionStorage.getItem("auth");
  const auth=authStr?JSON.parse(authStr):null;
  const token=auth?.token;
  ServerConfig.url = "https://localhost:7266/api";
  

  // 🔽 Status utility
  const getStatusLabel = (char) => {
    switch (char) {
      case "A":
        return "Active";
      case "I":
        return "Inactive";
      case "P":
        return "Pending";
      default:
        return "";
    }
  };

  const getStatusChar = (label) => {
    switch (label) {
      case "Active":
        return "A";
      case "Inactive":
        return "I";
      case "Pending":
        return "P";
      default:
        return "";
    }
  };

  // 🔽 Fetch data
  // const fetchCompanyData = async () => {
  //   const isloggedin = sessionStorage.getItem("user");
  //   const companyData = await postRequest(ServerConfig.url, REPORTS, {
  //     query: `SELECT * FROM [${databaseName}].[dbo].[paym_Company] WHERE company_user_id = '${isloggedin}'`,
  //   });
  //   setCompany(companyData.data);
  //   if (companyData.data.length > 0) {
  //     setPnCompanyId(companyData.data[0].pn_CompanyID);
  //     setCompanyName(companyData.data[0].CompanyName);
  //   }
  // };
  const fetchCompanyData = async () => {
    if(!token){
      toast.error("User not logged in");
      return;
    }
    try{
      console.log("Fetching company data...");
      const res=await axios.get(`${ServerConfig.url}/PaymCompanies/by-user`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      console.log("Company Data Fetched:", res.data);
      setCompany(res.data);
      if(res.data.length>0){
        const companyId = res.data[0].pnCompanyId || res.data[0].PnCompanyId;
        setPnCompanyId(companyId);
        console.log("Company ID set to:", companyId);
        setCompanyName(res.data[0].companyName || res.data[0].CompanyName);
      }
    }catch(error){
      console.error("Failed to fetch company",{
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
    };

  const fetchBranchData = async () => {
  // ✅ Stop if companyId is missing
  if (!pnCompanyId) {
    console.log("Skipping branch fetch - no pnCompanyId");
    return;
  }

  // ✅ Stop if token is missing
  if (!token) {
    toast.error("User not logged in");
    return;
  }

  try {
    console.log("Fetching branches for company:", pnCompanyId);
    const res = await axios.get(
      `${ServerConfig.url}/PaymBranches/by-company/${pnCompanyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("Branch Data Fetched:", res.data);
    const normalized = res.data.map(b => ({
      pnBranchId: b.pnBranchId || b.PnBranchId,
      branchName: b.branchName || b.BranchName
    }));
    console.log("Normalized Branch Data:", normalized);
    setBranch(normalized);
  } catch (error) {
    console.error(
      "Failed to fetch branch",
      {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      }
    );
  }
};

  useEffect(() => {
  fetchBranchData();
}, [pnCompanyId]);

  

  const fetchDivisionData = async () => {
    if (!pnCompanyId||!token) {
      console.log("Skipping fetchDivisionData - Missing pnCompanyId or token", { pnCompanyId, token: !!token });
      return;
    }
    try
    {
      console.log("Fetching divisions for company:", pnCompanyId);
      const response=await axios.get(`${ServerConfig.url}/PaymDivisions/by-company/${pnCompanyId}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      console.log("Division API Response:", response);
      console.log("Division Data Fetched:", response.data);
      const formatted = response.data.map((item) => ({
        pnCompanyId: item.pnCompanyId,
        branchId: item.branchId,
        pnDivisionId: item.pnDivisionId,
        vDivisionName: item.vDivisionName,
        status: getStatusLabel(item.status),
      }));
      console.log("Formatted Division Data:", formatted);
      
      // Only overwrite gridData if it doesn't have new unsaved rows
      setGridData((prevData) => {
        const hasNewRows = prevData.some(row => row.isNew);
        if (hasNewRows) {
          console.log("Grid has new unsaved rows, preserving them");
          // Keep new rows and only update existing rows
          const newRows = prevData.filter(row => row.isNew);
          return [...formatted, ...newRows];
        }
        return formatted;
      });
      
      setOriginalData(JSON.parse(JSON.stringify(formatted)));
      console.log("🔴 Resetting modifiedRows to empty object");
      setModifiedRows({});
    }
    catch(error){
      console.error("failed to fetch division", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: `${ServerConfig.url}/PaymDivisions/by-company/${pnCompanyId}`
      });
    }

  };

  const fetchAllData = async () => {
    await fetchCompanyData();
    await fetchBranchData();
    await fetchDivisionData();
  };

  useEffect(() => {
    fetchAllData();
  }, [pnCompanyId]);

  useEffect(() => {
    console.log("gridData updated:", gridData);
  }, [gridData]);

  // // 🔽 Check if row is modified
  // const isRowModified = useCallback(
  //   (rowData) => {
  //     if (rowData.isNew) return false;
  //     const originalRow = originalData.find(
  //       (item) => item.pnDivisionId === rowData.pnDivisionId
  //     );
  //     if (!originalRow) return false;
  //     return (
  //       String(originalRow.branchId) !== String(rowData.branchId) ||
  //       String(originalRow.vDivisionName) !== String(rowData.vDivisionName) ||
  //       String(originalRow.status) !== String(rowData.status)
  //     );
  //   },
  //   [originalData]

  // );
  const isRowModified = useCallback(
  (rowData) => {
    // 🔹 New rows are handled by "Save All"
    if (!rowData || rowData.isNew) return false;

    // 🔹 Find original snapshot
    const originalRow = originalData.find(
      (item) =>
        String(item.pnDivisionId) === String(rowData.pnDivisionId)
    );

    if (!originalRow) return false;

    // 🔹 Compare field-by-field (string-safe)
    return (
      String(originalRow.branchId ?? "") !== String(rowData.branchId ?? "") ||
      String(originalRow.vDivisionName ?? "") !== String(rowData.vDivisionName ?? "") ||
      String(originalRow.status ?? "") !== String(rowData.status ?? "")
    );
  },
  [originalData]
);


  // const handleCellValueChanged = useCallback(
  //   (params) => {
  //     const rowData = params.data;

  //     if (!rowData.isNew) {
  //       const modified = isRowModified(rowData);
  //       setModifiedRows((prev) => ({
  //         ...prev,
  //         [rowData.pnDivisionId]: modified,
  //       }));
  //     }
  //     params.api.refreshCells({ rowNodes: [params.node], force: true });
  //   },
  //   [isRowModified]
  // );
  const handleCellEditingStopped = useCallback((params) => {
    const rowData = params.data;
    const colDef = params.colDef;

    console.log("handleCellEditingStopped fired");
    console.log("  field:", colDef?.field);
    console.log("  branchId value:", rowData.branchId, "type:", typeof rowData.branchId);
    console.log("  branch array length:", branchRef?.current?.length ?? 0);

    // Only handle Branch column conversions
    if (colDef?.field === "branchId") {
      const incoming = params.newValue ?? params.value ?? rowData.branchId;

      if (typeof incoming !== "string") return; // already an id or empty

      console.log("handleCellEditingStopped - Converting branch name to ID", incoming);

      const selected = (branchRef.current || []).find((b) => b.branchName === incoming);
      console.log("  selected:", selected);

      if (selected) {
        rowData.branchId = selected.pnBranchId;
        
        // 🔹 Mark row as modified after branch conversion
        if (!rowData.isNew) {
          setModifiedRows(prev => ({
            ...prev,
            [rowData.pnDivisionId]: true
          }));
          console.log("  ✅ Row marked as modified:", rowData.pnDivisionId);
        }
        
        setTimeout(() => {
          params.api.refreshCells({ rowNodes: [params.node], force: true });
        }, 0);
      } else {
        console.warn("  FAILED: Branch not found:", incoming);
      }
    }
  }, []);

  const handleCellValueChanged = useCallback(
  (params) => {
    const rowData = params.data;
    const colDef = params.colDef;

    // 🔹 Ignore brand-new rows (handled by Save All)
    if (!rowData || rowData.isNew) return;

    // 🔹 For existing rows, ANY cell change marks it as modified
    // This ensures branch selection immediately enables the Edit button
    setModifiedRows((prev) => ({
      ...prev,
      [rowData.pnDivisionId]: true
    }));

    console.log("Row marked as modified:", rowData.pnDivisionId, "Field:", colDef?.field, "Value:", rowData[colDef?.field]);

    // 🔹 Force refresh so Edit button enables/disables instantly
    params.api.refreshCells({
      rowNodes: [params.node],
      force: true,
      columns: ["actions"],
    });
  },
  []
);



  const handleAddRow = () => {
    console.log("handleAddRow called, current gridData:", gridData);
    
    const newRow = { pnCompanyId, branchId: null, vDivisionName: "", status: "Active", isNew: true };
    console.log("Adding new row:", newRow);
    setGridData((prev) => {
      console.log("setGridData - previous state:", prev);
      const updated = [...prev, newRow];
      console.log("setGridData - new state:", updated);
      return updated;
    });
  };

  // const handleSaveAll = async () => {
  //   try {
  //     toast.dismiss();
  //     const newRows = gridData.filter((row) => row.isNew);
  //     if (newRows.length === 0) {
  //       toast.error("No new data to save", { position: "top-center", autoClose: 1000 });
  //       return;
  //     }
  //     for (const row of newRows) {
  //       if (!row.branchId || !row.vDivisionName || !row.status) {
  //         toast.error("Please fill all fields for new rows before saving.", { position: "top-center", autoClose: 1000 });
  //         return;
  //       }
  //     }
  //     const queries = newRows.map((row) => {
  //       const statusChar = getStatusChar(row.status);
  //       return `INSERT INTO [${databaseName}].[dbo].[paym_Division] 
  //       (pn_CompanyID, BranchID, v_DivisionName, status)
  //       VALUES ('${row.pnCompanyId}', '${row.branchId}', '${row.vDivisionName}', '${statusChar}')`;
  //     });
  //     await Promise.all(queries.map((q) => postRequest(ServerConfig.url, SAVE, { query: q })));
  //     toast.success("Data saved successfully", { position: "top-center", autoClose: 1000 });
  //     await fetchAllData();
  //   } catch (error) {
  //     toast.error("Failed to save data", { position: "top-center", autoClose: 1000 });
  //   }
  // };
  const handleSaveAll = async () => {
  try {
    toast.dismiss();

    // 1️⃣ Get only new rows
    const newRows = gridData.filter((row) => row.isNew);

    if (newRows.length === 0) {
      toast.error("No new data to save", {
        position: "top-center",
        autoClose: 1000
      });
      return;
    }

    // 2️⃣ Validate required fields (give detailed feedback)
    const errors = [];
    newRows.forEach((row, idx) => {
      const missing = [];
      if (!row.branchId) missing.push("Branch");
      if (!row.vDivisionName) missing.push("Division Name");
      if (!row.status) missing.push("Status");
      if (missing.length) {
        // try to show branch name if available to help identify
        const label = row.vDivisionName || getBranchNameFromId(row.branchId) || `Row ${idx + 1}`;
        errors.push(`${label}: ${missing.join(", ")}`);
      }
    });

    if (errors.length) {
      toast.error(`Please fill required fields -> ${errors.join("; ")}`, { position: "top-center", autoClose: 2500 });
      return;
    }

    // 3️⃣ Prepare payload (DATA ONLY 🔥)
    const payload = newRows.map((row) => ({
      pnCompanyId: row.pnCompanyId,
      branchId: row.branchId,
      vDivisionName: row.vDivisionName,
      status: getStatusChar(row.status) // "A" / "I"
    }));

    // 4️⃣ Call bulk API
    await axios.post(
      `${ServerConfig.url}/PaymDivisions/bulk`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Data saved successfully", {
      position: "top-center",
      autoClose: 1000
    });

    // 5️⃣ Reload grid
    await fetchAllData();
  } catch (error) {
    console.error(error);
    if (error.response?.status === 401) {
      toast.error("Session expired or unauthorized. Please log in again.", { position: "top-center", autoClose: 2000 });
      sessionStorage.removeItem("auth");
      return;
    }
    toast.error("Failed to save data", { position: "top-center", autoClose: 1000 });
  }
};

  // const handleUpdateRow = async (rowData) => {
  //   try {
  //     const statusChar = getStatusChar(rowData.status);
  //     const query = `UPDATE [${databaseName}].[dbo].[paym_Division]
  //              SET BranchID='${rowData.BranchID}', 
  //                  v_DivisionName='${rowData.v_DivisionName}', 
  //                  status='${statusChar}' 
  //              WHERE pn_DivisionID='${rowData.pn_DivisionID}'`;

  //     await postRequest(ServerConfig.url, SAVE, { query });
  //     setModifiedRows((prev) => {
  //       const newModified = { ...prev };
  //       delete newModified[rowData.pn_DivisionID];
  //       return newModified;
  //     });
  //     toast.success("Data updated successfully", { position: "top-center", autoClose: 1000 });
  //     await fetchAllData();
  //   } catch (error) {
  //     toast.error("Failed to update data", { position: "top-center", autoClose: 1000 });
  //   }
  // };


// const handleUpdateRow = async (rowData) => {
//   try {
//     toast.dismiss();

//     // If this is a new row that hasn't been saved yet, instruct user
//     if (rowData?.isNew) {
//       toast.info("This is a new row. Use 'Save All' to persist.", { position: "top-center", autoClose: 1500 });
//       return;
//     }

//     // If nothing modified, inform user
//     if (!modifiedRows[rowData.pnDivisionId]) {
//       toast.info("No changes to update", { position: "top-center", autoClose: 1000 });
//       return;
//     }

//     // 1️⃣ Validate required fields
//     if (!rowData.branchId || !rowData.vDivisionName || !rowData.status) {
//       toast.error("Please fill all required fields", {
//         position: "top-center",
//         autoClose: 1000
//       });
//       return;
//     }

//     // 2️⃣ Prepare FULL payload (important!)
//     const payload = {
//       pnDivisionId: rowData.pnDivisionId,   // PK
//       pnCompanyId: rowData.pnCompanyId,     // REQUIRED
//       branchId: rowData.branchId,
//       vDivisionName: rowData.vDivisionName,
//       status: getStatusChar(rowData.status) // "A" / "I"
//     };

//     // 3️⃣ Call PUT API
//     await axios.put(
//       `${ServerConfig.url}/PaymDivisions/${rowData.pnDivisionId}`,
//       payload
//     );

//     // 4️⃣ Clear modified state
//     setModifiedRows((prev) => {
//       const updated = { ...prev };
//       delete updated[rowData.pnDivisionId];
//       return updated;
//     });

//     toast.success("Division updated successfully", {
//       position: "top-center",
//       autoClose: 1000
//     });

//     // 5️⃣ Refresh grid
//     await fetchAllData();
//   } catch (error) {
//     console.error(error);
//     toast.error("Failed to update division", {
//       position: "top-center",
//       autoClose: 1000
//     });
//   }
// };
const handleUpdateRow = async (rowData) => {
  try {
    toast.dismiss();

    console.log("🔵 handleUpdateRow called for:", rowData.pnDivisionId);
    console.log("🔵 Current modifiedRows:", modifiedRows);
    console.log("🔵 Is this row marked as modified?", modifiedRows[rowData.pnDivisionId]);

    // 1️⃣ Token check
    if (!token) {
      toast.error("Session expired. Please log in again.", { position: "top-center", autoClose: 1500 });
      return;
    }

    // 2️⃣ New row guard
    if (rowData?.isNew) {
      toast.info("This is a new row. Use 'Save All' to persist.", {
        position: "top-center",
        autoClose: 1500
      });
      return;
    }

    // 3️⃣ Check if row was marked as modified (using modifiedRows state)
    if (!modifiedRows[rowData.pnDivisionId]) {
      console.log("🔴 Row NOT marked as modified, aborting update");
      toast.info("No changes to update", {
        position: "top-center",
        autoClose: 1000
      });
      return;
    }

    // 4️⃣ Validate required fields
    if (!rowData.branchId || !rowData.vDivisionName || !rowData.status) {
      toast.error("Please fill all required fields", {
        position: "top-center",
        autoClose: 1000
      });
      return;
    }

    console.log("🟢 Updating row:", rowData.pnDivisionId, { branchId: rowData.branchId, vDivisionName: rowData.vDivisionName, status: rowData.status });

    // 5️⃣ Prepare payload (use correct PascalCase field names for PUT)
    const payload = {
      PnDivisionId: rowData.pnDivisionId,
  PnCompanyId: rowData.pnCompanyId,
  BranchId: rowData.branchId,   // ✅ NOT PnBranchId
  VDivisionName: rowData.vDivisionName,
  Status: getStatusChar(rowData.status)
    };

    console.log("🟢 Payload being sent:", payload);

    // 6️⃣ API call with Authorization header
    await axios.put(
      `${ServerConfig.url}/PaymDivisions/${rowData.pnDivisionId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Division updated successfully", {
      position: "top-center",
      autoClose: 1000
    });

    // 7️⃣ Sync originalData & reset modified flag
    setOriginalData(prev =>
      prev.map(row =>
        row.pnDivisionId === rowData.pnDivisionId ? { ...rowData } : row
      )
    );

    setModifiedRows(prev => ({
      ...prev,
      [rowData.pnDivisionId]: false
    }));

  } catch (err) {
    console.error("❌ Update Error:", err);
    console.error("  Response Status:", err.response?.status);
    console.error("  Response Data:", err.response?.data);
    console.error("  Error Message:", err.message);
    
    if (err.response?.status === 401) {
      toast.error("Session expired. Please log in again.", { position: "top-center", autoClose: 1500 });
      sessionStorage.removeItem("auth");
      return;
    }
    
    const errorMsg = err.response?.data?.message || err.response?.data?.errors || err.message || "Unknown error";
    toast.error("Update failed: " + JSON.stringify(errorMsg), { position: "top-center", autoClose: 1500 });
  }
};


  const handleDeleteRow = (rowData) => {
    // If this is a new unsaved row, just remove it locally
    if (rowData?.isNew) {
      setGridData((prev) => {
        const updated = prev.filter((r) => r !== rowData);
        return updated;
      });
      // Also clear any modified tracking if present
      setModifiedRows((prev) => {
        const next = { ...prev };
        if (rowData.pnDivisionId) delete next[rowData.pnDivisionId];
        return next;
      });
      toast.success("New row removed", { position: "top-center", autoClose: 1000 });
      return;
    }

    // For persisted rows, ask for confirmation then delete via API
    toast.dismiss();
    toast.info(
      <div style={{ textAlign: "center" }}>
        Are you sure you want to delete this record?
        <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8 }}>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={async () => {
              toast.dismiss();
              await executeDelete(rowData);
            }}
            style={{ minWidth: 80 }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => toast.dismiss()}
            style={{ minWidth: 80 }}
          >
            Cancel
          </Button>
        </div>
      </div>,
      { position: "top-center", autoClose: false, closeOnClick: false, draggable: false, toastId: "delete-confirmation" }
    );
  };

  // const executeDelete = async (rowData) => {
  //   try {
  //     const query = `DELETE FROM [${databaseName}].[dbo].[paym_Division] 
  //              WHERE pn_DivisionID='${rowData.pn_DivisionID}'`;

  //     await postRequest(ServerConfig.url, SAVE, { query });
  //     toast.info("Data deleted successfully", { position: "top-center", autoClose: 1000 });
  //     await fetchAllData();
  //   } catch (error) {
  //     toast.error("Failed to delete data", { position: "top-center", autoClose: 1000 });
  //   }
  // };
const executeDelete = async (rowData) => {
  try {
    if (!token) {
      toast.error("Session expired. Please log in again.", { position: "top-center", autoClose: 1500 });
      return;
    }

    await axios.delete(`${ServerConfig.url}/PaymDivisions/${rowData.pnDivisionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Remove the deleted row from local state without forcing full refetch
    setGridData((prev) => prev.filter((r) => String(r.pnDivisionId) !== String(rowData.pnDivisionId)));
    setOriginalData((prev) => prev.filter((r) => String(r.pnDivisionId) !== String(rowData.pnDivisionId)));
    setModifiedRows((prev) => {
      const next = { ...prev };
      delete next[rowData.pnDivisionId];
      return next;
    });

    toast.success("Data deleted successfully", { position: "top-center", autoClose: 1000 });
  } catch (error) {
    console.error(error);
    if (error.response?.status === 401) {
      toast.error("Session expired. Please log in again.", { position: "top-center", autoClose: 1500 });
      sessionStorage.removeItem("auth");
      return;
    }
    toast.error("Failed to delete data: " + (error.response?.data?.message || error.message), {
      position: "top-center",
      autoClose: 1000
    });
  }
};
  const getBranchNameFromId = (branchId) => {
    // Empty/null ID returns empty string for new rows
    if (!branchId) return "";
    
    // Try exact match first
    const found = branch?.find((b) => b.pnBranchId === branchId);
    if (found?.branchName) return found.branchName;
    
    // Try string comparison for type mismatches
    const foundStr = branch?.find((b) => String(b.pnBranchId) === String(branchId));
    if (foundStr?.branchName) return foundStr.branchName;
    
    console.warn("Branch not found for ID:", branchId, "Available branches:", branch);
    return "";
  };

  const getBranchName = (branchId) => {
    if (!branchId || !branch || branch.length === 0) return "N/A";
    
    // Try exact match first
    const found = branch.find(b => b.pnBranchId === branchId);
    if (found) return found.branchName;
    
    // Try string comparison
    const foundStr = branch.find(b => String(b.pnBranchId) === String(branchId));
    if (foundStr) return foundStr.branchName;
    
    console.log("Branch not found for ID:", branchId, "Available branches:", branch);
    return "N/A";
  };

  const handleViewRow = (rowData) => {
    setViewData(rowData);
    setOpenView(true);
  };

  
  const columnDefs = useMemo(() => [
    {
  headerName: "Branch",
  field: "branchId",
  editable: true,
  cellEditor: "agSelectCellEditor",

  // ✅ DROPDOWN shows branch NAMES (user-friendly)
  cellEditorParams: {
    values: branch?.map(b => b.branchName) ?? []
  },

  // ✅ CONVERT selected NAME to numeric ID before storing
  valueSetter: (params) => {
    if (!params.newValue || params.newValue === params.oldValue) return false;
    const selected = branch?.find((b) => b.branchName === params.newValue);
    if (selected) {
      params.data.branchId = selected.pnBranchId; // Store numeric ID
      return true;
    }
    return false;
  },

  // ✅ DISPLAY branch NAME when showing numeric ID
  valueFormatter: params => {
    if (!params.value && params.value !== 0) return "";
    const found = branch?.find(b => b.pnBranchId === params.value);
    return found?.branchName || "";
  },

  minWidth: 150,
  flex: 1
},
  { headerName: "Division", field: "vDivisionName", editable: true, minWidth: 150, flex: 1 },
  {
    headerName: "Status",
    field: "status",
    editable: true,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Active", "Inactive", "Pending"] },
    minWidth: 120,
    flex: 0.8
  },
  {
    headerName: "Actions",
    field: "actions",
    minWidth: 220,
    flex: 1,
    cellStyle: { display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" },
    cellRenderer: (params) => (
      <div className="d-flex justify-content-center" style={{ gap: "8px", width: "100%" }}>
        <button
          className="btn btn-info btn-sm"
          style={{ width: "60px" }}
          onClick={() => handleViewRow(params.data)}
        >
          View
        </button>
        <button
          className="btn btn-success btn-sm"
          style={{ width: "60px" }}
          onClick={() => handleUpdateRow(params.data)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          style={{ width: "60px" }}
          onClick={() => handleDeleteRow(params.data)}
        >
          Delete
        </button>
      </div>
    )
  }
], [branch, modifiedRows]);





  const filteredData = useMemo(() => {
    return gridData.filter((row) => {
      const statusMatch = statusFilter ? row.status === statusFilter : true;
      const branchMatch = branchFilter ? String(row.branchId) === String(branchFilter) : true;
      return statusMatch && branchMatch;
    });
  }, [gridData, statusFilter, branchFilter]);
  

  const gridRef = useRef(null);
  const branchRef = useRef([]);

  useEffect(() => {
    branchRef.current = branch;
  }, [branch]);

  return (
    <Grid container sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />

        <Grid item xs={12} sm={10} md={9} lg={9} xl={10} sx={{mt: "100px", p: 3, mx: "auto", width: "100%", maxWidth: 900 }}>
          <AppBar position="static"><Toolbar><Typography variant="h5">Division Master</Typography></Toolbar></AppBar>

          {/* Filters */}
          <Paper elevation={3} sx={{ p: 2, my: 2 }}>
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <FormControl fullWidth>
                <InputLabel>Branch</InputLabel>
                <Select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} label="Branch"
                  displayEmpty>
                  <MenuItem value="">All BRANCHES</MenuItem>
                  {branch.map((b) => (
                    <MenuItem key={b.pnBranchId} value={b.pnBranchId}>{b.branchName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status"
                  displayEmpty>
                  <MenuItem value="">All STATUS</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Grid */}
          <Box className="ag-theme-alpine" sx={{ width: "100%", height: "500px" }}>
            <AgGridReact
              ref={gridRef}
              rowData={filteredData}
              columnDefs={columnDefs}
              domLayout="normal"
              defaultColDef={{ resizable: true }}
              pagination
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 20, 50]}
              animateRows
              onCellValueChanged={handleCellValueChanged}
              onCellEditingStopped={handleCellEditingStopped}
              suppressNoRowsOverlay={false}
            />
          </Box>

          {/* Buttons */}
          <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" onClick={handleAddRow}>Add Division</Button>
            <Button variant="contained" color="primary" onClick={handleSaveAll}>Save All</Button>
          </Box>

          {/* View Dialog */}
          <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Division Details</DialogTitle>
            <DialogContent dividers>
              {viewData && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#666" }}>Branch</Typography>
                    <Typography sx={{ mt: 0.5 }}>{getBranchName(viewData.branchId)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#666" }}>Division Name</Typography>
                    <Typography sx={{ mt: 0.5 }}>{viewData.vDivisionName || "N/A"}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#666" }}>Status</Typography>
                    <Typography sx={{ mt: 0.5 }}>{viewData.status || "N/A"}</Typography>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenView(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DivisionMaster;
