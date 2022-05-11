import { Container, makeStyles, Typography, Collapse } from "@material-ui/core";
import { AccountTree, AssignmentTurnedIn, BrandingWatermark, Build, CheckBox, Code, Colorize, Description, ExitToApp, ExpandLess, ExpandMore, GroupWork, Home, HowToReg, ListAlt, LocalMall, LocalPrintshop, Lock, Opacity, PeopleAlt, Power, Report, ReportProblem, Schedule, Send, Settings, Store, SupervisorAccount, VerifiedUser } from "@material-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { UserContext, InboxContext } from "../UserContext";
import React, { useContext, useState, useEffect } from "react";
import LeftbarManager from "./LeftbarManager";
import LeftbarOperator from "./LeftbarOperator";
import LeftbarSupervisor from "./LeftbarSupervisor";
import LeftbarAdmin from "./LeftbarAdmin";

const useStyles = makeStyles((theme) => ({
    container:{
        paddingTop: theme.spacing(10),
        backgroundColor: theme.palette.primary.main,
        height: "100vh",
        color: "white",
        position: "sticky",
        top: 0,
        [theme.breakpoints.up("sm")]: {
            backgroundColor: "white",
            color: "#555",
            border: "1px solid #ece7e7"
        }
    },
    item: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(4),
        [theme.breakpoints.up("sm")] : {
            marginBottom: theme.spacing(3),
            cursor:"pointer"
        }
    },
    icon: {
        marginRight: theme.spacing(1),
        [theme.breakpoints.up("sm")] : {
            fontSize: "18px"
        }
    },
    iconExpand:{
        marginRight: theme.spacing(1),
        [theme.breakpoints.up("sm")]: {
            fontSize: "18px"
        },
        [theme.breakpoints.down("sm")] : {
            display:"none",
        }
    },
    text: {
        fontWeight: 500,
        [theme.breakpoints.down("sm")]: {
            display: "none"
        },
        [theme.breakpoints.only("sm")]: {
            display: "block",
            fontSize: 12
        }
    },
    link: {
        textDecoration:"none",
        display:"Flex",
        alignItems:"center"
    },
    nested: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(4),
        [theme.breakpoints.up("sm")]: {
            marginBottom: theme.spacing(3),
            cursor: "pointer",
            paddingLeft: theme.spacing(1),
        },
        
    },
}));

const Leftbar = () => {
    const {user, setUser} = useContext(UserContext);
    const {totalNotif, setTotalNotif} = useContext(InboxContext);
    const classes = useStyles();
    let navigate = useNavigate();
    const [openAdmin, setOpenAdmin] = useState(false);
    const [openSetup, setOpenSetup] = useState(false);
    const [openOperator, setOpenOperator] = useState(false);
    const [openEngineer, setOpenEngineer] = useState(false);
    const [openSupervisor, setOpenSupervisor] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const [openIncoming, setOpenIncoming] = useState(false);
    const [openOutgoing, setOpenOutgoing] = useState(false);
    const [openAdminWm, setOpenAdminWm] = useState(false);
    const [openAdminTools, setOpenAdminTools] = useState(false);
    const [openAdminSupplier, setOpenAdminSupplier] = useState(false);

    const handleClickSupervisor = () => {
        setOpenSupervisor(!openSupervisor);
    };

    const handleClickEngineer = () => {
        setOpenEngineer(!openEngineer);
    };

    const handleClickAdmin = () => {
        setOpenAdmin(!openAdmin);
    };

    const handleClickAdminWm = () => {
        setOpenAdminWm(!openAdminWm);
    };

    const handleClickAdminTools = () => {
        setOpenAdminTools(!openAdminTools);
    };

    const handleClickAdminSupplier = () => {
        setOpenAdminSupplier(!openAdminSupplier);
    };

    const handleClickOperator = () => {
        setOpenOperator(!openOperator);
    };

    const handleClickSetup = () => {
        setOpenSetup(!openSetup);
    };

    const handleClickReport = () => {
        setOpenReport(!openReport);
    };

    const handleClickIncoming = () => {
        setOpenIncoming(!openIncoming);
    };

    const handleClickOutgoing = () => {
        setOpenOutgoing(!openOutgoing);
    };

    const handleLogout = () => {
        authService.logout(); 
        setUser(null);
        setTotalNotif(0);
        navigate("../login", { replace: true })
    }

    useEffect(() => {
        
    }, [])

    return (
        <Container className={classes.container}>
            
            <div className={classes.item}>
                <Link to="/" className={classes.link}>
                    <Home className={classes.icon} />
                    <Typography className={classes.text} >Dashboard</Typography>
                </Link>
            </div>
            
            <div className={classes.item}>
                <Link to="/doc-instruction" className={classes.link}>
                    <Description className={classes.icon} />
                    <Typography className={classes.text} >Doc Instruction</Typography>
                </Link>
            </div>

            {user && user.roles.includes("ROLE_MANAGER") && (
                <LeftbarManager />
            )}

            {user && user.roles.includes("ROLE_OPERATOR") && (
                <LeftbarOperator />
            )}

            {user && user.roles.includes("ROLE_SUPERVISOR") && (
                <LeftbarSupervisor />
            )}

            {user && user.roles.includes("ROLE_ADMIN") && (
                <LeftbarAdmin />
            )}

            
            
            {user && (
                <div className={classes.item} onClick={handleLogout}>
                    <ExitToApp className={classes.icon} />
                    <Typography className={classes.text} >Logout</Typography>
                </div>
            )} 
            
        </Container>
    );
};

export default Leftbar;