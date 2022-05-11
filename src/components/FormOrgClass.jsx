import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Checkbox, FormControlLabel, Grid, makeStyles, MenuItem, Snackbar, TextField, Typography } from "@material-ui/core";
import { Cancel, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import org_classService from "../services/org_class.service";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2)
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

const FormOrgClass = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const orgClassId = params.id;
    const isAddMode = !orgClassId;
    const classes = useStyles();
    const [currentOrgClass, setCurrentOrgClass] = useState([]);
    const [disableButton, setDisableButton] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentOrg, setCurrentOrg] = useState({
        id: null,
        name: "",
        status: true
    });


    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenAlert(false);
    };

    const OrgClass = (id) => {
        org_classService.get(id).then(
            (response) => {
                setCurrentOrg(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setCurrentOrg(_content);
                console.log(_content);
            }
        );
    };

    const createItem = (values, setSubmitting, resetForm) => {
        setDisableButton(true);
        setTimeout(() => {
            org_classService.create(values)
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
            org_classService.update(id, values)
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
            OrgClass(orgClassId);
        }
    }, [isAddMode, orgClassId]);


    return (
        <div className={classes.container}>
            {!user && (
                <Navigate to="/login" replace={true} />
            )}
            {!user.roles.includes("ROLE_ADMIN") ? (
                <Typography>Not Allowed</Typography>
            ) : (
                <React.Fragment>

                    <Card>
                        <CardContent>
                            <Formik
                                enableReinitialize
                                initialValues={currentOrg}
                                validationSchema={Yup.object({
                                    name: Yup.string().required("Required"),
                                })}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    if (isAddMode) {
                                        createItem(values, setSubmitting, resetForm);
                                    } else {
                                        updateItem(orgClassId, values, setSubmitting);
                                    }
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
                                                        id="name"
                                                        label="Name"
                                                        type="text"
                                                        autoComplete="name"

                                                        {...formik.getFieldProps('name')}
                                                    />
                                                    {formik.touched.name && formik.errors.name ? (
                                                        <Typography size="small" color="error">{formik.errors.name}</Typography>
                                                    ) : null}
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
                                                    <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit" disabled={disableButton}>
                                                        <Save className={classes.button} />Save
                                                    </Button>
                                                    <Link to={"/organization/class"} className={classes.link}>
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
        </div>
    );
};

export default FormOrgClass;