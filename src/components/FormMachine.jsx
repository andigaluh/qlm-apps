import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Container, Fab, Grid, makeStyles, Snackbar, TextField, Typography } from "@material-ui/core";
import { ArrowBack, Cancel, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import machineService from "../services/machine.service";

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
    fab: {
        marginRight: theme.spacing(2)
    }
}));

const FormMachine = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const machineId = params.id;
    const isAddMode = !machineId;
    const classes = useStyles();
    const [openAlert, setOpenAlert] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentMachine, setCurrentMachine] = useState({
        id: null,
        code: "",
        name: "",
        description: "",
        location: "",
        status: true,
    });

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenAlert(false);
    };

    const createItem = (values, setSubmitting, resetForm) => {
        setDisableButton(true);
        setTimeout(() => {
            var data = {
                code: values.code,
                name: values.name,
                description: values.description,
                location: values.location,
                status: values.status,
            };
            machineService.create(data)
                .then(
                    (response) => {
                        setSubmitting(false);
                        setOpenAlert(true);
                        setSnackbarMsg(response.data.message);
                        setDisableButton(false);
                        resetForm();
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
                        setDisableButton(false);
                    }
                )
                .catch((error) => {
                    setDisableButton(false);
                    console.log(error);
                });
            //alert(JSON.stringify(data, null, 2));
        }, 400);
    }

    const updateItem = (id, values, setSubmitting) => {
        setDisableButton(true);
        setTimeout(() => {
            var data = {
                code: values.code,
                name: values.name,
                description: values.description,
                location: values.location,
                status: values.status,
            };

            machineService.update(id, data)
                .then(
                    (response) => {
                        setSubmitting(false);
                        setOpenAlert(true);
                        setSnackbarMsg(response.data.message);
                        setDisableButton(false);
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
                        setDisableButton(false);
                    }
                )
                .catch((error) => {
                    setDisableButton(false);
                    console.log(error);
                });

            /* alert(JSON.stringify(data, null, 2));
                          setSubmitting(false); */
        }, 400);
    }

    useEffect(() => {
        if (!isAddMode) {
            machineService.get(machineId).then(
                (response) => {
                    setCurrentMachine(response.data);
                },
                (error) => {
                    const _content =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setCurrentMachine(_content);
                    console.log(_content);
                }
            );
        }
    }, [isAddMode, machineId]);


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
                        <Link to={"/machines"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>Machine's Form</Typography>
                    </div>
                    <Card>
                        <CardContent>
                                <Formik
                                    enableReinitialize
                                    initialValues={currentMachine}
                                    validationSchema={Yup.object({
                                        code: Yup.string().required("Required"),
                                        name: Yup.string().required("Required"),
                                    })}
                                    onSubmit={(values, { setSubmitting, resetForm }) => {
                                        if (isAddMode) {
                                            createItem(values, setSubmitting, resetForm);
                                        } else {
                                            updateItem(machineId, values, setSubmitting);
                                        }
                                    }}
                                >
                                {formik => (
                                    <form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="code"
                                                        label="Code"
                                                        autoComplete="code"

                                                        {...formik.getFieldProps('code')}
                                                    />
                                                    {formik.touched.code && formik.errors.code ? (
                                                        <Typography size="small" color="error">{formik.errors.code}</Typography>
                                                    ) : null}
                                                </div>

                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="name"
                                                        label="Machine name"
                                                        autoComplete="name"

                                                        {...formik.getFieldProps('name')}
                                                    />
                                                    {formik.touched.name && formik.errors.name ? (
                                                        <Typography size="small" color="error">{formik.errors.name}</Typography>
                                                    ) : null}
                                                </div>

                                                
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="description"
                                                        label="Description"
                                                        type="text"
                                                        autoComplete="description"

                                                        {...formik.getFieldProps('description')}
                                                    />
                                                    {formik.touched.description && formik.errors.description ? (
                                                        <Typography size="small" color="error">{formik.errors.description}</Typography>
                                                    ) : null}
                                                </div>

                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="location"
                                                        label="Location"
                                                        type="text"
                                                        autoComplete="location"

                                                        {...formik.getFieldProps('location')}
                                                    />
                                                    {formik.touched.location && formik.errors.location ? (
                                                        <Typography size="small" color="error">{formik.errors.location}</Typography>
                                                    ) : null}
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} className={classes.actionButton}>
                                                <div className={classes.item}>
                                                    <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit" disabled={disableButton}>
                                                        <Save className={classes.button} />Save
                                                    </Button>
                                                    <Link to={"/machines"} className={classes.link}>
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

export default FormMachine;