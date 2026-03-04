import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import React from "react";
import { ServerConfig } from "../../serverconfiguration/serverconfig";
import { NATTENDANCE, REPORTS } from "../../serverconfiguration/controllers";
import { getRequest, postRequest } from "../../serverconfiguration/requestcomp";
import { Button } from "@mui/material";
import {
  Box,
  Grid,
  Typography,
} from "@mui/material";
import "../../App.css";
import Sidenav from "../Home Page3/Sidenav2";
import Navbar from "../Home Page3/Navbar2";

class EmployeeDashBoard2 extends React.Component {
  constructor() {
    super();
    this.state = {
      attendance: [],
    };
  }

//  componentDidMount() {
//   const dbname = sessionStorage.getItem("databaseName");
//   getRequest(ServerConfig.url, `${NATTENDANCE}?dbname=${dbname}`)
//     .then((e) => {
//       this.setState({ attendance: e.data });
//     });
// }

componentDidMount() {
  const dbname = sessionStorage.getItem("databaseName");
  const empCode = sessionStorage.getItem("user");

  postRequest(ServerConfig.url, REPORTS, {
    // dbname: dbname,
    query: `
      SELECT *
      FROM [${dbname}].[dbo].[time_card]
      WHERE emp_code = '${empCode}'
      ORDER BY dates DESC
    `
  }).then((res) => {
    this.setState({ attendance: res.data });
  });
}

  render() {
    const convertedEvents = this.state.attendance.map((record) => ({
      title: record.status,
      start: record.intime, // Assuming intime is the start time of the event
      end: record.outtime, // Assuming out_time is the end time of the event
    }));

    return (
      <Grid container>
        {/* Navbar and Sidebar */}
        <Grid item xs={12}>
          <div style={{ backgroundColor: "#f5f5f5" }}>
            <Navbar />
            <Box height={30} />
            <Box sx={{ display: "flex" }}>
              <Sidenav />
              {/* Main Content */}
              <Grid item xs={12} sm={10} md={9} lg={8} xl={7} sx={{ margin: "50px auto", textAlign: 'left' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <div style={{ width: "100%", maxWidth: "800px", height: "400px" }}>
                    <FullCalendar  
                      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                      initialView="dayGridMonth"
                      weekends={true}
                      events={convertedEvents}
                      displayEventTime={false}
                      headerToolbar={{
                        start: "today,prev,next",
                        center: "title",
                        end: "dayGridMonth,timeGridWeek,timeGridDay",
                      }}
                    />
                  </div>
                </Box>
              </Grid>
            </Box>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default EmployeeDashBoard2;
