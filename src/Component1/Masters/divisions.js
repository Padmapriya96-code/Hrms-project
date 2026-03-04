import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Grid,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS } from "../../serverconfiguration/controllers";
import Navbar from "../../components/Home Page/Navbar";
import Sidenav from "../../components/Home Page/Sidenav";
import '../../App.css'; // Import the global CSS file

const Divisions = () => {
  const [gridData, setGridData] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [gridHeight] = useState(400);
  const databaseName = sessionStorage.getItem("databaseName");

  // Map DB status char to label
  const getStatusLabel = (char) => {
    switch (char) {
      case "A": return "Active";
      case "I": return "Inactive";
      case "P": return "Pending";
      default: return "";
    }
  };

  // 1. Fetch company & branch for logged in user (same as ShiftDetails)
  const fetchCompanyAndBranch = useCallback(async () => {
    const isLoggedin = sessionStorage.getItem("user");

    try {
      const loggedBranchData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch] WHERE Branch_User_Id = '${isLoggedin}'`,
      });

      if (loggedBranchData.data && loggedBranchData.data.length > 0) {
        const branch = loggedBranchData.data[0];
        setBranchId(branch.pn_BranchID);
        setCompanyId(branch.pn_CompanyID);
      }
    } catch (error) {
      console.error("Error fetching company/branch:", error);
    }
  }, []);

  useEffect(() => {
    fetchCompanyAndBranch();
  }, [fetchCompanyAndBranch]);

  // 2. Fetch Divisions for that company & branch
  const fetchDivisions = useCallback(async () => {
    if (companyId && branchId) {
      try {
        const divisionsData = await postRequest(ServerConfig.url, REPORTS, {
          query: `
            SELECT 
              pn_DivisionID,
              v_DivisionName,
              status,
              pn_CompanyID,
              BranchID
            FROM [${databaseName}].[dbo].[paym_Division]
            WHERE pn_CompanyID = ${companyId}
              AND BranchID = ${branchId}
          `,
        });

        if (divisionsData.data) {
          setGridData(
            divisionsData.data.map((item) => ({
              v_DivisionName: item.v_DivisionName,
              status: getStatusLabel(item.status),
            }))
          );
        } else {
          setGridData([]);
        }
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    }
  }, [companyId, branchId]);

  useEffect(() => {
    if (companyId && branchId) {
      fetchDivisions();
    }
  }, [companyId, branchId, fetchDivisions]);

  // 3. Define grid columns
const columnDefs = useMemo(
  () => [
    {
      headerName: "DIVISION NAME",
      field: "v_DivisionName",
      editable: false,
      minWidth: 450, // keeps its normal width
      cellStyle: { 
        whiteSpace: "normal", 
        overflow: "visible", 
        wordBreak: "break-word", 
        textAlign: "left" 
      },
      autoHeight: true,
    },
    {
      headerName: "STATUS",
      field: "status",
      editable: false,
      width: 150, // narrow column
      resizable: false,
      cellStyle: { textAlign: "left" },
    },
  ],
  []
);

  return (
    <Grid container style={{ backgroundColor: "#f5f5f5" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          lg={7}
          sx={{
            padding: { xs: "20px", sm: "40px" },
            margin: "0 auto",
          }}
        >
<AppBar
  position="static"
  sx={{
    width: "100%",   
    maxWidth:"1100px"  ,            // shrink width
    margin: "70px auto 0 auto",   // top margin + center horizontally
    minHeight: "60px",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  }}
>
  <Toolbar
    sx={{
      justifyContent: "flex-start", // align text to left
      alignItems: "center",         // vertically center
      height: "100%",
    }}
  >
    <Typography
      variant="h5"
      sx={{
        fontWeight: "bold",
        color: "white",
      }}
    >
      DIVISION
    </Typography>
  </Toolbar>
</AppBar>


          <div
            className="ag-theme-alpine"
            style={{ height: gridHeight, width: "100%" }}
          >
    <div
  className="ag-theme-alpine"
  style={{
    height: gridHeight,
    width: "100%", // decrease width to 70% of parent
    margin: "0 auto", // center horizontally
     maxWidth:"1100px"  
  }}
>
  <AgGridReact
    className="ag-grid-rounded"
    rowData={gridData}
    columnDefs={columnDefs}
    defaultColDef={{ resizable: true, minWidth: 100 }} 
    animateRows={true}
    pagination={true}
    paginationPageSize={20}
    getRowStyle={(params) => ({
      backgroundColor:
        params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff",
    })}
     getRowHeight={() => 30}  
  />
</div>


          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Divisions;
