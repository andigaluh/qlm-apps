import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Checkbox, Container, Fab, FormControlLabel, Grid, makeStyles, MenuItem, Snackbar, TextField, Typography } from "@material-ui/core";
import { ArrowBack, Cancel, Publish, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import wm_modelService from "../services/wm_model.service";
import wm_typeService from "../services/wm_type.service";

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

const FormWmModel = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const wmItemId = params.id;
    const isAddMode = !wmItemId;
    const classes = useStyles();
    const [openAlert, setOpenAlert] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentWmType, setWmType] = useState([])
    const [currentWmModel, setWmModel] = useState({
        id: null,
        name: "",
        description: "",
        status: 1,
        wm_type_id: "",
        tension_belt: "",
        timer_putaran_penuh_wash: "",
        timer_putaran_penuh_spin: ""
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
            wm_modelService.create(values)
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
            wm_modelService.update(id, values)
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

    const retrieveWmType = () => {
        wm_typeService.getAll().then(
            (response) => {
                setWmType(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setWmType(_content);
            }
        )
    }

    useEffect(() => {
        retrieveWmType();
        if (!isAddMode) {
            wm_modelService.get(wmItemId).then(
                (response) => {
                    //console.log(response.data);
                    const item = response.data;
                    const itemObj = {
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        status: item.status,
                        tension_belt: item.tension_belt,
                        timer_putaran_penuh_wash: item.timer_putaran_penuh_wash,
                        timer_putaran_penuh_spin: item.timer_putaran_penuh_spin,
                        wm_type_id: item.wm_type.id,
                    };
                    setWmModel(itemObj);
                },
                (error) => {
                    const _content =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setWmModel(_content);
                    console.log(_content);
                }
            );
        }
    }, [isAddMode, wmItemId]);


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
                        <Link to={"/wm-model"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>WM Model's Form</Typography>
                    </div>
                    <Card>
                        <CardContent>
                            <Formik
                                enableReinitialize
                                initialValues={currentWmModel}
                                validationSchema={Yup.object({
                                    name: Yup.string().required("Required"),
                                    description: Yup.string().required("Required"),
                                    wm_type_id: Yup.string().required("Required"),
                                })}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    if (isAddMode) {
                                        createItem(values, setSubmitting, resetForm);
                                    } else {
                                        updateItem(wmItemId, values, setSubmitting);
                                    }
                                }}
                            >
                                {formik => (
                                    <form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                                        <Grid container spacing={2} className={classes.gridContainer}>
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField select label="Type" {...formik.getFieldProps('wm_type_id')} fullWidth >
                                                        {currentWmType &&
                                                            currentWmType.map((v) => (
                                                                <MenuItem value={v.id}>{v.name}</MenuItem>
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
                                                        id="name"
                                                        label="Name"
                                                        autoComplete="name"

                                                        {...formik.getFieldProps('name')}
                                                    />
                                                    {formik.touched.name && formik.errors.name ? (
                                                        <Typography size="small" color="error">{formik.errors.name}</Typography>
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
                                                        fullWidth
                                                        id="tension_belt"
                                                        label="Tension Belt"
                                                        autoComplete="tension_belt"

                                                        {...formik.getFieldProps('tension_belt')}
                                                    />
                                                    {formik.touched.tension_belt && formik.errors.tension_belt ? (
                                                        <Typography size="small" color="error">{formik.errors.tension_belt}</Typography>
                                                    ) : null}
                                                </div>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        id="timer_putaran_penuh_wash"
                                                        label="Timer putaran penuh wash"
                                                        autoComplete="timer_putaran_penuh_wash"

                                                        {...formik.getFieldProps('timer_putaran_penuh_wash')}
                                                    />
                                                    {formik.touched.timer_putaran_penuh_wash && formik.errors.timer_putaran_penuh_wash ? (
                                                        <Typography size="small" color="error">{formik.errors.timer_putaran_penuh_wash}</Typography>
                                                    ) : null}
                                                </div>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        id="timer_putaran_penuh_spin"
                                                        label="Timer putaran penuh spin"
                                                        autoComplete="timer_putaran_penuh_spin"

                                                        {...formik.getFieldProps('timer_putaran_penuh_spin')}
                                                    />
                                                    {formik.touched.timer_putaran_penuh_spin && formik.errors.timer_putaran_penuh_spin ? (
                                                        <Typography size="small" color="error">{formik.errors.timer_putaran_penuh_spin}</Typography>
                                                    ) : null}
                                                </div>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        fullWidth
                                                        id="lid_sw"
                                                        label="Kinerja lid switch"
                                                        autoComplete="lid_sw"

                                                        {...formik.getFieldProps('lid_sw')}
                                                    />
                                                    {formik.touched.lid_sw && formik.errors.lid_sw ? (
                                                        <Typography size="small" color="error">{formik.errors.lid_sw}</Typography>
                                                    ) : null}
                                                </div>
                                            </Grid>

                                            <Grid item xs={12} className={classes.actionButton}>
                                                <div className={classes.item}>
                                                    <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit" disabled={disableButton}>
                                                        <Save className={classes.button} />Save
                                                    </Button>
                                                    <Link to={"/wm-model"} className={classes.link}>
                                                        <Button variant="contained" color="secondary" className={classes.buttonContainer} >
                                                            <Cancel className={classes.button} />Cancel
                                                        </Button>
                                                    </Link>
                                                    {/* <Link to={"/wm-model/upload-excel"} className={classes.link}>
                                                        <Button variant="contained" className={classes.buttonContainer} >
                                                            <Publish className={classes.button} /> Import xls
                                                        </Button>
                                                    </Link> */}
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

export default FormWmModel;