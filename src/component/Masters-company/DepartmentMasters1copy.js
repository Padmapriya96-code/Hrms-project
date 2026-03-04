import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Card,
} from "react-bootstrap";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { toast } from "react-toastify";
import { postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS, SAVE } from "../../serverconfiguration/controllers";
import Navbar from "../Home Page-comapny/Navbar1";
import Sidenav from "../Home Page-comapny/Sidenav1";
import axios from "axios";

const DepartmentMasterBootstrap = () => {
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState({});
  const [pnCompanyId, setPnCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [viewData, setViewData] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const[rows,setRows]=useState([]);
  const authStr=sessionStorage.getItem("auth");
    const auth=authStr?JSON.parse(authStr):null;
    const token=auth?.token;
    ServerConfig.url = "https://localhost:7266/api";
    

  const getStatusLabel = (char) =>
    char === "A"
      ? "Active"
      : char === "I"
      ? "Inactive"
      : char === "P"
      ? "Pending"
      : "";

  const getStatusChar = (label) =>
    label === "Active"
      ? "A"
      : label === "Inactive"
      ? "I"
      : label === "Pending"
      ? "P"
      : "";

  // Fetch data
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
  // };const fetchCompanyData = async () => {
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
  // const fetchBranchData = async () => {
  //   if (!pnCompanyId) return;
  //   const branchData = await postRequest(ServerConfig.url, REPORTS, {
  //     query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch] WHERE pn_CompanyID = '${pnCompanyId}'`,

  //   });
  //   setBranch(branchData.data);
  // };
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
  const fetchDepartmentData = async () => {
  try {
    if (!pnCompanyId || !token) return;

    const res = await axios.get(
      `${ServerConfig.url}/PaymDepartments`,
      {
        params: { companyId: pnCompanyId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const formatted = res.data.map(item => ({
      pnCompanyId: item.pnCompanyId,
      pnBranchId: item.pnBranchId,
      pnDepartmentId: item.pnDepartmentId,
      vDepartmentName: item.vDepartmentName,
      status: getStatusLabel(item.status)
    }));

    setGridData(formatted);
    setOriginalData(JSON.parse(JSON.stringify(formatted)));
    setModifiedRows({});
  } catch (err) {
    console.error("❌ Error fetching departments:", err);
    toast.error("Failed to load departments");
  }
};


  const fetchAllData = async () => {
    await fetchCompanyData();
    await fetchBranchData();
    await fetchDepartmentData();
  };

  useEffect(() => {
    fetchAllData();
  }, [pnCompanyId]);

  const isRowModified = useCallback(
    (rowData) => {
      if (rowData.isNew) return false;
      const originalRow = originalData.find(
        (r) => r.pnDepartmentId === rowData.pnDepartmentId
      );
      if (!originalRow) return false;
      return (
        String(originalRow.pnBranchId) !== String(rowData.pnBranchId) ||
        String(originalRow.vDepartmentName) !==
          String(rowData.vDepartmentName) ||
        String(originalRow.status) !== String(rowData.status)
      );
    },
    [originalData]
  );

  const handleCellValueChanged = useCallback(
    (params) => {
      const rowData = params.data;
      if (!rowData.isNew) {
        const modified = isRowModified(rowData);
        setModifiedRows((prev) => ({
          ...prev,
          [rowData.pnDepartmentId]: modified,
        }));
      }
      params.api.refreshCells({ rowNodes: [params.node], force: true });
    },
    [isRowModified]
  );

  const handleAddRow = () => {
    const lastRow = gridData[gridData.length - 1];
    if (
      lastRow &&
      (!lastRow.pnBranchId || !lastRow.vDepartmentName || !lastRow.status)
    ) {
      toast.warning(
        "Please fill all fields in the current row before adding new."
      );
      return;
    }
    setGridData((prev) => [
      ...prev,
      {
        pnCompanyId,
        pnBranchId: "",
        vDepartmentName: "",
        status: "",
        isNew: true,
      },
    ]);
  };

  const handleSaveAll = async () => {
  try {
    const newRows = gridData.filter(r => r.isNew);

    if (!newRows.length) {
      toast.error("No new data to save");
      return;
    }

    // Validation
    for (const row of newRows) {
      if (!row.pnCompanyId || !row.pnBranchId || !row.vDepartmentName || !row.status) {
        toast.error("Please fill all fields for new rows");
        return;
      }
    }

    // Prepare BULK payload (ARRAY)
    const payload = newRows.map(row => ({
      pnCompanyId: row.pnCompanyId,
      pnBranchId: row.pnBranchId,
      vDepartmentName: row.vDepartmentName,
      status: getStatusChar(row.status)
    }));
console.log("Calling API:", `${ServerConfig.url}/PaymDepartments/bulk`);

    // API call
    await axios.post(
      `${ServerConfig.url}/PaymDepartments/bulk`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        
        }
      }
    );

    toast.success("Saved successfully");
    fetchAllData();

  } catch (err) {
    console.error("❌ Save error:", err.response || err);
    toast.error("Failed to save data");
  }
};



  const handleUpdateRow = async (rowData) => {
  try {
    // guard: new row
    if (rowData.isNew) {
      toast.info("Use Save All to insert new records");
      return;
    }

    // guard: no changes
    if (!modifiedRows[rowData.pnDepartmentId]) {
      toast.info("No changes to update");
      return;
    }

    // validation
    if (!rowData.pnBranchId || !rowData.vDepartmentName || !rowData.status) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      pnDepartmentId: rowData.pnDepartmentId,
      pnCompanyId: rowData.pnCompanyId,
      pnBranchId: rowData.pnBranchId,
      vDepartmentName: rowData.vDepartmentName,
      status: getStatusChar(rowData.status)
    };

    await axios.put(
      `${ServerConfig.url}/PaymDepartments/${rowData.pnDepartmentId}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // clear modified flag
    setModifiedRows(prev => {
      const copy = { ...prev };
      delete copy[rowData.pnDepartmentId];
      return copy;
    });

    toast.success("Updated successfully");
    fetchAllData();

  } catch (err) {
    console.error("❌ Update error:", err);
    toast.error("Update failed");
  }
};



 const handleDeleteRow = async (rowData) => {
  // ✅ If it is new row (not saved)
  if (rowData.isNew) {
    setGridData(prev =>
      prev.filter(row => row !== rowData)
    );
    toast.info("Unsaved row removed");
    return;
  }
  if (!window.confirm("Are you sure you want to delete this record?")) return;

  try {
    await axios.delete(
      `${ServerConfig.url}/PaymDepartments/${rowData.pnDepartmentId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    toast.success("Deleted successfully");
    fetchAllData();
  } catch (err) {
    console.error("❌ Delete error:", err);
    toast.error("Delete failed");
  }
};

  const handleViewRow = (rowData) => {
    setViewData(rowData);
    setShowViewModal(true);
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Branch",
        field: "pnBranchId",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: branch.map((b) => b.branchName) },
        valueGetter: (params) =>
          branch.find((b) => b.pnBranchId === params.data.pnBranchId)
            ?.branchName || "",
        valueSetter: (params) => {
          const selected = branch.find((b) => b.branchName === params.newValue);
          if (selected) {
            params.data.pnBranchId = selected.pnBranchId;
            return true;
          }
          return false;
        },
        minWidth: 150,
      },
      {
        headerName: "Department",
        field: "vDepartmentName",
        editable: true,
        minWidth: 200,
      },
      {
        headerName: "Status",
        field: "status",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Active", "Inactive", "Pending"] },
        minWidth: 100,
        cellStyle: (params) => ({
          color:
            params.value === "Active"
              ? "#155724"
              : params.value === "Inactive"
              ? "#721c24"
              : "#856404",
          fontWeight: "bold",
        }),
      },
      {
        headerName: "Actions",
        minWidth: 220,
        cellStyle: { display: "flex", justifyContent: "center", gap: "6px" },
        cellRenderer: (params) => (
          <div className="d-flex justify-content-center gap-1">
            <Button
              size="sm"
              variant="info"
              onClick={() => handleViewRow(params.data)}
            >
              View
            </Button>
            <Button
              size="sm"
              variant="success"
              disabled={!modifiedRows[params.data.pnDepartmentId]}
              onClick={() => handleUpdateRow(params.data)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDeleteRow(params.data)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [branch, modifiedRows]
  );

  const filteredData = useMemo(
    () =>
      gridData.filter(
        (row) =>
          (!statusFilter || row.status === statusFilter) &&
          (!branchFilter || String(row.pnBranchId) === String(branchFilter))
      ),
    [gridData, statusFilter, branchFilter]
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div className="d-flex">
        <div style={{ width: "250px" }}>
          <Sidenav />
        </div>
        <div style={{ flex: 1, padding: "20px", marginTop: "80px" }}>
          <Container fluid>
            {/* Header Card */}
            <AppBar
              position="static"
              sx={{
                background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                mb: 3,
                borderRadius: 2,
              }}
            >
              <Toolbar>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#fff" }}
                >
                  Department Master
                </Typography>
              </Toolbar>
            </AppBar>

            {/* Filters Card */}
            <Card
              className="p-3 mb-3 shadow"
              style={{
                borderRadius: "12px",
                background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              }}
            >
              <Row className="align-items-center">
                <Col xs={12} sm={6} md={4} className="mb-2">
                  <Form.Select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    style={{ backgroundColor: "#ffffff", color: "#000" }}
                  >
                    <option value="">All Branches</option>
                    {branch.map((b) => (
                      <option key={b.pnBranchId} value={b.pnBranchId}>
                        {b.branchName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col xs={12} sm={6} md={4} className="mb-2">
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ backgroundColor: "#ffffff", color: "#000" }}
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </Form.Select>
                </Col>
                <Col xs={12} md={4} className="text-md-end">
                  <Button
                    onClick={handleAddRow}
                    className="me-2"
                    style={{ backgroundColor: "#ff4b1f", border: "none" }}
                  >
                    Add Department
                  </Button>
                  <Button
                    onClick={handleSaveAll}
                    style={{
                      backgroundColor: "#1fddff",
                      border: "none",
                      color: "#000",
                    }}
                  >
                    Save All
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Grid */}
            <div
              className="ag-theme-alpine"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <AgGridReact
                rowData={filteredData}
                columnDefs={columnDefs}
                domLayout="autoHeight"
                defaultColDef={{ flex: 1, minWidth: 120, resizable: true }}
                pagination={true}
                paginationPageSize={10}
                animateRows={true}
                onCellValueChanged={handleCellValueChanged}
                getRowStyle={(params) => ({
                  backgroundColor:
                    params.node.rowIndex % 2 === 0 ? "#ffe6e6" : "#fff0f5",
                })}
              />
            </div>
          </Container>
        </div>
      </div>

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}
        centered
        container={document.body} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Department Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewData && (
            <div>
              <p>
                <strong>Branch:</strong>{" "}
                {
                  branch.find((b) => b.pnBranchId === viewData.pnBranchId)
                    ?.branchName
                }
              </p>
              <p>
                <strong>Department Name:</strong> {viewData.vDepartmentName}
              </p>
              <p>
                <strong>Status:</strong> {viewData.status}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DepartmentMasterBootstrap;
