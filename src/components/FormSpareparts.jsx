import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Checkbox, Container, Fab, FormControlLabel, Grid, makeStyles, Snackbar, TextField, Typography } from "@material-ui/core";
import { ArrowBack, Cancel, Publish, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import partsService from "../services/parts.service";

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
        marginRight: theme.spacing(2),
    }
}));

const FormSpareparts = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const partsId = params.id;
    const isAddMode = !partsId;
    const classes = useStyles();
    const [openAlert, setOpenAlert] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentParts, setCurrentParts] = useState({
        id: null,
        name: "",
        description: "",
        standard: "",
        method: "",
        qty: 0,
        expired_date: "",
        status: false,
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
            partsService.create(values)
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
        }, 400);
    }

    const updateItem = (id, values, setSubmitting) => {
        setDisableButton(true);
        setTimeout(() => {
            partsService.update(id, values)
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
        }, 400);
    }

    useEffect(() => {
        if (!isAddMode) {
            partsService.get(partsId).then(
                (response) => {
                    setCurrentParts(response.data);
                },
                (error) => {
                    const _content =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setCurrentParts(_content);
                    console.log(_content);
                }
            );
        }
    }, [isAddMode, partsId]);


    return (
        <Container className={classes.container}>
            {!user && (
                <Navigate to="/login" replace={true} />
            )}
            {!user.roles.includes("ROLE_SUPERVISOR") ? (
                <Typography>Not Allowed</Typography>
            ) : (
                <React.Fragment>
                    <div className={classes.titleContainer}>
                        <Link to={"/spareparts"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>Spareparts's Form</Typography>
                    </div>
                    <Card>
                        <CardContent>
                            <Formik
                                enableReinitialize
                                initialValues={currentParts}
                                validationSchema={Yup.object({
                                    name: Yup.string().required("Required"),
                                    standard: Yup.string().required("Required"),
                                    method: Yup.string().required("Required"),
                                    expired_date: Yup.string().required("Required"),
                                })}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    if (isAddMode) {
                                        createItem(values, setSubmitting, resetForm);
                                    } else {
                                        updateItem(partsId, values, setSubmitting);
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
                                                        id="name"
                                                        label="Spareparts name"
                                                        autoComplete="name"

                                                        {...formik.getFieldProps('name')}
                                                    />
                                                    {formik.touched.name && formik.errors.name ? (
                                                        <Typography size="small" color="error">{formik.errors.name}</Typography>
                                                    ) : null}
                                                </div>

                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="description"
                                                        label="Spareparts description"
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
                                                        id="standard"
                                                        label="Spareparts standard"
                                                        type="text"
                                                        autoComplete="standard"

                                                        {...formik.getFieldProps('standard')}
                                                    />
                                                    {formik.touched.standard && formik.errors.standard ? (
                                                        <Typography size="small" color="error">{formik.errors.standard}</Typography>
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
                                                        id="method"
                                                        label="Spareparts method"
                                                        type="text"
                                                        autoComplete="method"

                                                        {...formik.getFieldProps('method')}
                                                    />
                                                    {formik.touched.method && formik.errors.method ? (
                                                        <Typography size="small" color="error">{formik.errors.method}</Typography>
                                                    ) : null}
                                                </div>

                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="qty"
                                                        label="Spareparts qty"
                                                        type="text"
                                                        autoComplete="qty"

                                                        {...formik.getFieldProps('qty')}
                                                    />
                                                    {formik.touched.qty && formik.errors.qty ? (
                                                        <Typography size="small" color="error">{formik.errors.qty}</Typography>
                                                    ) : null}
                                                </div>

                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="expired_date"
                                                        label="Spareparts expired_date"
                                                        type="date"
                                                        autoComplete="expired_date"
                                                        {...formik.getFieldProps('expired_date')}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                    {formik.touched.expired_date && formik.errors.expired_date ? (
                                                        <Typography size="small" color="error">{formik.errors.expired_date}</Typography>
                                                    ) : null}
                                                </div>

                                                    <div className={classes.itemCheckbox} >
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    id="status"
                                                                    color="primary"
                                                                    {...formik.getFieldProps('status')}
                                                                    checked={formik.values.status}
                                                                />
                                                            }
                                                            label="Status"
                                                        />
                                                    </div>

                                            </Grid>
                                            <Grid item xs={12} className={classes.actionButton}>
                                                <div className={classes.item}>
                                                    <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit" disabled={disableButton}>
                                                        <Save className={classes.button} />Save
                                                    </Button>
                                                    <Link to={"/spareparts"} className={classes.link}>
                                                        <Button variant="contained" color="secondary" className={classes.buttonContainer} >
                                                            <Cancel className={classes.button} />Cancel
                                                        </Button>
                                                    </Link>
                                                    <Link to={"/spareparts/upload-excel"} className={classes.link}>
                                                        <Button variant="contained" className={classes.buttonContainer} >
                                                            <Publish className={classes.button} /> Import xls
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

export default FormSpareparts;