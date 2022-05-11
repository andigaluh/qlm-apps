import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Checkbox, Container, Fab, FormControl, FormControlLabel, Grid, Input, InputBase, InputLabel, LinearProgress, makeStyles, MenuItem, OutlinedInput, Snackbar, TextField, Typography } from "@material-ui/core";
import { ArrowBack, Cancel, Delete, NextWeekTwoTone, Publish, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import { formatdate } from "../helpers/DateCustom";
import schedule_qcService from "../services/schedule_qc.service";
import supplierService from "../services/supplier.service";
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
        marginBottom: theme.spacing(1)
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
    },
    input: {
        border: "1px solid grey",
        padding: theme.spacing(1)
    },
    itemCheckbox: {
        display: "flex",
        alignItems: "center",
    },
    checkboxLabel: {
        marginLeft: theme.spacing(1)
    }
}));

const FormScheduleMTC = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const SchId = params.id;
    const isAddMode = !SchId;
    const classes = useStyles();
    const initialState = {
        id: null,
        objective: "",
        activity: "",
        plan_date: "",
        photo_name: "",
        photo_date: "",
        supplier_id: "",
        parts_id: "",
        user_id: user.id,
    };
    const [openAlert, setOpenAlert] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentDoc, setCurrentDoc] = useState(initialState);
    const [progress, setProgress] = useState(0);
    const [severity, setSeverity] = useState("success");
    const [currentSupplier, setCurrentSupplier] = useState([]);
    const [currentParts, setCurrentParts] = useState([]);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenAlert(false);
    };

    const createItem = (values, setSubmitting, resetForm) => {
        setDisableButton(true);
        setTimeout(() => {
            let data = new FormData();
            data.append("file", values.photo_name);
            data.append("objective", values.objective);
            data.append("activity", values.activity);
            data.append("plan_date", values.plan_date);
            data.append("photo_date", values.photo_date);
            data.append("supplier_id", values.supplier_id);
            data.append("parts_id", values.parts_id);
            data.append("user_id", user.id);

            schedule_qcService.create(data, (event) => {
                setProgress(Math.round((100 * event.loaded) / event.total));
            })
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
            let data = new FormData();
            data.append("file", values.photo_name);
            data.append("objective", values.objective);
            data.append("activity", values.activity);
            data.append("plan_date", values.plan_date);
            data.append("photo_date", values.photo_date);
            data.append("supplier_id", values.supplier_id);
            data.append("parts_id", values.parts_id);
            data.append("user_id", user.id);

            //alert(JSON.stringify(data_update,0,2));
            //console.log(values);
            schedule_qcService.update(id, data)
                .then(
                    (response) => {
                        console.log(response.data);
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

    const RetrieveSupplier = () => {
        supplierService.getAll().then(
            (response) => {
                setCurrentSupplier(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setCurrentSupplier(_content);
            }
        );
    };

    const RetrieveParts = () => {
        partsService.getAll().then(
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
            }
        );
    };

    useEffect(() => {
        RetrieveSupplier();
        RetrieveParts();
        if (!isAddMode) {
            schedule_qcService.get(SchId).then(
                (response) => {
                    const responseData = {
                        id: response.data.id,
                        objective: response.data.objective,
                        activity: response.data.activity,
                        plan_date: formatdate(response.data.plan_date),
                        photo_name: response.data.photo_name,
                        photo_date: formatdate(response.data.photo_date),
                        supplier_id: response.data.supplier_id,
                        parts_id: response.data.parts_id,
                        user_id: user.id,
                    };
                    setCurrentDoc(responseData);
                },
                (error) => {
                    const _content =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setCurrentDoc(_content);
                    console.log(_content);
                }
            );
        }

    }, [isAddMode, SchId]);

    const handleOnChangeSupplier = (e) => {
        e.preventDefault();
        const supplier_id = e.target.value;
        partsService.getBySupplier(supplier_id).then(
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
            }
        );
    }


    return (
        <Container className={classes.container}>
            {!user && (
                <Navigate to="/login" replace={true} />
            )}
            {((!user.roles.includes("ROLE_SUPERVISOR"))) ? (
                <Typography>Not Allowed</Typography>
            ) : (
                <React.Fragment>
                    <div className={classes.titleContainer}>
                        <Link to={"/schedule-mtc"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>Schedule QC's Form</Typography>
                    </div>
                    <Card>
                        <CardContent>
                            <Formik
                                enableReinitialize
                                initialValues={currentDoc}
                                validationSchema={Yup.object({
                                    objective: Yup.string().required("Required"),
                                    activity: Yup.string().required("Required"),
                                    plan_date: Yup.string().required("Required"),
                                    supplier_id: Yup.number().required("Required"),
                                    parts_id: Yup.number().required("Required"),
                                })}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    if (isAddMode) {
                                        createItem(values, setSubmitting, resetForm);
                                    } else {
                                        updateItem(SchId, values, setSubmitting);
                                    }
                                }}
                            >
                                {formik => (
                                        <Form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit} enctype="multipart/form-data">
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                        <TextField select label="Supplier" {...formik.getFieldProps('supplier_id')} fullWidth onClick={handleOnChangeSupplier}>
                                                        {currentSupplier &&
                                                            currentSupplier.map((v) => (
                                                                <MenuItem value={v.id}>{v.supplier_code}{" - "}{v.supplier_name}</MenuItem>
                                                            ))}
                                                    </TextField>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField select label="Parts" {...formik.getFieldProps('parts_id')} fullWidth>
                                                        {currentParts &&
                                                            currentParts.map((v) => (
                                                                <MenuItem value={v.id}>{v.parts_code}{" - "}{v.parts_name}</MenuItem>
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
                                                        id="activity"
                                                        label="Activity"
                                                        autoComplete="activity"
                                                        {...formik.getFieldProps('activity')}
                                                        multiline
                                                        rows={6}
                                                    />
                                                    {formik.touched.activity && formik.errors.activity ? (
                                                        <Typography size="small" color="error">{formik.errors.activity}</Typography>
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
                                                        id="objective"
                                                        label="Objective"
                                                        autoComplete="objective"
                                                        {...formik.getFieldProps('objective')}
                                                        multiline
                                                        rows={6}
                                                    />
                                                    {formik.touched.objective && formik.errors.objective ? (
                                                        <Typography size="small" color="error">{formik.errors.objective}</Typography>
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
                                                        id="plan_date"
                                                        label="Plan Date"
                                                        autoComplete="plan_date"
                                                        type="date"
                                                        {...formik.getFieldProps('plan_date')}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                    {formik.touched.plan_date && formik.errors.plan_date ? (
                                                        <Typography size="small" color="error">{formik.errors.plan_date}</Typography>
                                                    ) : null}
                                                </div>
                                            </Grid>
                                            {!isAddMode && (
                                                <Grid item xs={12}>
                                                    <div className={classes.item}>
                                                        <TextField
                                                            variant="outlined"
                                                            margin="normal"
                                                            fullWidth
                                                            id="photo_name"
                                                            label="Upload Photo"
                                                            autoComplete="photo_name"
                                                            type="file"
                                                            onChange={(event) => {
                                                                formik.setFieldValue("photo_name", event.target.files[0]);
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                        {formik.touched.photo_name && formik.errors.photo_name ? (
                                                            <Typography size="small" color="error">{formik.errors.photo_name}</Typography>
                                                        ) : null}
                                                        <Typography size="small" variant="body2" color="error">Please upload only file with extension .png, .jpg, .jpeg</Typography>
                                                    </div>
                                                </Grid>
                                            )}
                                            {/* <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        id="photo_name"
                                                        label="Upload File"
                                                        autoComplete="photo_name"
                                                        type="file"
                                                        onChange={(event) => {
                                                            formik.setFieldValue("photo_name", event.target.files[0]);
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                    {formik.touched.photo_name && formik.errors.photo_name ? (
                                                        <Typography size="small" color="error">{formik.errors.photo_name}</Typography>
                                                    ) : null}
                                                    <Typography size="small" variant="body2" color="error">Please upload only file with extension .pdf, .doc, .docx, .xls, .xlsx, .png, .jpg, .jpeg, .gif, .zip, .rar, .ppt, .pptx</Typography>
                                                </div>
                                            </Grid> */}
                                            {/* <Grid item xs={12}>
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
                                            </Grid> */}
                                            <Grid item xs={12} className={classes.actionButton}>
                                                <div className={classes.item}>
                                                    <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit" disabled={disableButton} >
                                                        <Save className={classes.button} />Save
                                                    </Button>
                                                    <Link to={"/schedule-qc"} className={classes.link}>
                                                        <Button variant="contained" color="secondary" className={classes.buttonContainer} >
                                                            <Cancel className={classes.button} />Cancel
                                                        </Button>
                                                    </Link>
                                                    <Link to={"/schedule-qc/upload-excel"} className={classes.link}>
                                                        <Button variant="contained" className={classes.buttonContainer} >
                                                            <Publish className={classes.button} /> Import xls
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Form>
                                )}
                            </Formik>
                        </CardContent>
                    </Card>

                </React.Fragment>
            )}
            <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={handleClose} severity={severity}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default FormScheduleMTC;