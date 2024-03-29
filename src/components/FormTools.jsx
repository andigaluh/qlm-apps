import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Checkbox, Container, Fab, FormControlLabel, FormLabel, Grid, makeStyles, MenuItem, Snackbar, TextField, Tooltip, Typography } from "@material-ui/core";
import { ArrowBack, Cancel, Publish, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import partsService from "../services/parts.service";
import tools_typeService from "../services/tools_type.service";
import toolsService from "../services/tools.service";

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

const FormTools = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const toolsId = params.id;
    const isAddMode = !toolsId;
    const classes = useStyles();
    const [openAlert, setOpenAlert] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentToolsType, setCurrentToolsType] = useState([])
    const [currentParts, setCurrentParts] = useState({
        id: null,
        code: "",
        name: "",
        qty: 0,
        tools_type_id: 1,
    });
    const [indikator, setIndikator] = useState("grey");
    const [titleIndikator, setTitleIndikator] = useState("Not Applicable");

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenAlert(false);
    };

    const createItem = (values, setSubmitting, resetForm) => {
        setDisableButton(true);
        setTimeout(() => {
            toolsService.create(values)
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
            toolsService.update(id, values)
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

    const retrieveToolsType = () => {
        tools_typeService.getAll().then(
            (response) => {
                setCurrentToolsType(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setCurrentToolsType(_content);
            }
        )
    }

    const RetrieveIndikator = (row) => {
        let indikatorResult = "";
        let titleIndikatorResult = "";
        const dateNow = new Date();
        const date1 = new Date(row.createdAt);
        const date2 = new Date(row.expired_date);
        const prevDate50 = new Date(row.createdAt);
        const prevDate80 = new Date(row.createdAt);

        const diffTime = date2 - date1;
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
        const diffDays50 = Math.ceil(diffDays * 0.5);
        const diffDays80 = Math.ceil(diffDays * 0.8);
        const newDate50 = prevDate50.setDate(prevDate50.getDate() + diffDays50);
        const newDate80 = prevDate80.setDate(prevDate80.getDate() + diffDays80);
        if (dateNow < newDate50) {
            indikatorResult = "green";
            titleIndikatorResult = "OK";
        } else if ((dateNow >= newDate50) && (dateNow < newDate80)) {
            indikatorResult = "orange";
            titleIndikatorResult = "Warning";
        } else if (dateNow >= newDate80) {
            indikatorResult = "red";
            titleIndikatorResult = "Expired";
        } else {
            indikatorResult = "grey";
            titleIndikatorResult = "Not Applicable";
        }
        setIndikator(indikatorResult);
        setTitleIndikator(titleIndikatorResult)
    }

    useEffect(() => {
        retrieveToolsType();
        if (!isAddMode) {
            toolsService.get(toolsId).then(
                (response) => {
                    setCurrentParts(response.data);
                    const row = response.data;
                    RetrieveIndikator(row)
                    console.log(response.data)
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
    }, [isAddMode, toolsId]);


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
                        <Link to={"/tools"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>Tools's Form</Typography>
                    </div>
                    <Card>
                        <CardContent>
                            <Formik
                                enableReinitialize
                                initialValues={currentParts}
                                validationSchema={Yup.object({
                                    name: Yup.string().required("Required"),
                                    tools_type_id: Yup.string().required("Required"),
                                })}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    if (isAddMode) {
                                        createItem(values, setSubmitting, resetForm);
                                    } else {
                                        updateItem(toolsId, values, setSubmitting);
                                    }
                                }}
                            >
                                {formik => (
                                    <form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                                        <Grid container spacing={2} className={classes.gridContainer}>
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField select label="Tools type" {...formik.getFieldProps('tools_type_id')} fullWidth>
                                                        {currentToolsType &&
                                                            currentToolsType.map((v) => (
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
                                                    id="code"
                                                    label="Tools Code"
                                                    autoComplete="code"

                                                    {...formik.getFieldProps('code')}
                                                />
                                                {formik.touched.code && formik.errors.code ? (
                                                    <Typography size="small" color="error">{formik.errors.code}</Typography>
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
                                                        id="name"
                                                        label="Tools name"
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
                                                        id="expired_date"
                                                        label="Tools expired date"
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
                                            </Grid>
                                            {!isAddMode && (
                                                <Grid item xs={12}>
                                                    <div className={classes.item}>
                                                        <FormLabel>Indikator Expired</FormLabel>&nbsp;
                                                        <Tooltip title={titleIndikator} aria-label={titleIndikator}>
                                                            <Fab size="small" style={{ backgroundColor: `${indikator}` }} />
                                                        </Tooltip>
                                                    </div>
                                                </Grid>
                                            )}
                                            <Grid item xs={12} className={classes.actionButton}>
                                                <div className={classes.item}>
                                                    <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit" disabled={disableButton}>
                                                        <Save className={classes.button} />Save
                                                    </Button>
                                                    <Link to={"/tools"} className={classes.link}>
                                                        <Button variant="contained" color="secondary" className={classes.buttonContainer} >
                                                            <Cancel className={classes.button} />Cancel
                                                        </Button>
                                                    </Link>
                                                    {/* <Link to={"/tools/upload-excel"} className={classes.link}>
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
            {/* )} */}
            <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={handleClose} severity="success">
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default FormTools;