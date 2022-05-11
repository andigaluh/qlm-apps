import { Container, makeStyles, Typography, Collapse } from "@material-ui/core";
import { AccountTree, AssignmentTurnedIn, BrandingWatermark, Build, CheckBox, Code, Colorize, Description, ExitToApp, ExpandLess, ExpandMore, GroupWork, Home, HowToReg, ListAlt, LocalMall, LocalPrintshop, Lock, Opacity, PeopleAlt, Power, Report, ReportProblem, Schedule, Send, Settings, Store, SupervisorAccount, VerifiedUser } from "@material-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { UserContext, InboxContext } from "../UserContext";
import React, { useContext, useState, useEffect } from "react";

const useStyles = makeStyles((theme) => ({
    container: {
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
        [theme.breakpoints.up("sm")]: {
            marginBottom: theme.spacing(3),
            cursor: "pointer"
        }
    },
    icon: {
        marginRight: theme.spacing(1),
        [theme.breakpoints.up("sm")]: {
            fontSize: "18px"
        }
    },
    iconExpand: {
        marginRight: theme.spacing(1),
        [theme.breakpoints.up("sm")]: {
            fontSize: "18px"
        },
        [theme.breakpoints.down("sm")]: {
            display: "none",
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
        textDecoration: "none",
        display: "Flex",
        alignItems: "center"
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
    const { user, setUser } = useContext(UserContext);
    const { totalNotif, setTotalNotif } = useContext(InboxContext);
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

            <div className={classes.item} onClick={handleClickIncoming}>
                <Report className={classes.icon} />
                <Typography className={classes.text} >Incoming</Typography>
                {openIncoming ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
            </div>

            <Collapse in={openIncoming} timeout="auto" unmountOnExit>

                {user && user.roles.includes("ROLE_OPERATOR") && (
                    <div className={classes.item}>
                        <Link to="/iqc" className={classes.link}>
                            <Description className={classes.icon} />
                            <Typography className={classes.text} >Check Sheet</Typography>
                        </Link>
                    </div>
                )}


                {user && user.roles.includes("ROLE_SUPERVISOR") && (
                    <React.Fragment>
                        <div className={classes.item}>
                            <Link to="/iqc-hold" className={classes.link}>
                                <Description className={classes.icon} />
                                <Typography className={classes.text} >Hold List</Typography>
                            </Link>
                        </div>

                        <div className={classes.item}>
                            <Link to="/iqc-summary" className={classes.link}>
                                <Description className={classes.icon} />
                                <Typography className={classes.text} >Summary</Typography>
                            </Link>
                        </div>
                    </React.Fragment>
                )}



            </Collapse>

            <div className={classes.item} onClick={handleClickOutgoing}>
                <Report className={classes.icon} />
                <Typography className={classes.text} >Outgoing</Typography>
                {openOutgoing ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
            </div>

            <Collapse in={openOutgoing} timeout="auto" unmountOnExit>

                {user && user.roles.includes("ROLE_OPERATOR") && (
                    <div className={classes.item}>
                        <Link to="/oqc" className={classes.link}>
                            <Description className={classes.icon} />
                            <Typography className={classes.text} >Check Sheet</Typography>
                        </Link>
                    </div>
                )}

                {user && user.roles.includes("ROLE_SUPERVISOR") && (
                    <React.Fragment>
                        <div className={classes.item}>
                            <Link to="/approval-oqc" className={classes.link}>
                                <Description className={classes.icon} />
                                <Typography className={classes.text} >Appr. Check Sheet</Typography>
                            </Link>
                        </div>

                        {/* <div className={classes.item}>
                            <Link to="/oqc-hold" className={classes.link}>
                                <Description className={classes.icon} />
                                <Typography className={classes.text} >Hold List</Typography>
                            </Link>
                        </div> */}
                    </React.Fragment>
                )}

                {/* <div className={classes.item}>
                    <Link to="/oqc-summary" className={classes.link}>
                        <Description className={classes.icon} />
                        <Typography className={classes.text} >Summary</Typography>
                    </Link>
                </div> */}

            </Collapse>



            {user && (user.roles.includes("ROLE_SUPERVISOR") || user.roles.includes("ROLE_MANAGER")) && (
                <React.Fragment>

                    <div className={classes.item}>
                        <Link to="/schedule-qc" className={classes.link}>
                            <Description className={classes.icon} />
                            <Typography className={classes.text} >Schedule QC</Typography>
                        </Link>
                    </div>

                    <div className={classes.item} onClick={handleClickReport}>
                        <Report className={classes.icon} />
                        <Typography className={classes.text} >Report</Typography>
                        {openReport ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
                    </div>

                    <Collapse in={openReport} timeout="auto" unmountOnExit>

                        <div className={classes.nested}>
                            <Link to="/report/tools" className={classes.link}>
                                <Colorize className={classes.icon} />
                                <Typography className={classes.text} >Tools</Typography>
                            </Link>
                        </div>

                    </Collapse>

                </React.Fragment>
            )}

            {user && user.roles.includes("ROLE_ADMIN") && (
                <React.Fragment>
                    <div className={classes.item} onClick={handleClickAdmin}>
                        <SupervisorAccount className={classes.icon} />
                        <Typography className={classes.text} >Admin</Typography>
                        {openAdmin ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
                    </div>

                    <Collapse in={openAdmin} timeout="auto" unmountOnExit>


                        <div className={classes.item} onClick={handleClickAdminTools}>
                            <Build className={classes.icon} />
                            <Typography className={classes.text} >Tools</Typography>
                            {openAdminTools ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
                        </div>

                        <Collapse in={openAdminTools} timeout="auto" unmountOnExit>
                            <div className={classes.nested}>
                                <Link to="/tools-type" className={classes.link}>
                                    <ListAlt className={classes.icon} />
                                    <Typography className={classes.text} >Type</Typography>
                                </Link>
                            </div>

                            <div className={classes.nested}>
                                <Link to="/tools" className={classes.link}>
                                    <Colorize className={classes.icon} />
                                    <Typography className={classes.text} >Tools</Typography>
                                </Link>
                            </div>
                        </Collapse>

                        <div className={classes.item} onClick={handleClickAdminSupplier}>
                            <Build className={classes.icon} />
                            <Typography className={classes.text} >Supplier & Parts</Typography>
                            {openAdminSupplier ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
                        </div>

                        <Collapse in={openAdminSupplier} timeout="auto" unmountOnExit>
                            <div className={classes.nested}>
                                <Link to="/supplier" className={classes.link}>
                                    <Store className={classes.icon} />
                                    <Typography className={classes.text} >Supplier</Typography>
                                </Link>
                            </div>

                            <div className={classes.nested}>
                                <Link to="/parts" className={classes.link}>
                                    <Power className={classes.icon} />
                                    <Typography className={classes.text} >Parts</Typography>
                                </Link>
                            </div>
                        </Collapse>

                        <div className={classes.item} onClick={handleClickAdminWm}>
                            <BrandingWatermark className={classes.icon} />
                            <Typography className={classes.text} >Washing Machine</Typography>
                            {openAdminWm ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
                        </div>

                        <Collapse in={openAdminWm} timeout="auto" unmountOnExit>

                            <div className={classes.nested}>
                                <Link to="/wm-type" className={classes.link}>
                                    <ListAlt className={classes.icon} />
                                    <Typography className={classes.text} >Type</Typography>
                                </Link>
                            </div>

                            <div className={classes.nested}>
                                <Link to="/wm-model" className={classes.link}>
                                    <Description className={classes.icon} />
                                    <Typography className={classes.text} >Model</Typography>
                                </Link>
                            </div>

                            <div className={classes.nested}>
                                <Link to="/wm-item-category" className={classes.link}>
                                    <ListAlt className={classes.icon} />
                                    <Typography className={classes.text} >Item Check Category</Typography>
                                </Link>
                            </div>

                            <div className={classes.nested}>
                                <Link to="/wm-item" className={classes.link}>
                                    <CheckBox className={classes.icon} />
                                    <Typography className={classes.text} >Item Check</Typography>
                                </Link>
                            </div>

                        </Collapse>

                        <div className={classes.nested}>
                            <Link to="/doc-inspection" className={classes.link}>
                                <Description className={classes.icon} />
                                <Typography className={classes.text} >Doc Inspection</Typography>
                            </Link>
                        </div>

                        <div className={classes.nested}>
                            <Link to="/users" className={classes.link}>
                                <PeopleAlt className={classes.icon} />
                                <Typography className={classes.text} >Users</Typography>
                            </Link>
                        </div>


                    </Collapse>

                    <div className={classes.item} onClick={handleClickSetup}>
                        <Settings className={classes.icon} />
                        <Typography className={classes.text} >Setup</Typography>
                        {openSetup ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
                    </div>

                    <Collapse in={openSetup} timeout="auto" unmountOnExit>
                        <div className={classes.nested}>
                            <Link to="/organization/list" className={classes.link}>
                                <AccountTree className={classes.icon} />
                                <Typography className={classes.text} >Organization</Typography>
                            </Link>
                        </div>
                        <div className={classes.nested}>
                            <Link to="/job/list" className={classes.link}>
                                <LocalMall className={classes.icon} />
                                <Typography className={classes.text} >Job</Typography>
                            </Link>
                        </div>
                        <div className={classes.nested}>
                            <Link to="/shift" className={classes.link}>
                                <Schedule className={classes.icon} />
                                <Typography className={classes.text} >Shift</Typography>
                            </Link>
                        </div>

                    </Collapse>

                </React.Fragment>
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