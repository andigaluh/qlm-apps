import { Card, CardContent, Grid, List, ListItem, ListItemText, Typography, makeStyles, Divider, CardHeader, Avatar } from '@material-ui/core'
import React, { useState, useEffect } from 'react';
import iqcService from '../services/iqc.service';
import { formatdatetime } from '../helpers/DateCustom';

const useStyles = makeStyles((theme) => ({
    label: {
        width: theme.spacing(0),
    },
    cardContent: {
        backgroundColor: theme.palette.warning.dark,
        color: theme.palette.background.default
    }
}));

function DashboardHoldIqc() {
    const classes = useStyles();
    const [dashboardHold, setDashboardHold] = useState([])

    const retrieveHold = () => {
        iqcService.dashboardHold().then(
            (response) => {
                console.log(response.data);
                setDashboardHold(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                console.log(_content)
            });
    };

    useEffect(()  => {
        retrieveHold();
    },[]);


    return (
        <Grid item xs={12} md={6}>
            <Card>
                {dashboardHold.map((value, index) => (
                    <>
                        <CardHeader avatar={
                            <Avatar aria-label="recipe" className={classes.avatar}>
                                IH
                            </Avatar>
                        } title={<Typography variant="h5">IQC HOLD (list) / part under rework and sortir</Typography>} subheader={formatdatetime(value.createdAt) + " WIB"} />
                        <CardContent className={classes.cardContent}>
                            
                            <List>
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
                                    <ListItemText primary={(value.incoming_qty) ? value.incoming_qty : "-"}></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Problem" className={classes.label}></ListItemText>
                                    <ListItemText primary={(value.detail_problem) ? value.detail_problem : "-"}></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Status" className={classes.label}></ListItemText>
                                    <ListItemText primary={(value.status) ? value.status : "-"}></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Action" className={classes.label}></ListItemText>
                                    <ListItemText primary={(value.action) ? value.action : "-"}></ListItemText>
                                </ListItem>
                            </List>
                        </CardContent>
                    </>
                ))}
                
            </Card>
        </Grid>
    )
}

export default DashboardHoldIqc