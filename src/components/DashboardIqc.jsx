import { Avatar, Card, CardContent, CardHeader, Grid, List, ListItem, ListItemText, Typography, makeStyles } from '@material-ui/core'
import React, { useState, useEffect } from 'react';
import iqcService from '../services/iqc.service';
import { formatdatetime } from '../helpers/DateCustom';

const useStyles = makeStyles((theme) => ({
    label: {
        width: theme.spacing(0),
    },
    cardContent: {
        backgroundColor: theme.palette.info.main,
        color: theme.palette.background.default
    },
    image: {
        marginBottom: theme.spacing(0),
        maxWidth: "68%",
        padding: theme.spacing(2),
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: theme.palette.info.main,
        color: theme.palette.background.default,
        borderBottom: "1px solid white"
    },
    headerText: {
        padding: theme.spacing(2),

    },
    list: {
        border: "1px solid grey",
        backgroundColor: "white",
        color: "black"
    }
}));

function DashboardIqc() {
    const classes = useStyles();
    const [dashboardIqc, setDashboardIqc] = useState([]);

    const retrieveDashboardIqc = () => {
        iqcService.dashboardIqc().then(
            (response) => {
                console.log(response.data);
                setDashboardIqc(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                console.log(_content)
            }
        );
    }

    useEffect(() => {
        retrieveDashboardIqc();
    }, []);

  return (
      <Grid item xs={12} md={6}>
          <Card>
              {dashboardIqc.map((value, index) => (
                  <>
                    <CardHeader avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            I
                        </Avatar>
                    } title={<Typography variant="h5">IQC Information</Typography>} subheader={formatdatetime(value.createdAt) + " WIB" } />

                      <div className={classes.header} >
                          <img src={"/tech.jpg"} width="100%" alt={value.inspection_sn} className={classes.image} />
                          <Typography variant="h5" className={classes.headerText}>IQC Information</Typography>
                      </div>

              <CardContent className={classes.cardContent}>
                    <List className={classes.list}>
                          <>
                            <ListItem>
                                <ListItemText primary="Part name" className={classes.label}></ListItemText>
                                      <ListItemText primary={(value.parts.parts_name) ? value.parts.parts_name : "-"}></ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Part code" className={classes.label}></ListItemText>
                                      <ListItemText primary={(value.parts.parts_code) ? value.parts.parts_code : "-"}></ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Supplier Name" className={classes.label}></ListItemText>
                                      <ListItemText primary={(value.parts.supplier.supplier_name) ? value.parts.supplier.supplier_name : "-"}></ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Qty" className={classes.label}></ListItemText>
                                      <ListItemText primary={(value.incoming_qty) ? value.incoming_qty : "-" }></ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Problem" className={classes.label}></ListItemText>
                                  <ListItemText primary={(value.detail_problem) ? value.detail_problem : "-"}></ListItemText>
                            </ListItem>
                                  <ListItem>
                                      <ListItemText primary="Action" className={classes.label}></ListItemText>
                                      <ListItemText primary={(value.action) ? value.action : "-"}></ListItemText>
                                  </ListItem>
                            <ListItem>
                                <ListItemText primary="Status" className={classes.label}></ListItemText>
                                      <ListItemText primary={(value.status) ? value.status : "-"}></ListItemText>
                            </ListItem>
                            
                          </>
                      
                      
                  </List>
              </CardContent>
              </>
              ))}
          </Card>
      </Grid>
  )
}

export default DashboardIqc