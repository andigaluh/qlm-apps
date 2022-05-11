import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Checkbox, Container, Fab, FormControl, FormControlLabel, Grid, Input, InputBase, InputLabel, LinearProgress, makeStyles, MenuItem, OutlinedInput, Snackbar, TextField, Typography } from "@material-ui/core";
import { ArrowBack, Cancel, Delete, NextWeekTwoTone, Publish, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import { formatfulldatetime } from "../helpers/DateCustom";
import schedule_mtcService from "../services/schedule_qc.service";
import machineService from "../services/machine.service";
import partsService from "../services/parts.service";
import problem_machineService from "../services/problem_machine.service";

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

const FormProblemMachine = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const ProblemId = params.id;
    const isAddMode = !ProblemId;
    const classes = useStyles();
    const initialState = {
        id: null,
        problem: "",
        counter_measure: "",
        start_problem: "",
        end_problem: "",
        status: "",
        machine_id: "",
        user_id: user.id,
    };
    const [openAlert, setOpenAlert] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentDoc, setCurrentDoc] = useState(initialState);
    const [progress, setProgress] = useState(0);
    const [severity, setSeverity] = useState("success");
    const [currentMachine, setCurrentMachine] = useState([]);
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
            
            problem_machineService.create(values, (event) => {
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
            problem_machineService.update(id, values)
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

    const RetrieveMachine = () => {
        machineService.getAll().then(
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
            }
        );
    };

    useEffect(() => {
        RetrieveMachine();
        if (!isAddMode) {
            problem_machineService.get(ProblemId).then(
                (response) => {
                    const responseData = {
                        id: response.data.id,
                        problem: response.data.problem,
                        counter_measure: response.data.counter_measure,
                        start_problem: formatfulldatetime(response.data.start_problem),
                        status: response.data.status,
                        end_problem: formatfulldatetime(response.data.end_problem),
                        machine_id: response.data.machine_id,
                        user_id: response.data.user_id,
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

    }, [isAddMode, ProblemId]);


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
                        <Link to={"/problem-machine"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>Schedule Maintenance's Form</Typography>
                    </div>
                    <Card>
                        <CardContent>
                            <Formik
                                enableReinitialize
                                initialValues={currentDoc}
                                validationSchema={Yup.object({
                                    problem: Yup.string().required("Required"),
                                    counter_measure: Yup.string().required("Required"),
                                    start_problem: Yup.string().required("Required"),
                                    status: Yup.string().required("Required"),
                                    machine_id: Yup.number().required("Required"),
                                    user_id: Yup.number().required("Required"),
                                })}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    if (isAddMode) {
                                        createItem(values, setSubmitting, resetForm);
                                    } else {
                                        updateItem(ProblemId, values, setSubmitting);
                                    }
                                }}
                            >
                                {formik => (
                                    <Form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField select label="Machine" {...formik.getFieldProps('machine_id')} fullWidth>
                                                        {currentMachine &&
                                                            currentMachine.map((v) => (
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
                                                        id="problem"
                                                        label="Problem"
                                                        autoComplete="problem"
                                                        {...formik.getFieldProps('problem')}
                                                    />
                                                    {formik.touched.problem && formik.errors.problem ? (
                                                        <Typography size="small" color="error">{formik.errors.problem}</Typography>
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
                                                        id="counter_measure"
                                                        label="Counter Measure"
                                                        autoComplete="counter_measure"
                                                        {...formik.getFieldProps('counter_measure')}
                                                        multiline
                                                        rows={6}
                                                    />
                                                    {formik.touched.counter_measure && formik.errors.counter_measure ? (
                                                        <Typography size="small" color="error">{formik.errors.counter_measure}</Typography>
                                                    ) : null}
                                                </div>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="start_problem"
                                                        label={"Start Problem"}
                                                        autoComplete="start_problem"
                                                            type="datetime-local"
                                                        {...formik.getFieldProps('start_problem')}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                    {formik.touched.start_problem && formik.errors.start_problem ? (
                                                        <Typography size="small" color="error">{formik.errors.start_problem}</Typography>
                                                    ) : null}
                                                </div>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <div className={classes.item}>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        id="end_problem"
                                                        label="End Problem"
                                                        autoComplete="end_problem"
                                                            type="datetime-local"
                                                        {...formik.getFieldProps('end_problem')}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                    {formik.touched.end_problem && formik.errors.end_problem ? (
                                                        <Typography size="small" color="error">{formik.errors.end_problem}</Typography>
                                                    ) : null}
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField select label="Status" {...formik.getFieldProps('status')} fullWidth>
                                                        <MenuItem value="0">NG</MenuItem>
                                                        <MenuItem value="1">OK</MenuItem>
                                                        <MenuItem value="2">Pending</MenuItem>
                                                    </TextField>
                                                </div>
                                            </Grid>
                                            
                                            
                                            <Grid item xs={12} className={classes.actionButton}>
                                                <div className={classes.item}>
                                                    <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit" disabled={disableButton} >
                                                        <Save className={classes.button} />Save
                                                    </Button>
                                                    <Link to={"/problem-machine"} className={classes.link}>
                                                        <Button variant="contained" color="secondary" className={classes.buttonContainer} >
                                                            <Cancel className={classes.button} />Cancel
                                                        </Button>
                                                    </Link>
                                                    {/* <Link to={"/problem-machine/upload-excel"} className={classes.link}>
                                                        <Button variant="contained" className={classes.buttonContainer} >
                                                            <Publish className={classes.button} /> Import xls
                                                        </Button>
                                                    </Link> */}
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

export default FormProblemMachine;