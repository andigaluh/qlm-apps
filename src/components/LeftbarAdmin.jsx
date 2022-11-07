import React, { useState } from "react";
import { Collapse, makeStyles, Typography } from "@material-ui/core";
import { AccountTree, BrandingWatermark, Build, CheckBox, Colorize, Description, ExpandLess, ExpandMore, ListAlt, LocalMall, PeopleAlt, Power, Report, Schedule, Settings, Store, SupervisorAccount } from "@material-ui/icons";
import { Link } from "react-router-dom";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';


const useStyles = makeStyles((theme) => ({
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
    iconExpand: {
        marginRight: theme.spacing(1),
        [theme.breakpoints.up("sm")]: {
            fontSize: "18px"
        },
        [theme.breakpoints.down("sm")]: {
            display: "none",
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
            paddingLeft: theme.spacing(3),
        },
    },
    subnested: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(4),
        [theme.breakpoints.up("sm")]: {
            marginBottom: theme.spacing(3),
            cursor: "pointer",
            paddingLeft: theme.spacing(6),
        },
    },
}));

const LeftbarAdmin = () => {
    const classes = useStyles();
    const [openIncoming, setOpenIncoming] = useState(false);
    const [openOutgoing, setOpenOutgoing] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const [openAdmin, setOpenAdmin] = useState(false);
    const [openAdminWm, setOpenAdminWm] = useState(false);
    const [openAdminTools, setOpenAdminTools] = useState(false);
    const [openAdminSupplier, setOpenAdminSupplier] = useState(false);
    const [openSetup, setOpenSetup] = useState(false);

    const handleClickIncoming = () => {
        setOpenIncoming(!openIncoming);
    };

    const handleClickOutgoing = () => {
        setOpenOutgoing(!openOutgoing);
    };

    const handleClickReport = () => {
        setOpenReport(!openReport);
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

    const handleClickSetup = () => {
        setOpenSetup(!openSetup);
    };

    return (
        <React.Fragment>
            {/* START MASTER */}
            <div className={classes.item} onClick={handleClickAdmin}>
                <SupervisorAccount className={classes.icon} />
                <Typography className={classes.text} >Master</Typography>
                {openAdmin ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
            </div>

            <Collapse in={openAdmin} timeout="auto" unmountOnExit>
                

                <div className={classes.nested} onClick={handleClickAdminTools}>
                    <Build className={classes.icon} />
                    <Typography className={classes.text} >Tools</Typography>
                    {openAdminTools ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
                </div>

                <Collapse in={openAdminTools} timeout="auto" unmountOnExit>
                    <div className={classes.subnested}>
                        <Link to="/tools-type" className={classes.link}>
                            <ListAlt className={classes.icon} />
                            <Typography className={classes.text} >Type</Typography>
                        </Link>
                    </div>

                    <div className={classes.subnested}>
                        <Link to="/tools" className={classes.link}>
                            <Colorize className={classes.icon} />
                            <Typography className={classes.text} >Tools</Typography>
                        </Link>
                    </div>
                </Collapse>

                <div className={classes.nested} onClick={handleClickAdminSupplier}>
                    <LocalShippingIcon className={classes.icon} />
                    <Typography className={classes.text} >Supplier & Parts</Typography>
                    {openAdminSupplier ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
                </div>

                <Collapse in={openAdminSupplier} timeout="auto" unmountOnExit>
                    <div className={classes.subnested}>
                        <Link to="/supplier" className={classes.link}>
                            <Store className={classes.icon} />
                            <Typography className={classes.text} >Supplier</Typography>
                        </Link>
                    </div>

                    <div className={classes.subnested}>
                        <Link to="/parts" className={classes.link}>
                            <Power className={classes.icon} />
                            <Typography className={classes.text} >Parts</Typography>
                        </Link>
                    </div>
                </Collapse>

                <div className={classes.nested} onClick={handleClickAdminWm}>
                    <BrandingWatermark className={classes.icon} />
                    <Typography className={classes.text} >Washing Machine</Typography>
                    {openAdminWm ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
                </div>

                <Collapse in={openAdminWm} timeout="auto" unmountOnExit>

                    <div className={classes.subnested}>
                        <Link to="/wm-type" className={classes.link}>
                            <ListAlt className={classes.icon} />
                            <Typography className={classes.text} >Type</Typography>
                        </Link>
                    </div>

                    <div className={classes.subnested}>
                        <Link to="/wm-model" className={classes.link}>
                            <Description className={classes.icon} />
                            <Typography className={classes.text} >Model</Typography>
                        </Link>
                    </div>

                    <div className={classes.subnested}>
                        <Link to="/wm-item-category" className={classes.link}>
                            <ListAlt className={classes.icon} />
                            <Typography className={classes.text} >Item Check Category</Typography>
                        </Link>
                    </div>

                    <div className={classes.subnested}>
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
                    <Link to="/daily-report-admin" className={classes.link}>
                        <Description className={classes.icon} />
                        <Typography className={classes.text} >Daily Report Admin</Typography>
                    </Link>
                </div>
            </Collapse>
            {/* START MASTER */}

            {/* START SETUP */}
            <div className={classes.item} onClick={handleClickSetup}>
                <Settings className={classes.icon} />
                <Typography className={classes.text} >Setup</Typography>
                {openSetup ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
            </div>

            <Collapse in={openSetup} timeout="auto" unmountOnExit>
                <div className={classes.nested}>
                    <Link to="/users" className={classes.link}>
                        <PeopleAlt className={classes.icon} />
                        <Typography className={classes.text} >Users</Typography>
                    </Link>
                </div>

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
            {/* END SETUP */}
        </React.Fragment>
    );
};

export default LeftbarAdmin;