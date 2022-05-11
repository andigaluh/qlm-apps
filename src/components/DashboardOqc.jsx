import { Avatar, Card, CardContent, CardHeader, Grid, List, ListItem, ListItemText, Typography, makeStyles, CardMedia } from '@material-ui/core'
import React, { useState, useEffect } from 'react';
import { formatdatetime } from '../helpers/DateCustom';
import report_wm_checkService from '../services/report_wm_check.service';

const useStyles = makeStyles((theme) => ({
    label: {
        width: theme.spacing(0),
    },
    cardContent: {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.background.default
    },
    image: {
        marginBottom: theme.spacing(0),
        maxWidth: "70%",
        padding: theme.spacing(2),
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: theme.palette.success.main,
        color: theme.palette.background.default,
        borderBottom: "1px solid white"
    },
    headerText: {
        padding: theme.spacing(2),
        
    },
    list : {
        border: "1px solid grey",
        backgroundColor: "white",
        color: "black"
    }
}));

function DashboardOqc() {
    const classes = useStyles();
    const [dashboardOqc, setDashboardOqc] = useState([]);

    const retrieveDashboardOqc = () => {
        report_wm_checkService.dashboardOqc().then(
            (response) => {
                console.log(response.data);
                setDashboardOqc(response.data);
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
        )
    };

    useEffect(() => {
        retrieveDashboardOqc();
    }, [])

    return (
        <Grid item xs={12} md={6}>
            <Card>
                {dashboardOqc.map((value, index) => (
                    <>
                        <CardHeader avatar={
                            <Avatar aria-label="recipe" className={classes.avatar}>
                                O
                            </Avatar>
                        } title={<Typography variant="h5">OQC Information</Typography>} subheader={formatdatetime(value.createdAt) + " WIB"}></CardHeader>
                        <div className={classes.header} >
                            <img src={value.photo_name} width="100%" alt={value.inspection_sn} className={classes.image} />
                            <Typography variant="h5" className={classes.headerText}>OQC Information</Typography>
                        </div>
                        
                        <CardContent className={classes.cardContent}>
                            <List className={classes.list}>
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

export default DashboardOqc