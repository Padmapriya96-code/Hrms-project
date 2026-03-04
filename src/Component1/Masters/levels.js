import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Grid, Typography, AppBar, Toolbar } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { postRequest } from "../../serverconfiguration/requestcomp";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { REPORTS } from "../../serverconfiguration/controllers";
import Navbar from "../../components/Home Page/Navbar";
import Sidenav from "../../components/Home Page/Sidenav";
import "../../App.css"; // Global CSS

const Levels = () => {
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

  // Fetch company & branch for logged-in user
  const fetchCompanyAndBranch = useCallback(async () => {
    const isLoggedin = sessionStorage.getItem("user");
    try {
      const branchData = await postRequest(ServerConfig.url, REPORTS, {
        query: `SELECT * FROM [${databaseName}].[dbo].[paym_Branch] WHERE Branch_User_Id = '${isLoggedin}'`,
      });

      if (branchData.data && branchData.data.length > 0) {
        const branch = branchData.data[0];
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

  // Fetch Levels
  const fetchLevels = useCallback(async () => {
    if (companyId && branchId) {
      try {
        const levelData = await postRequest(ServerConfig.url, REPORTS, {
          query: `
            SELECT pn_LevelID, v_LevelName, status, pn_CompanyID, BranchID
            FROM [${databaseName}].[dbo].[paym_Level]
            WHERE pn_CompanyID = ${companyId}
              AND BranchID = ${branchId}
          `,
        });

        if (levelData.data) {
          setGridData(
            levelData.data.map(item => ({
              v_LevelName: item.v_LevelName,
              status: getStatusLabel(item.status),
            }))
          );
        } else {
          setGridData([]);
        }
      } catch (error) {
        console.error("Error fetching levels:", error);
      }
    }
  }, [companyId, branchId]);

  useEffect(() => {
    if (companyId && branchId) {
      fetchLevels();
    }
  }, [companyId, branchId, fetchLevels]);

  // Grid column definitions
  const columnDefs = useMemo(() => [
    {
      headerName: "LEVEL NAME",
      field: "v_LevelName",
      editable: false,
      minWidth: 370,
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
      width: 230,
      resizable: false,
      cellStyle: { textAlign: "left" },
    }
  ], []);

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
          sx={{ padding: { xs: "20px", sm: "40px" }, margin: "0 auto" }}
        >
          <AppBar
            position="static"
            sx={{
              width: "82%",
              margin: "70px auto 0 auto",
              minHeight: "60px",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <Toolbar
              sx={{
                justifyContent: "flex-start",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                LEVEL  MANAGEMENT
              </Typography>
            </Toolbar>
          </AppBar>

          <div
            className="ag-theme-alpine ag-grid-rounded"
            style={{
              height: gridHeight,
              width: "82%",
              margin: "0 auto",
            }}
          >
            <AgGridReact
              rowData={gridData}
              columnDefs={columnDefs}
              defaultColDef={{ resizable: true, minWidth: 100 }}
              animateRows={true}
              pagination={true}
              paginationPageSize={20}
              getRowStyle={params => ({
                backgroundColor: params.node.rowIndex % 2 === 0 ? "#cde3f2" : "#ffffff"
              })}
            />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Levels;
