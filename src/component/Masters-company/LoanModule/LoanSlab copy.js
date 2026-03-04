import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import Navbar from "../../Home Page-comapny/Navbar1";
import Sidenav from "../../Home Page-comapny/Sidenav1";
import {
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import { postRequest } from "../../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../../serverconfiguration/controllers";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { toast } from "react-toastify";

const CTCSlabTable = () => {
  const [rows, setRows] = useState([]);
  const [companyID, setCompanyID] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [branchID, setBranchID] = useState("");
  const [branches, setBranches] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);

  const user = sessionStorage.getItem("user");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const databaseName = sessionStorage.getItem("databaseName"); // ✅ dynamic DB name

  // Fetch company info
  useEffect(() => {
    async function fetchCompanyData() {
      try {
        const companyData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT pn_CompanyID, CompanyName 
        FROM [${databaseName}].[dbo].[paym_Company]
        WHERE company_user_id = '${user}'`,

        });
        if (companyData.data.length > 0) {
          setCompanyID(companyData.data[0].pn_CompanyID);
          setCompanyName(companyData.data[0].CompanyName);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        alert("Failed to fetch company data.");
      }
    }
    fetchCompanyData();
  }, [user]);

  // Fetch branch info
  useEffect(() => {
    async function fetchBranchData() {
      if (!companyID) return;
      try {
        const branchData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * 
        FROM [${databaseName}].[dbo].[paym_Branch]
        WHERE pn_CompanyID = '${companyID}'`,

        });
        setBranches(branchData.data);
        if (branchData.data.length > 0) {
          setBranchID(branchData.data[0].pn_BranchID);
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
        alert("Failed to fetch branch data.");
      }
    }
    fetchBranchData();
  }, [companyID]);

  // Fetch loans list from Loan Master (LoanID + LoanName)
  useEffect(() => {
    const fetchLoans = async () => {
      if (!companyID) return;
      try {
        const loanData = await postRequest(ServerConfig.url, REPORTS, {
          // Using v_LoanCode as LoanID per your earlier code — keep consistent with DB
          query: `
  SELECT v_LoanCode AS LoanID, v_LoanName
  FROM [${databaseName}].[dbo].[paym_Loan]
  WHERE pn_CompanyID = '${companyID}' AND status = 'Active'
`,

        });
        setLoans(loanData.data || []);
      } catch (error) {
        console.error("Error fetching loans:", error);
        setLoans([]);
      }
    };
    fetchLoans();
  }, [companyID]);

  // Fetch CTC slab rows (initial load)
  // Fetch CTC slab rows (initial load)
  const fetchCTCSlabData = async () => {
    if (!companyID || !branchID) return;
    setLoading(true);
    try {
      const ctcSlabData = await postRequest(ServerConfig.url, REPORTS, {
        query: `
  SELECT CTCSlabID, LoanID, MinCTC, MaxCTC, MaxLoanAmount, InterestRate
  FROM [${databaseName}].[dbo].[CTCSlab]
  WHERE pn_CompanyID = '${companyID}' AND pn_BranchID = '${branchID}'
`,

      });

      const formattedRows = (ctcSlabData.data || []).map((row, index) => {
        const loanMatch = loans.find((l) => l.LoanID === row.LoanID);
        return {
          id: row.CTCSlabID || `tmp-${index + 1}`,
          CTCSlabID: row.CTCSlabID,
          LoanID: row.LoanID || "",
          LoanName: loanMatch ? loanMatch.v_LoanName : "", // ✅ bind readable name
          MinCTC: row.MinCTC,
          MaxCTC: row.MaxCTC,
          MaxLoanAmount: row.MaxLoanAmount,
          InterestRate: row.InterestRate,
          isNew: false,
        };
      });

      setRows(formattedRows);
    } catch (error) {
      console.error("Error fetching CTC slab data:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch slabs only after loans are available
  useEffect(() => {
    if (loans.length > 0 && companyID && branchID) {
      fetchCTCSlabData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans, companyID, branchID]);

  // Fetch slabs whenever companyID or branchID change
  useEffect(() => {
    fetchCTCSlabData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyID, branchID]);

  // When loans arrive, update any rows missing LoanName
  useEffect(() => {
    if (loans.length === 0 || rows.length === 0) return;
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        LoanName:
          (loans.find((l) => l.LoanID === r.LoanID) || {}).v_LoanName ||
          r.LoanName ||
          "",
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans]);

  // Process inline edits from DataGrid
  const handleProcessRowUpdate = (newRow) => {
    // keep isNew flag if present
    const updated = rows.map((r) =>
      r.id === newRow.id ? { ...r, ...newRow } : r
    );
    setRows(updated);
    return newRow;
  };

  // Add a new row (isNew true) — default LoanID to first loan if available
  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];
    if (
      lastRow &&
      (lastRow.isNew ||
        lastRow.MinCTC === "" ||
        lastRow.MaxCTC === "" ||
        lastRow.MaxLoanAmount === "" ||
        lastRow.InterestRate === "")
    ) {
      toast.warning(
        "Please fill all fields in the current new row before adding another.",
        { position: "top-center", autoClose: 1500 }
      );
      return;
    }

    const newRow = {
      id: `new-${Date.now()}`,
      CTCSlabID: "", // empty until saved
      LoanID: loans[0]?.LoanID || "", // auto-select first loan if available
      LoanName: loans[0]?.v_LoanName || "",
      MinCTC: "",
      MaxCTC: "",
      MaxLoanAmount: "",
      InterestRate: "",
      isNew: true,
    };
    setRows((prev) => [...prev, newRow]);
    setEditingRowId(newRow.id);
  };

  // Edit one row (enter edit mode)
  const handleEditRow = (rowId) => {
    setEditingRowId(rowId);
  };

  // Cancel edit (if isNew remove row, otherwise reload data to reset)
  const handleCancelEdit = (row) => {
    if (row.isNew) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } else {
      // revert by re-fetching from server
      fetchCTCSlabData();
    }
    setEditingRowId(null);
  };

  // Save a single row (insert or update)
  const handleSaveRow = async (row) => {
    // Validation
    if (
      !row.LoanID ||
      row.MinCTC === "" ||
      row.MaxCTC === "" ||
      row.MaxLoanAmount === "" ||
      row.InterestRate === ""
    ) {
      toast.error("Please fill all fields before saving.", {
        position: "top-center",
        autoClose: 1200,
      });
      return;
    }

    try {
      // Convert numeric fields only
      const minCTC = Number(row.MinCTC) || 0;
      const maxCTC = Number(row.MaxCTC) || 0;
      const maxLoanAmount = Number(row.MaxLoanAmount) || 0;
      const interestRate = Number(row.InterestRate) || 0;

      if (row.CTCSlabID) {
        // 🔹 UPDATE
        await postRequest(ServerConfig.url, SAVE, {
          query: `
          UPDATE [${databaseName}].[dbo].[CTCSlab]
          SET
            LoanID='${row.LoanID}',
            MinCTC=${minCTC},
            MaxCTC=${maxCTC},
            MaxLoanAmount=${maxLoanAmount},
            InterestRate=${interestRate}
          WHERE CTCSlabID=${row.CTCSlabID}
        `,
        });
        toast.success("Row updated successfully", {
          position: "top-center",
          autoClose: 1000,
        });
      } else {
        // 🔹 INSERT
        await postRequest(ServerConfig.url, SAVE, {
          query: `
          INSERT INTO [${databaseName}].[dbo].[CTCSlab]
            (pn_CompanyID, pn_BranchID, LoanID, MinCTC, MaxCTC, MaxLoanAmount, InterestRate)
          VALUES
            ('${companyID}', '${branchID}', '${row.LoanID}', ${minCTC}, ${maxCTC}, ${maxLoanAmount}, ${interestRate})
        `,
        });
        toast.success("Row added successfully", {
          position: "top-center",
          autoClose: 1000,
        });
      }

      // Refresh
      await fetchCTCSlabData();
      setEditingRowId(null);
    } catch (error) {
      console.error("Failed to save row:", error);
      toast.error("Failed to save row", {
        position: "top-center",
        autoClose: 1200,
      });
    }
  };

  // Save all rows (bulk) — keep LoanID consistent
  const handleSaveAllRows = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (rows.length === 0) {
        toast.error("No CTC slab data to save", {
          position: "top-center",
          autoClose: 1000,
        });
        setLoading(false);
        return;
      }

      const existingData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * 
        FROM [${databaseName}].[dbo].[CTCSlab]
        WHERE pn_CompanyID='${companyID}' AND pn_BranchID='${branchID}'`,

      });
      const existingRecords = existingData.data || [];
      const queries = [];

      for (const row of rows) {
        if (
          row.MinCTC === "" ||
          row.MaxCTC === "" ||
          row.MaxLoanAmount === "" ||
          row.InterestRate === ""
        ) {
          toast.error("Please fill all fields before saving.", {
            position: "top-center",
            autoClose: 1200,
          });
          setLoading(false);
          return;
        }

        const existingRow = existingRecords.find(
          (item) => item.CTCSlabID === row.CTCSlabID
        );

        if (existingRow) {
          const isChanged = [
            "LoanID",
            "MinCTC",
            "MaxCTC",
            "MaxLoanAmount",
            "InterestRate",
          ].some((key) => existingRow[key] != row[key]);
          if (!isChanged) continue;

          queries.push(`
            UPDATE [${databaseName}].[dbo].[CTCSlab] SET
              LoanID='${row.LoanID}',
              MinCTC='${row.MinCTC}',
              MaxCTC='${row.MaxCTC}',
              MaxLoanAmount='${row.MaxLoanAmount}',
              InterestRate='${row.InterestRate}'
            WHERE CTCSlabID=${row.CTCSlabID}
          `);
        } else {
          queries.push(`
            INSERT INTO [${databaseName}].[dbo].[CTCSlab] (pn_CompanyID, pn_BranchID, LoanID, MinCTC, MaxCTC, MaxLoanAmount, InterestRate)
            VALUES ('${companyID}','${branchID}','${row.LoanID}','${row.MinCTC}','${row.MaxCTC}','${row.MaxLoanAmount}','${row.InterestRate}')
          `);
        }
      }

      if (queries.length === 0) {
        toast.info("No changes to save", {
          position: "top-center",
          autoClose: 1000,
        });
        setLoading(false);
        return;
      }

      // await postRequest(ServerConfig.url, SAVE, { query: queries.join("\n") });
      toast.success("Data saved successfully", {
        position: "top-center",
        autoClose: 1000,
      });

      await fetchCTCSlabData();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save data", {
        position: "top-center",
        autoClose: 1200,
      });
    } finally {
      setLoading(false);
      setEditingRowId(null);
    }
  };

  const handleDeleteRow = async (CTCSlabID) => {
    if (!CTCSlabID) {
      // if it's a new unsaved row, just remove from UI
      setRows((prev) =>
        prev.filter((r) => r.CTCSlabID !== CTCSlabID && !r.isNew)
      );
      return;
    }
    if (window.confirm("Are you sure you want to delete this row?")) {
      try {
        await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * 
        FROM [${databaseName}].[dbo].[CTCSlab]
        WHERE pn_CompanyID='${companyID}' AND pn_BranchID='${branchID}'`,

        });
        await fetchCTCSlabData();
        toast.info("Row deleted successfully", {
          position: "top-center",
          autoClose: 1000,
        });
      } catch (error) {
        console.error("Error deleting row:", error);
        toast.error("Failed to delete row", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    }
  };

  // Loan select change handler
  const handleLoanChange = (e, id) => {
    const val = e.target.value;
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              LoanID: val,
              LoanName:
                (loans.find((l) => l.LoanID === val) || {}).v_LoanName || "",
            }
          : row
      )
    );
  };
  const rowsWithIndex = rows.map((row, index) => ({
    ...row,
    index: index + 1,
  }));

  const columns = [
    // {
    //   field: "index",
    //   headerName: "S.No",
    //   width: 90,
    //   sortable: false,
    //   valueGetter: (params) => params.api.getRowIndex(params.id) + 1,
    // },
    { field: "", headerName: "", width: 90 },
    { field: "index", headerName: "S.No", width: 150 },
    // { field: "CTCSlabID", headerName: "CTC SLAB ID", width: 130 },
    {
      field: "LoanID",
      headerName: "LOAN NAME",
      width: 220,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        const isEditing = row.isNew || editingRowId === row.id;

        if (isEditing) {
          return (
            <Select
              size="small"
              value={row.LoanID || ""}
              onChange={(e) => handleLoanChange(e, row.id)}
              displayEmpty
              sx={{ width: "100%" }}
            >
              <MenuItem value="">
                <em>Select Loan</em>
              </MenuItem>
              {loans.map((loan) => (
                <MenuItem key={loan.LoanID} value={loan.LoanID}>
                  {loan.v_LoanName}
                </MenuItem>
              ))}
            </Select>
          );
        }

        // show text when not editing
        return <span>{row.LoanName || "-"}</span>;
      },
    },
    { field: "MinCTC", headerName: "MIN CTC", width: 150, editable: true },
    { field: "MaxCTC", headerName: "MAX CTC", width: 150, editable: true },
    {
      field: "MaxLoanAmount",
      headerName: "MAX LOAN AMOUNT",
      width: 180,
      editable: true,
    },
    {
      field: "InterestRate",
      headerName: "INTEREST RATE(%)",
      width: 180,
      editable: true,
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 160,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        const isEditing = row.isNew || editingRowId === row.id;

        if (isEditing) {
          return (
            <>
              <IconButton
                color="primary"
                onClick={() => handleSaveRow(row)}
                size="small"
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={() => handleCancelEdit(row)}
                size="small"
              >
                <CancelIcon />
              </IconButton>
            </>
          );
        }

        return (
          <>
            <IconButton
              color="primary"
              onClick={() => handleEditRow(row.id)}
              size="small"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDeleteRow(row.CTCSlabID)}
              size="small"
              sx={{ color: "red" }}
            >
              <DeleteOutlinedIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <Grid container style={{ backgroundColor: "#f5f5f5" }}>
      <div style={{ width: "100%" }}>
        <Navbar />
        {/* <Box height={10} /> */}
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          <Grid item xs={12} md={10} style={{ margin: "0 auto" }}>
            <AppBar
              position="static"
              sx={{ width: "100%", marginTop: "70px", minHeight: "60px" }}
            >
              <Toolbar>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  LOAN SLAB
                </Typography>
              </Toolbar>
            </AppBar>

            <Box
              sx={{
                padding: 2,
                border: "1px solid #ccc",
                backgroundColor: "white",
                mt: 2,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Company Name"
                    fullWidth
                    value={companyName}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Branch"
                    fullWidth
                    value={branchID}
                    onChange={(e) => setBranchID(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  >
                    {branches.map((branch) => (
                      <MenuItem
                        key={branch.pn_BranchID}
                        value={branch.pn_BranchID}
                      >
                        {branch.BranchName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ height: 320, width: "100%", marginTop: 2 }}>
              <DataGrid
                rows={rowsWithIndex}
                columns={columns}
                processRowUpdate={handleProcessRowUpdate}
                editMode="cell"
                loading={loading}
                getRowId={(r) => r.id}
                experimentalFeatures={{ newEditingApi: true }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                onClick={handleAddRow}
                sx={{ mr: 2 }}
              >
                Add Row
              </Button>

              {/* <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAllRows}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save All"}
              </Button> */}
            </Box>
          </Grid>
        </Box>
      </div>
    </Grid>
  );
};

export default CTCSlabTable;
