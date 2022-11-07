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
import outgoingService from "../services/outgoing.service";

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

const FormOutgoing = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const outgoingId = params.id;
    const isAddMode = !outgoingId;
    const classes = useStyles();
    const [openAlert, setOpenAlert] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentSupplier, setSupplier] = useState([])
    const [currentParts, setCurrentParts] = useState({
        id: null,
        model_name: "",
        serial_no: "",
        lot_number: "",
        total_qty: 500,
        note_remark: "",
        barcode: "",
        user_id: user.id
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
            outgoingService.create(values)
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
            outgoingService.update(id, values)
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

    

    useEffect(() => {
        if (!isAddMode) {
            outgoingService.get(outgoingId).then(
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
    }, [isAddMode, outgoingId]);


    return (
        <Container className={classes.container}>
            {!user && (
                <Navigate to="/login" replace={true} />
            )}
            {/* {(!user.roles.includes("ROLE_OPERATOR") || !user.roles.includes("ROLE_SUPERVISOR")) ? (
                <Typography>Not Allowed</Typography>
            ) : (  */}
            <React.Fragment>
                <div className={classes.titleContainer}>
                    <Link to={"/outgoing-list"}>
                        <Fab color="primary" className={classes.fab} size="small">
                            <ArrowBack />
                        </Fab>
                    </Link>
                    <Typography variant="h4" className={classes.title}>Sample Outgoing Form</Typography>
                </div>
                <Card>
                    <CardContent>
                        <Formik
                            enableReinitialize
                            initialValues={currentParts}
                            validationSchema={Yup.object({
                                model_name: Yup.string().required("Required"),
                                serial_no: Yup.string().required("Required"),
                                lot_number: Yup.string().required("Required"),
                            })}
                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                console.log(values)
                                if (isAddMode) {
                                    createItem(values, setSubmitting, resetForm);
                                } else {
                                    updateItem(outgoingId, values, setSubmitting);
                                }
                            }}
                        >
                            {formik => (
                                <form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                                    <Grid container spacing={2} className={classes.gridContainer}>
                                        <Grid item xs={12}>
                                            <div className={classes.item}>
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    id="model_name"
                                                    label="Model Name"
                                                    autoComplete="model_name"

                                                    {...formik.getFieldProps('model_name')}
                                                />
                                                {formik.touched.model_name && formik.errors.model_name ? (
                                                    <Typography size="small" color="error">{formik.errors.model_name}</Typography>
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
                                                    id="serial_no"
                                                    label="Serial Number"
                                                    autoComplete="serial_no"
                                                    {...formik.getFieldProps('serial_no')}
                                                    InputLabelProps={{
                                                        shrink: true
                                                    }}
                                                />
                                                {formik.touched.serial_no && formik.errors.serial_no ? (
                                                    <Typography size="small" color="error">{formik.errors.serial_no}</Typography>
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
                                                    id="lot_number"
                                                    label="Lot Number"
                                                    autoComplete="lot_number"
                                                    {...formik.getFieldProps('lot_number')}
                                                    InputLabelProps={{
                                                        shrink: true
                                                    }}
                                                />
                                                {formik.touched.lot_number && formik.errors.lot_number ? (
                                                    <Typography size="small" color="error">{formik.errors.lot_number}</Typography>
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
                                                    id="total_qty"
                                                    label="Total Qty"
                                                    autoComplete="total_qty"
                                                    {...formik.getFieldProps('total_qty')}
                                                    InputLabelProps={{
                                                        shrink: true
                                                    }}
                                                />
                                                {formik.touched.total_qty && formik.errors.total_qty ? (
                                                    <Typography size="small" color="error">{formik.errors.total_qty}</Typography>
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
                                                    id="note_remark"
                                                    label="Remark"
                                                    autoComplete="note_remark"
                                                    {...formik.getFieldProps('note_remark')}
                                                    InputLabelProps={{
                                                        shrink: true
                                                    }}
                                                />
                                                {formik.touched.note_remark && formik.errors.note_remark ? (
                                                    <Typography size="small" color="error">{formik.errors.note_remark}</Typography>
                                                ) : null}
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} className={classes.actionButton}>
                                            <div className={classes.item}>
                                                <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit" disabled={disableButton}>
                                                    <Save className={classes.button} />Save
                                                </Button>
                                                <Link to={"/outgoing-list"} className={classes.link}>
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
            {/* )} */} 
            <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={handleClose} severity="success">
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default FormOutgoing;