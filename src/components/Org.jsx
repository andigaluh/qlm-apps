import { Container, makeStyles, Typography, Button } from "@material-ui/core";
import React, { useContext, useState } from "react"
import { UserContext } from "../UserContext";
import { Navigate, Link, Outlet } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10)
    },
    table: {
        marginTop: theme.spacing(2)
    },
    title: {
        marginBottom: theme.spacing(2)
    },
    fab: {
        position: "fixed",
        bottom: 20,
        right: 20
    },
    link:{
        textDecoration: "none"
    },
    btnOrg: {
        marginRight: theme.spacing(2)
    }
}));


const Org = () => {
    const { user } = useContext(UserContext);
    const classes = useStyles();
    const [currentItem, setCurrentItem] = useState([]);
    const [listPage, setListPage] = useState(true);
    const [classPage, setClassPage] = useState(false);

    return (
        <Container className={classes.container}>
                {!user && (
                    <Navigate to="/login" replace={true} />
                )}
                {!user.roles.includes("ROLE_ADMIN") ? (
                    <Typography>Not Allowed</Typography>
                ) : (
                    <React.Fragment>
                            <Typography variant="h4" className={classes.title}>Organization {listPage ? "" : "Class"}</Typography>
                            <div className={classes.submenuWrapper}>
                                <Link to={"/organization/list"} className={classes.link} onClick={() => {setListPage(true); setClassPage(false)}}>
                                    <Button variant={listPage ? "contained" : "outlined"} size="small" className={classes.btnOrg} color={listPage ? "primary" : "default"}>Organization</Button>
                                </Link>
                                <Link to={"/organization/class"} className={classes.link} onClick={() => { setListPage(false); setClassPage(true) }}>
                                    <Button variant={classPage ? "contained" : "outlined"} size="small" className={classes.btnOrgClass} color={classPage ? "primary" : "default"}>Organization Class</Button>
                                </Link>
                            </div>
                        <Outlet/>
                    </React.Fragment>
                )}
        </Container>
    );
};

export default Org;