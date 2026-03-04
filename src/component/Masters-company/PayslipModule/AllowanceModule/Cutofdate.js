import React, { useEffect, useState } from "react";
import { TextField, FormControl, Grid, Container, Card, CardContent } from "@mui/material";
import { REPORTS } from "../../../../serverconfiguration/controllers";
import { ServerConfig } from "../../../../serverconfiguration/serverconfig";
import { postRequest } from "../../../../serverconfiguration/requestcomp";

function Cutofdate() {
  const [isloggedin, setisloggedin] = useState(sessionStorage.getItem("user"));
  const [Company, setCompany] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const Companydata = await postRequest(ServerConfig.url, REPORTS, {
          query: `select * from paym_company where Company_User_Id = '${isloggedin}'`,
        });
        setCompany(Companydata.data);
        console.log("Companydata", Companydata.data);

        if (Companydata.data && Companydata.data.length > 0) {

            const Branchdata = await postRequest(ServerConfig.url, REPORTS, {
                query : "select * from paym_Branch where pn"
            })
        }
      } catch (error) {
        console.error("Error Fetching Data", error);
      }
    }
    getData();
  }, [isloggedin]);

  return (
    <div>
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7} style={{ marginLeft: "auto", marginRight: "auto" }}>
              <Container maxWidth="md" sx={{ p: 2 }}>
                <Grid style={{ padding: '80px 5px 0 5px' }}>
                  <Card style={{ maxWidth: 600, margin: '0 auto' }}>
                    <CardContent>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
      {Company.length === 0 ? (
        <p>No Company Data Available</p>
      ) : (
        <FormControl fullWidth>
          <TextField
          label= 'Company Name'
            value={Company[0].CompanyName || ""}
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            inputProps={{
              "data-company-id": Company[0].pn_CompanyID, // Attribute for value as pn_CompanyID
            }}
          />
        </FormControl>
      )}
      <Grid item xs = {12} sm= {6}>

      </Grid>
      </Grid>
      </Grid>
      </CardContent>
      </Card>
      </Grid>
      </Container>
      </Grid>
    </div>
  );
}

export default Cutofdate;
