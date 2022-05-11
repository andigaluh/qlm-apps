import { AppBar, makeStyles, Toolbar, Typography, alpha, Badge, Avatar } from "@material-ui/core";
import { grey, red } from "@material-ui/core/colors";
import { Mail, Notifications } from "@material-ui/icons"
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext, InboxContext } from "../UserContext";

const useStyles = makeStyles((theme) => ({
    logoLg: {
        display: "none",
        [theme.breakpoints.up("sm")] : {
            display: "block"
        }
    },
    logoSm: {
        display: "block",
        [theme.breakpoints.up("sm")] : {
            display: "none"
        }
    },
    toolbar : {
        display: "flex",
        justifyContent: "space-between",
    },
    search: {
        display: "flex",
        alignItems: "center",
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        borderRadius: theme.shape.borderRadius,
        width: "50%",
        [theme.breakpoints.down("xs")]: {
            display: (props) =>  (props.open) ? "flex" : "none",
            width: "70%"
        }
    },
    input : {
        color: "white",
        marginLeft: theme.spacing(1)
    },
    icons: {
        alignItems: "center",
        display: (props) => (props.open ? "none" : "flex"),
    },
    badge: {
        marginRight: theme.spacing(2)
    },
    cancel: {
        [theme.breakpoints.up("sm")] : {
            display: "none"
        }
    },
    searchButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("sm")]: {
            display: "none",

        }
    },
    username:{
        marginLeft: theme.spacing(1),
        color: theme.palette.info.dark,
        textDecoration:"none",
    },
    link:{
        color: theme.palette.info.dark,
    },
    avatar: {
        backgroundColor: grey,
    },
    appbar: {
        backgroundColor: "white",
        color: theme.palette.info.dark,
    }
}));

const Navbar = () => {
    const { user } = useContext(UserContext);
    const { totalNotif } = useContext(InboxContext); 
    const [open, setOpen] = useState(false);
    const classes = useStyles({ open });

    return (
        <AppBar position="fixed" className={classes.appbar}>
            <Toolbar className={classes.toolbar}>
                <Typography variant="h6" className={classes.logoLg}>
                    <img src={"/images/logo-sharp.jpg"} width="120" alt="logo" style={{marginTop: 7}}/>
                    {/* Q Pass System */}
                </Typography>
                <Typography variant="h6" className={classes.logoSm}>
                    App
                </Typography>
                
                <div className={classes.icons}>
                    {user ? (
                        <React.Fragment>
                            <Link to={"/inbox"} className={classes.link}>
                                <Badge badgeContent={totalNotif} color="secondary" className={classes.badge}>
                                    <Notifications />
                                </Badge>
                            </Link>
                            <Avatar alt={user.name} className={classes.avatar}>
                                {user.name.toUpperCase().substring(0,1)}
                            </Avatar>
                            <Typography className={classes.username}>{user.name}</Typography>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Link to="login">
                                <Typography className={classes.username}>Login</Typography>
                            </Link>
                        </React.Fragment>
                    )}
                    
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;