import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Checkbox, Container, Fab, FormControl, FormControlLabel, Grid, Input, InputBase, InputLabel, LinearProgress, makeStyles, OutlinedInput, Snackbar, TextField, Typography } from "@material-ui/core";
import { ArrowBack, Cancel, Delete, NextWeekTwoTone, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import partsService from "../services/parts.service";
import doc_inspectionService from "../services/doc_inspection.service";
import { formatdate } from "../helpers/DateCustom";

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

const FormDocInspection = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const docId = params.id;
    const isAddMode = !docId;
    const classes = useStyles();
    const initialState = {
        id: null,
        title: "",
        description: "",
        file_name: "",
        expired_date: "",
        status: true,
    };
    const [openAlert, setOpenAlert] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentDoc, setCurrentDoc] = useState(initialState);
    const [progress, setProgress] = useState(0);
    const [severity, setSeverity] = useState("success");

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
            data.append("file", values.file_name);
            data.append("title", values.title);
            data.append("description", values.description);
            data.append("expired_date", values.expired_date);
            data.append("status", values.status);

            doc_inspectionService.create(data, (event) => {
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
            data.append("file", values.file_name);
            data.append("title", values.title);
            data.append("description", values.description);
            data.append("expired_date", values.expired_date);
            data.append("status", values.status);
            doc_inspectionService.update(id, data)
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

    useEffect(() => {
        if (!isAddMode) {
            doc_inspectionService.get(docId).then(
                (response) => {
                    const responseData = {
                        id: response.data.id,
                        title: response.data.title,
                        description: response.data.description,
                        file_name: response.data.file_name,
                        expired_date: formatdate(response.data.expired_date),
                        status: response.data.status
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

    }, [isAddMode, docId]);


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
                        <Link to={"/doc-inspection"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>Document Inspection's Form</Typography>
                    </div>
                    <Card>
                        <CardContent>
                            <Formik
                                enableReinitialize
                                initialValues={currentDoc}
                                validationSchema={Yup.object({
                                    title: Yup.string().required("Required"),
                                    description: Yup.string().required("Required"),
                                    expired_date: Yup.string().required("Required"),
                                    file_name: (isAddMode) ? Yup.string().required("Required") : null,
                                })}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    if (isAddMode) {
                                        createItem(values, setSubmitting, resetForm);
                                    } else {
                                        updateItem(docId, values, setSubmitting);
                                    }
                                }}
                            >
                                {formik => (
                                        <Form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="title"
                                                        label="Title"
                                                        autoComplete="title"
                                                        {...formik.getFieldProps('title')}
                                                    />
                                                    {formik.touched.title && formik.errors.title ? (
                                                        <Typography size="small" color="error">{formik.errors.title}</Typography>
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
                                                        id="description"
                                                        label="Description"
                                                        autoComplete="description"
                                                        {...formik.getFieldProps('description')}
                                                        multiline
                                                        rows={6}
                                                    />
                                                    {formik.touched.description && formik.errors.description ? (
                                                        <Typography size="small" color="error">{formik.errors.description}</Typography>
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
                                                        id="expired_date"
                                                        label="Expired Date"
                                                        autoComplete="expired_date"
                                                        type="date"
                                                        {...formik.getFieldProps('expired_date')}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                    {formik.touched.expired_date && formik.errors.expired_date ? (
                                                        <Typography size="small" color="error">{formik.errors.expired_date}</Typography>
                                                    ) : null}
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        id="file_name"
                                                        label="Upload File"
                                                        autoComplete="file_name"
                                                        type="file"
                                                        onChange={(event) => {
                                                            formik.setFieldValue("file_name", event.target.files[0]);
                                                        }} 
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                    {formik.touched.file_name && formik.errors.file_name ? (
                                                        <Typography size="small" color="error">{formik.errors.file_name}</Typography>
                                                    ) : null}
                                                    <Typography size="small" variant="body2" color="error">Please upload only file with extension .pdf, .doc, .docx, .xls, .xlsx, .png, .jpg, .jpeg, .gif, .zip, .rar, .ppt, .pptx</Typography>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
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
                                                    <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit" disabled={disableButton} >
                                                        <Save className={classes.button} />Save
                                                    </Button>
                                                    <Link to={"/doc-inspection"} className={classes.link}>
                                                        <Button variant="contained" color="secondary" className={classes.buttonContainer} >
                                                            <Cancel className={classes.button} />Cancel
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

export default FormDocInspection;