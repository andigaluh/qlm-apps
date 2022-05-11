import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Checkbox, Container, Fab, FormControlLabel, Grid, makeStyles, MenuItem, Snackbar, TextField, Typography } from "@material-ui/core";
import { ArrowBack, Cancel, Publish, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import partsService from "../services/parts.service";
import supplierService from "../services/supplier.service";

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

const FormParts = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const partsId = params.id;
    const isAddMode = !partsId;
    const classes = useStyles();
    const [openAlert, setOpenAlert] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentSupplier, setSupplier] = useState([])
    const [currentParts, setCurrentParts] = useState({
        id: null,
        parts_code: "",
        parts_name: "",
        status: 1,
        standard: "",
        supplier_id: 1,
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
    };

    const retrieveSupplier = () => {
        supplierService.getAll().then(
            (response) => {
                setSupplier(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setSupplier(_content);
            }
        )
    }

    useEffect(() => {
        retrieveSupplier();
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
            {/* {!user.roles.includes("ROLE_SUPERVISOR") ? (
                <Typography>Not Allowed</Typography>
            ) : ( */}
                <React.Fragment>
                    <div className={classes.titleContainer}>
                        <Link to={"/parts"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>Parts's Form</Typography>
                    </div>
                    <Card>
                        <CardContent>
                            <Formik
                                enableReinitialize
                                initialValues={currentParts}
                                validationSchema={Yup.object({
                                    parts_name: Yup.string().required("Required"),
                                    parts_code: Yup.string().required("Required"),
                                    standard: Yup.string().required("Required"),
                                    supplier_id: Yup.string().required("Required"),
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
                                        <Grid container spacing={2} className={classes.gridContainer}>
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField select label="Supplier" {...formik.getFieldProps('supplier_id')} fullWidth>
                                                        {currentSupplier &&
                                                            currentSupplier.map((v) => (
                                                                <MenuItem value={v.id}>{v.supplier_code}{" - "}{v.supplier_name}</MenuItem>
                                                            ))}
                                                    </TextField>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="parts_code"
                                                        label="Parts code"
                                                        autoComplete="parts_code"

                                                        {...formik.getFieldProps('parts_code')}
                                                    />
                                                    {formik.touched.parts_code && formik.errors.parts_code ? (
                                                        <Typography size="small" color="error">{formik.errors.parts_code}</Typography>
                                                    ) : null}
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="parts_name"
                                                        label="Parts name"
                                                        autoComplete="parts_name"
                                                        {...formik.getFieldProps('parts_name')}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                    {formik.touched.parts_name && formik.errors.parts_name ? (
                                                        <Typography size="small" color="error">{formik.errors.parts_name}</Typography>
                                                    ) : null}
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="standard"
                                                        label="Standard"
                                                        autoComplete="standard"
                                                        {...formik.getFieldProps('standard')}
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                    {formik.touched.standard && formik.errors.standard ? (
                                                        <Typography size="small" color="error">{formik.errors.standard}</Typography>
                                                    ) : null}
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} className={classes.actionButton}>
                                                <div className={classes.item}>
                                                    <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit" disabled={disableButton}>
                                                        <Save className={classes.button} />Save
                                                    </Button>
                                                    <Link to={"/parts"} className={classes.link}>
                                                        <Button variant="contained" color="secondary" className={classes.buttonContainer} >
                                                            <Cancel className={classes.button} />Cancel
                                                        </Button>
                                                    </Link>
                                                    <Link to={"/parts/upload-excel"} className={classes.link}>
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
            {/* )} */}
            <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={handleClose} severity="success">
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default FormParts;