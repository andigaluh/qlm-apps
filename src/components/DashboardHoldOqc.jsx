import { Avatar, Card, CardContent, CardHeader, Grid, List, ListItem, ListItemText, Typography, makeStyles } from '@material-ui/core'
import React, { useState, useEffect } from 'react';
import report_wm_checkService from '../services/report_wm_check.service';
import { formatdatetime } from '../helpers/DateCustom';

const useStyles = makeStyles((theme) => ({
    label: {
        width: theme.spacing(0),
    },
    cardContent : {
        backgroundColor: theme.palette.error.dark,
        color: theme.palette.background.default
    }
}));

function DashboardHoldOqc() {
    const classes = useStyles();
    const [dashboardHolOqc, setDashboardHoldOqc] = useState([]);

    const retrieveDashboardHoldOqc = () => {
        report_wm_checkService.dashboardHoldOqc().then(
            (response) => {
                console.log(response.data);
                setDashboardHoldOqc(response.data);
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
    };

    useEffect(() => {
        retrieveDashboardHoldOqc();
    },[])

    return (
        <Grid item xs={12} md={6}>
            <Card>
                {dashboardHolOqc.map((value, index) => (
                <>
                    <CardHeader avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            IH
                        </Avatar>
                    } title={<Typography variant="h5">OQC HOLD (list) / part under rework and sortir</Typography>} subheader={formatdatetime(value.createdAt) + " WIB"} />
                        <CardContent className={classes.cardContent}>
                        <List>
                                <ListItem>
                                    <ListItemText primary="WM Type" className={classes.label}></ListItemText>
                                    <ListItemText primary={(value.wm_type_name) ? value.wm_type_name : "-"}></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Model" className={classes.label}></ListItemText>
                                    <ListItemText primary={(value.wm_model_name) ? value.wm_model_name : "-"}></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Serial Number" className={classes.label}></ListItemText>
                                    <ListItemText primary={(value.inspection_sn) ? value.inspection_sn : "-"}></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Qty" className={classes.label}></ListItemText>
                                    <ListItemText primary={(value.inspection_qty) ? value.inspection_qty : "-"}></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Total Check" className={classes.label}></ListItemText>
                                    <ListItemText primary={(value.total_check_item) ? value.total_check_item : "-"}></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Jumlah NG" className={classes.label}></ListItemText>
                                    <ListItemText primary={(value.jumlah_item_ng) ? value.jumlah_item_ng : "-"}></ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary="Status" className={classes.label}></ListItemText>
                                    <ListItemText primary={(value.inspection_status) ? value.inspection_status : "-"}></ListItemText>
                                </ListItem>

                        </List>
                    </CardContent>
                </>
                ))}
            </Card>
        </Grid>
    )
}

export default DashboardHoldOqc