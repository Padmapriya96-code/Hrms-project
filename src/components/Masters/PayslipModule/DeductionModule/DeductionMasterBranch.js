import { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { REPORTS, SAVE } from '../../../../serverconfiguration/controllers';
import { postRequest } from '../../../../serverconfiguration/requestcomp';
import { ServerConfig } from '../../../../serverconfiguration/serverconfig';
import { Button, Snackbar, Alert } from '@mui/material';
import './Gridstyle.css';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
function Deductionmasterbranch() {
    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
    const [rowData, setRowData] = useState([]);
    const [Branch, setBranch] = useState([]);
    const [isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"));
    const [Deduction, setDeduction] = useState([]);
    const [saveMessage, setSaveMessage] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState("success");
    const [Dedmasterapprove, setDedmasterapprove] = useState([]);
    const [CompanyID, setCompanyID] = useState('')
    useEffect(() => {
        async function getData() {
            try {
                const Branchdata = await postRequest(ServerConfig.url, REPORTS, {
                    query: `SELECT * FROM paym_Branch WHERE Branch_User_Id = '${isloggedin}'`,
                });
                    setBranch(Branchdata.data);
                const Companyid = await postRequest(ServerConfig.url, REPORTS, {
                    query: `SELECT pn_CompanyID FROM paym_Branch WHERE Branch_User_Id = '${isloggedin}'`,
                });
                setCompanyID(Companyid.data);
                    if (Branchdata.data && Branchdata.data.length > 0 && Companyid.data && Companyid.data.length > 0) {
                    const branchId = Branchdata.data[0].pn_BranchID;
                    const companyId = Companyid.data[0].pn_CompanyID
                                            const Deductiondata = await postRequest(ServerConfig.url, REPORTS, {
                        query: `SELECT * FROM DeductionMaster WHERE pn_BranchID = '${branchId}' ORDER BY d_order`,
                    });
                                 const DeductionApproveData = await postRequest(ServerConfig.url, REPORTS, {
                        query: `SELECT * FROM DeductionMasterApprove WHERE pn_BranchID = '${branchId}' and pending = 'Yes'`,
                    });
                                    const combinedData = [
                        ...Deductiondata.data.map((item) => ({
                            ...item,
                            isPendingApproval: false, 
                        })),
                        ...DeductionApproveData.data.map((item) => ({
                            ...item,
                            isPendingApproval: true, 
                        })),
                    ];
                        const sortedData = combinedData.sort((a, b) => a.d_order - b.d_order);
                    setDeduction(sortedData);
                        setRowData(
                        sortedData.map((item, index) => ({
                            v_DeductionName: item.v_DeductionName,
                            d_order: item.d_order,
                            position: index + 1,
                            Type: item.Type || "",
                            Branch_User_Id: item.Branch_User_Id,
                            isExisting: true,
                            isPendingApproval: item.isPendingApproval,
                        }))
                    );
                }
            } catch (error) {
                console.error("Error fetching data", error);
            }
        }
            getData();
    }, [isloggedin]);
    const fetchdedMasterapprovedata = async () => {
        try {
            const response = await postRequest(ServerConfig.url, REPORTS, {
                query: `select * from DeductionMasterApprove where Pending = 'Yes'  and pn_BranchID = ${Branch[0].pn_BranchID}`,
            });
            setDedmasterapprove(response.data || []); 
            return response.data || []; 
        } catch (error) {
            console.error("Error fetching DeductionMasterApprove data", error);
            return []; 
        }
    };
    const refreshData = async () => {
        try {
            const branchId = Branch[0]?.pn_BranchID; 
            if (!branchId) return;
            const Deductiondata = await postRequest(ServerConfig.url, REPORTS, {
                query: `SELECT * FROM DeductionMaster WHERE pn_BranchID = ${branchId} ORDER BY d_order`,
            });
                const DeductionApproveData = await postRequest(ServerConfig.url, REPORTS, {
                query: `SELECT * FROM DeductionMasterApprove WHERE pn_BranchID = ${branchId} AND pending = 'Yes'`,
            });
                const combinedData = [
                ...Deductiondata.data.map((item) => ({
                    ...item,
                    isPendingApproval: false, 
                })),
                ...DeductionApproveData.data.map((item) => ({
                    ...item,
                    isPendingApproval: true, 
                })),
            ];
                const sortedData = combinedData.sort((a, b) => a.d_order - b.d_order);
            setDeduction(sortedData);
                setRowData(
                sortedData.map((item, index) => ({
                    v_DeductionName: item.v_DeductionName,
                    d_order: item.d_order,
                    position: index + 1,
                    Type: item.Type || "",
                    Branch_User_Id: item.Branch_User_Id,
                    isExisting: true,
                    isPendingApproval: item.isPendingApproval,
                }))
            );
        } catch (error) {
            console.error("Error refreshing data", error);
        }
    };
        const handleSave = async () => {
        try {
            const branchId = Branch[0]?.pn_BranchID; 
            const companyId = CompanyID[0]?.pn_CompanyID;
            const existingData = await fetchdedMasterapprovedata();
                const existingDataMap = new Map(
                existingData.map((item) => [item.v_DeductionName, item])
            );
                const newRows = [];
            const updateRows = [];
                rowData.forEach((row) => {
                if (!row.isExisting) {
                    newRows.push(row); 
                } else if (existingDataMap.has(row.v_DeductionName)) {
                    updateRows.push(row); 
                }
            });
                for (const row of updateRows) {
                await postRequest(ServerConfig.url, SAVE, {
                    query: `
                        UPDATE DeductionMasterApprove
                        SET 
                         v_DeductionName = '${row.v_DeductionName}' ,
                            Type = '${row.Type}',
                            Pending = 'Yes',
                            Approve = 'No',
                            Reject = 'No'
                           
                        WHERE 
                            pn_BranchID = ${branchId}
                            AND v_DeductionName = '${row.v_DeductionName}'
                            AND Type = '${row.Type}'
                    `,
                });
            }
                for (const row of newRows) {
                await postRequest(ServerConfig.url, SAVE, {
                    query: `
                        INSERT INTO DeductionMasterApprove
                            (pn_CompanyID, pn_BranchID, v_DeductionName, Type, Approve, Pending, Reject, RequestDate, Responsedate, Request_User_Id, Response_User_Id)
                        VALUES
                            (${companyId}, ${branchId}, '${row.v_DeductionName}', '${row.Type}', 'No', 'Yes', 'No', GETDATE(), NULL, '${isloggedin}', NULL)
                    `,
                });
            }
                setSaveMessage("Deduction Name went for approval. Once Approved it will be enabled");
            setAlertSeverity("warning");
            setAlertOpen(true);
                await refreshData();
        } catch (error) {
            console.error("Error saving data", error);
            setSaveMessage("Error saving data. Please try again.");
            setAlertSeverity("error");
            setAlertOpen(true);
        }
    };
            const handleClose = () => {
        setAlertOpen(false);
    };
    const [usedTypes, setUsedTypes] = useState(new Set()); // Track used types
    const columnDefs = useMemo(() => [
        { 
            field: "v_DeductionName", 
            headerName: "Deduction Name", 
            rowDrag: true, 
            editable: (params) => !params.data.isPendingApproval,
            cellStyle: (params) => ({
                color: 'black',
                backgroundColor: params.data.isPendingApproval ? '#E8E8E8' : 'transparent',
            }),
            flex: 1, 
            headerClass: "ag-header-cell-label" 
        },
        { 
            field: "Type", 
            headerName: "Type", 
            editable: (params) => !params.data.isPendingApproval,
            cellStyle: (params) => ({
                color: 'black',
                backgroundColor: params.data.isPendingApproval ? '#E8E8E8' : 'transparent',
            }),
            flex: 1, 
            headerClass: "ag-header-cell-label",
            cellRenderer: (params) => {
                const handleChange = (event) => {
                    const selectedType = event.target.value;
                    params.node.setDataValue("Type", selectedType);
                };
                const gridApi = params.api;
                const allRows = [];
                gridApi.forEachNode((node) => {
                    allRows.push(node.data.Type);
                });
                        const multiAllowedTypes = ["Other", "Loan", "Advance"];
                                   const isTypeDisabled = (option) => {
                                        return !multiAllowedTypes.includes(option) && 
                           allRows.includes(option) && 
                           params.value !== option;
                };
                    return (
                    <select 
                        value={params.value || ""} 
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            fontSize: "inherit",
                        }}
                        disabled={params.data.isPendingApproval}
                        onFocus={(e) => e.preventDefault()}
                    >
                        <option value="">Select Type</option>
                        {["PF", "PT", "ESI", "IT", "Canteen", "Advance", "Loan", "Other"].map((option) => (
                            <option 
                                key={option} 
                                value={option} 
                                disabled={isTypeDisabled(option)}
                            >
                                {option}
                            </option>
                        ))}
                    </select>
                );
            }
        },
    ], []);
        useEffect(() => {
        async function getData() {
            try {
                const Branchdata = await postRequest(ServerConfig.url, REPORTS, {
                    query: `SELECT * FROM paym_Branch WHERE Branch_User_Id = '${isloggedin}'`,
                });
                    setBranch(Branchdata.data);
                    if (Branchdata.data && Branchdata.data.length > 0) {
                    const branchId = Branchdata.data[0].pn_BranchID;
                        const Deductiondata = await postRequest(ServerConfig.url, REPORTS, {
                        query: `SELECT * FROM DeductionMaster WHERE pn_BranchID = '${branchId}' ORDER BY d_order`,
                    });
                        const DeductionApproveData = await postRequest(ServerConfig.url, REPORTS, {
                        query: `SELECT * FROM DeductionMasterApprove WHERE pn_BranchID = '${branchId}' AND pending = 'Yes'`,
                    });
                        const combinedData = [
                        ...Deductiondata.data.map((item) => ({
                            ...item,
                            isPendingApproval: false, 
                        })),
                        ...DeductionApproveData.data.map((item) => ({
                            ...item,
                            isPendingApproval: true, 
                        })),
                    ];
                        const sortedData = combinedData.sort((a, b) => a.d_order - b.d_order);
                    setDeduction(sortedData);
                        setRowData(
                        sortedData.map((item, index) => ({
                            v_DeductionName: item.v_DeductionName,
                            d_order: item.d_order,
                            position: index + 1,
                            Type: item.Type || "",
                            Branch_User_Id: item.Branch_User_Id,
                            isExisting: true,
                            isPendingApproval: item.isPendingApproval,
                        }))
                    );
                }
            } catch (error) {
                console.error("Error fetching data", error);
            }
        }
            getData();
    }, [isloggedin]);
        const defaultColDef = useMemo(() => ({
        width: 250,
    }), []);
    const rowSelection = useMemo(() => ({
        mode: "multiRow", headerCheckbox: false,
    }), []);
    const onRowDragEnd = (event) => {
        const updatedRowData = [];
        for (let i = 0; i < event.api.getDisplayedRowCount(); i++) {
            const rowNode = event.api.getDisplayedRowAtIndex(i);
            updatedRowData.push({
                ...rowNode.data,
                position: i + 1,
            });
        }
        setRowData(updatedRowData);
        console.log("Updated deduction Order:", updatedRowData);
    };
    const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
    };
    const handleAdd = () => {
        const newRow = {
            id: `temp-${Date.now()}`, 
            v_DeductionName: '',
            d_order: rowData.length + 1,
            position: rowData.length + 1,
            Type: '',
            isExisting: false,
            isPendingApproval: false,
            canEditOrder: true,
        };
            setRowData((prevRowData) => [...prevRowData, newRow]);
    };
        return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', marginBottom: '10px' }}>
            <div className="ag-theme-quartz" style={{ flex: 0.1, width: 400 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowDragManaged={true}
                    domLayout="autoHeight"
                    rowDragMultiRow={true}
                    rowSelection={rowSelection}
                    onRowDragEnd={onRowDragEnd}
                    onGridReady={onGridReady}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="outlined" color="primary" size="small" onClick={handleAdd}>
                        Add 
                    </Button>
                    <Button variant="outlined" color="primary" size='small' onClick={handleSave}>
                        Save
                    </Button>
                </div>
                <Snackbar 
                    open={alertOpen} 
                    autoHideDuration={3000} 
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={handleClose} 
                        severity={alertSeverity} 
                        sx={{ width: '100%' }}
                    >
                        {saveMessage}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}
export default Deductionmasterbranch;