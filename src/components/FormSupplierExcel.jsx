import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Checkbox, Container, Fab, FormControl, FormControlLabel, Grid, IconButton, Input, InputBase, InputLabel, LinearProgress, makeStyles, OutlinedInput, Snackbar, TextField, Typography } from "@material-ui/core";
import { ArrowBack, Cancel, CloudDownload, Delete, GetApp, NextWeekTwoTone, Publish, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import supplier_excelService from "../services/supplier_excel.service";

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
    },
    link: {
        textDecoration: "none"
    }
}));

const FormSupplierExcel = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const docId = params.id;
    const isAddMode = !docId;
    const classes = useStyles();
    const initialState = {
        id: null,
        file_name: "",
        user_id: user.id,
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
            data.append("user_id", values.user_id);

            supplier_excelService.create(data, (event) => {
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



    useEffect(() => {
        if (!isAddMode) {
            supplier_excelService.get(docId).then(
                (response) => {
                    const responseData = {
                        id: response.data.id,
                        file_name: response.data.file_name,
                        user_id: response.data.status.user.id
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
            {/* {!user.roles.includes("ROLE_SUPERVISOR") ? (
                <Typography>Not Allowed</Typography>
            ) : ( */}
                <React.Fragment>
                    <div className={classes.titleContainer}>
                        <Link to={"/supplier"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>Supplier's Form</Typography>
                    </div>
                    <Card>
                        <CardContent>
                            <Formik
                                enableReinitialize
                                initialValues={currentDoc}
                                validationSchema={Yup.object({
                                    file_name: (isAddMode) ? Yup.string().required("Required") : null,
                                })}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    createItem(values, setSubmitting, resetForm);
                                }}
                            >
                                {formik => (
                                    <Form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography variant="body2">Please use this xls template file before upload : &nbsp;
                                                    <a href={`${process.env.REACT_APP_UPLOADS}supplier_template.xlsx`} target="_blank" className={classes.link}>
                                                        <Button variant="contained" className={classes.buttonContainer} >
                                                            <CloudDownload className={classes.button} /> supplier_template.xlsx
                                                        </Button>
                                                    </a>
                                                </Typography>
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
                                                    <Typography size="small" variant="body2" color="error">Please upload only file with extension .xls or .xlsx</Typography>
                                                    <Typography size="small" variant="body2" color="error">NOTE : Before download template spareparts, make sure supplier success uploaded into system.</Typography>
                                                    <Typography size="small" variant="body2" color="error">NOTE : Before uploading the file, all fields must be filled in, if there is no value, fill it with the word "empty" without quotes.</Typography>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} className={classes.actionButton}>
                                                <div className={classes.item}>
                                                    <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit" disabled={disableButton} >
                                                        <Save className={classes.button} />Save
                                                    </Button>
                                                    <Link to={"/supplier"} className={classes.link}>
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
            {/* )} */}
            <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={handleClose} severity={severity}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default FormSupplierExcel;