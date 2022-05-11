import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Container, Fab, Grid, makeStyles, Snackbar, TextField, Typography } from "@material-ui/core";
import { ArrowBack, Cancel, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import Userservice from "../services/users.service";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10)
    },
    titleContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(2)
    },
    link: {
        textDecoration: "none",
    },
    form: {
        padding: theme.spacing(2)
    },
    item: {
        marginBottom: theme.spacing(3)
    },
    actionButton: {
        textAlign: "center"
    },
    button: {
        marginRight: theme.spacing(1),
    },
    buttonContainer: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.down("xs")]: {
            marginBottom: theme.spacing(2)
        }
    },
    textTitleWrapper:{
        display:"flex",
        flexDirection:"column"
    },
    fab: {
        marginRight: theme.spacing(2)
    }
}));

const ResetPassUser = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const userId = params.id;
    const classes = useStyles();
    const [openAlert, setOpenAlert] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentUser, setCurrentUser] = useState({
        id: null,
        password: ""
    });


    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenAlert(false);
    };

    const User = (id) => {
        Userservice.get(id).then(
            (response) => {
                console.log(response.data);
                setCurrentUser(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setCurrentUser(_content);
                console.log(_content);
            }
        );
    }

    useEffect(() => {
        User(userId);
    }, [userId]);


    return (
        <Container className={classes.container}>
            {!user && (
                <Navigate to="/login" replace={true} />
            )}
            {!user.roles.includes("ROLE_ADMIN") ? (
                <Typography>Not Allowed</Typography>
            ) : (
                <React.Fragment>
                    <div className={classes.titleContainer}>
                        <Link to={"/users"}>
                                <Fab color="primary" className={classes.fab} size="small">
                                    <ArrowBack />
                                </Fab>
                        </Link>
                        <div className={classes.textTitleWrapper}>
                            <Typography variant="h4" className={classes.title}>Reset Password</Typography>
                            <Typography variant="h6" className={classes.title2}>{currentUser.username} - {currentUser.name}</Typography>
                        </div>
                    </div>
                    <Card>
                        <CardContent>
                            <Formik
                                initialValues={{
                                    password: "",
                                }}
                                validationSchema={Yup.object({
                                    password: Yup.string().required("Required"),
                                })}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    setTimeout(() => {
                                        var data = {
                                            password: values.password,
                                        };
                                        /* alert(JSON.stringify(data, null, 2));
                                        setSubmitting(false); */
                                        Userservice.resetPassword(userId, data)
                                            .then(
                                                (response) => {
                                                    setSubmitting(false);
                                                    setOpenAlert(true);
                                                    setSnackbarMsg(response.data.message);
                                                },
                                                (error) => {
                                                    const _content =
                                                        (error.response &&
                                                            error.response.data &&
                                                            error.response.data.message) ||
                                                        error.message ||
                                                        error.toString();
                                                    setOpenAlert(true);
                                                    setSnackbarMsg(_content);
                                                }
                                            )
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                    }, 400);
                                }}
                            >
                                {formik => (
                                    <form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="password"
                                                        label="New Password"
                                                        autoComplete="password"
                                                        type="password"
                                                        {...formik.getFieldProps('password')}
                                                    />
                                                    {formik.touched.password && formik.errors.password ? (
                                                        <Typography size="small" color="error">{formik.errors.password}</Typography>
                                                    ) : null}
                                                </div>

                                            </Grid>
                                            <Grid item xs={12} className={classes.actionButton}>
                                                <div className={classes.item}>
                                                    <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit">
                                                        <Save className={classes.button} />Save
                                                    </Button>
                                                    <Link to={"/users"} className={classes.link}>
                                                        <Button variant="contained" color="secondary" className={classes.buttonContainer} >
                                                            <Cancel className={classes.button} />Cancel
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </form>
                                )}
                            </Formik>
                        </CardContent>
                    </Card>

                </React.Fragment>
            )}
            <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={handleClose} severity="success">
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ResetPassUser;