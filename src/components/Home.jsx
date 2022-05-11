import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import DashboardIqc from './DashboardIqc';
import DashboardOqc from './DashboardOqc';
import DashboardHoldIqc from "./DashboardHoldIqc";
import DashboardHoldOqc from "./DashboardHoldOqc"

ChartJS.register(ArcElement, Tooltip, Legend);

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10),
        /* overflow: "auto" */
    },
    wrapperResult: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        alignItems: "center",
        /* backgroundColor: theme.palette.success.light */
    },
    wrapperResultNG: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        alignItems: "center",
        /* backgroundColor: theme.palette.error.light */
    },
    wrapperCompare: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: theme.palette.background.default,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    title: {
        marginBottom: theme.spacing(2)
    },
    result: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center"
    },
    compare: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
    },
    fontOK: {
        color: theme.palette.success.light
    },
    fontNG: {
        color: theme.palette.error.light
    },
    titleTable: {
        paddingBottom: theme.spacing(2)
    },
    label: {
        width: theme.spacing(0),
    }
}));

const Home = () => {
    const classes = useStyles();

    return (
        <Container className={classes.container} maxWidth="xl">
            <Typography variant="h4" className={classes.title}>Dashboard</Typography>
            <Grid container spacing={2}>
                <DashboardIqc />
                <DashboardOqc />
                <DashboardHoldIqc />
                <DashboardHoldOqc />
            </Grid>
        </Container>
    );
};

export default Home;