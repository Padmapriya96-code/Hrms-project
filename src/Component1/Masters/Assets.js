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

const Assets = () => {
  const [gridData, setGridData] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const databaseName = sessionStorage.getItem("databaseName");

  // Convert status
  const getStatusLabel = (char) => {
    switch (char) {
      case "A": return "Active";
      case "I": return "Inactive";
      default: return char;
    }
  };

  // Fetch logged-in branch & company details
  const fetchCompanyAndBranch = useCallback(async () => {
    try {
      const userId = sessionStorage.getItem("user");

      const branchData = await postRequest(ServerConfig.url, REPORTS, {
        query: `
          SELECT pn_BranchID, pn_CompanyID
          FROM [${databaseName}].[dbo].[paym_Branch]
          WHERE Branch_User_Id = '${userId}'
        `,
      });

      if (branchData.data?.length) {
        setBranchId(branchData.data[0].pn_BranchID);
        setCompanyId(branchData.data[0].pn_CompanyID);
      }
    } catch (err) {
      console.error("Error fetching company/branch:", err);
    }
  }, []);

  useEffect(() => {
    fetchCompanyAndBranch();
  }, [fetchCompanyAndBranch]);

  // Fetch Assets
  const fetchAssets = useCallback(async () => {
    if (!companyId || !branchId) return;

    try {
      const assetData = await postRequest(ServerConfig.url, REPORTS, {
        query: `
          SELECT 
            pn_CompanyID,
            BranchID,
            pn_Assetid,
            Asset_name,
            Asset_SerialNumber,
            PurchaseDate,
            AssetValue,
            Status,
            Description,
            CreatedDate,
            AssetType,
            AssetAssignedTo
          FROM [${databaseName}].[dbo].[Assets]
          WHERE BranchID = ${branchId}
            AND pn_CompanyID = ${companyId}
        `,
      });

      if (assetData.data) {
        setGridData(
          assetData.data.map(a => ({
            Asset_name: a.Asset_name,
            Asset_SerialNumber: a.Asset_SerialNumber,
            PurchaseDate: a.PurchaseDate?.split("T")[0],
            AssetValue: a.AssetValue,
            Status: getStatusLabel(a.Status),
            Description: a.Description,
            AssetType: a.AssetType,
            AssetAssignedTo: a.AssetAssignedTo ?? "",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  }, [companyId, branchId]);

  useEffect(() => {
    fetchAssets();
  }, [companyId, branchId, fetchAssets]);

  // Grid Columns
  const columnDefs = useMemo(() => [
    { headerName: "Asset Name", field: "Asset_name", minWidth: 180 },
    { headerName: "Serial Number", field: "Asset_SerialNumber", minWidth: 150 },
    { headerName: "Purchase Date", field: "PurchaseDate", minWidth: 140 },
    { headerName: "Value", field: "AssetValue", minWidth: 120 },
    { headerName: "Status", field: "Status", minWidth: 120 },
    { headerName: "Asset Type", field: "AssetType", minWidth: 150 },
    { headerName: "Assigned To", field: "AssetAssignedTo", minWidth: 150 },
    {
      headerName: "Description",
      field: "Description",
      minWidth: 250,
      autoHeight: true,
      wrapText: true
    }
  ], []);

  return (
    <Grid container style={{ backgroundColor: "#f5f5f5" }}>
      <Navbar />
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Sidenav />

        <Grid item xs={12} sm={10} md={9} sx={{ padding: "30px", margin: "0 auto" }}>
          <AppBar
            position="static"
            sx={{
              width: "82%",
              margin: "70px auto 0 auto",
              minHeight: "60px",
              borderRadius: "10px 10px 0 0",
            }}
          >
            <Toolbar>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
                ASSETS
              </Typography>
            </Toolbar>
          </AppBar>

          <div
            className="ag-theme-alpine"
            style={{
              height: 470,
              width: "82%",
              margin: "0 auto",
            }}
          >
            <AgGridReact
              rowData={gridData}
              columnDefs={columnDefs}
              defaultColDef={{ resizable: true }}
              pagination={true}
              paginationPageSize={15}
              animateRows={true}
            />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Assets;
