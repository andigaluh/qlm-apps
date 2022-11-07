import React, { useState } from "react";
import { Collapse, makeStyles, Typography } from "@material-ui/core";
import { Description, ExpandLess, ExpandMore, Report, Colorize } from "@material-ui/icons";
import { Link } from "react-router-dom";


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
            paddingLeft: theme.spacing(2),
        },
    },
}));

const LeftbarManager = () => {
    const classes = useStyles();
    const [openIncoming, setOpenIncoming] = useState(false);
    const [openOutgoing, setOpenOutgoing] = useState(false);
    const [openReport, setOpenReport] = useState(false);

    const handleClickIncoming = () => {
        setOpenIncoming(!openIncoming);
    };

    const handleClickOutgoing = () => {
        setOpenOutgoing(!openOutgoing);
    };

    const handleClickReport = () => {
        setOpenReport(!openReport);
    };

    return (
        <React.Fragment>

            {/* START REPORT */}
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

                <div className={classes.nested}>
                    <Link to="/report/schedule-qc" className={classes.link}>
                        <Colorize className={classes.icon} />
                        <Typography className={classes.text} >Schedule QC</Typography>
                    </Link>
                </div>

                <div className={classes.nested}>
                    <Link to="/iqc-summary" className={classes.link}>
                        <Description className={classes.icon} />
                        <Typography className={classes.text} >Incoming</Typography>
                    </Link>
                </div>
                <div className={classes.nested}>
                    <Link to="/report/oqc" className={classes.link}>
                        <Description className={classes.icon} />
                        <Typography className={classes.text} >Outgoing</Typography>
                    </Link>
                </div>
                <div className={classes.nested}>
                    <Link to="/report/outgoing" className={classes.link}>
                        <Description className={classes.icon} />
                        <Typography className={classes.text} >Sample Outgoing</Typography>
                    </Link>
                </div>
            </Collapse>
            {/* END REPORT */}


            {/* <div className={classes.item} onClick={handleClickIncoming}>
                <Report className={classes.icon} />
                <Typography className={classes.text} >Incoming</Typography>
                {openIncoming ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
            </div>

            <Collapse in={openIncoming} timeout="auto" unmountOnExit>
                <div className={classes.nested}>
                    <Link to="/iqc-summary" className={classes.link}>
                        <Description className={classes.icon} />
                        <Typography className={classes.text} >Summary</Typography>
                    </Link>
                </div>
            </Collapse>

            <div className={classes.item} onClick={handleClickOutgoing}>
                <Report className={classes.icon} />
                <Typography className={classes.text} >Outgoing</Typography>
                {openOutgoing ? <ExpandLess className={classes.iconExpand} /> : <ExpandMore className={classes.iconExpand} />}
            </div>

            <Collapse in={openOutgoing} timeout="auto" unmountOnExit>
                <div className={classes.nested}>
                    <Link to="/approval-oqc" className={classes.link}>
                        <Description className={classes.icon} />
                        <Typography className={classes.text} >Appr. Check Sheet</Typography>
                    </Link>
                </div>
            </Collapse>

            <div className={classes.item}>
                <Link to="/schedule-qc" className={classes.link}>
                    <Description className={classes.icon} />
                    <Typography className={classes.text} >Schedule QC</Typography>
                </Link>
            </div> */}
        </React.Fragment>
    );
};

export default LeftbarManager;