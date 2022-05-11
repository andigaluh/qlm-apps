import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Checkbox, Container, Fab, FormControlLabel, Grid, makeStyles, MenuItem, Snackbar, TextField, Typography } from "@material-ui/core";
import { ArrowBack, Cancel, Publish, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import wm_item_checkService from "../services/wm_item_check.service";
import wm_item_check_categoryService from "../services/wm_item_check_category.service";
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

const FormWmItem = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const wmItemId = params.id;
    const isAddMode = !wmItemId;
    const classes = useStyles();
    const [openAlert, setOpenAlert] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentWmItemCheckCategory, setWmItemCheckCategory] = useState([])
    const [currentWmType, setWmType] = useState([])
    const [currentWmItemCheck, setWmItemCheck] = useState({
        id: null,
        name: "",
        standard: "",
        status: 1,
        is_boolean: 1,
        wm_item_check_category_id: 1,
        wm_type: 1000
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
            wm_item_checkService.create(values)
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
            wm_item_checkService.update(id, values)
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

    const retrieveWmItemCheckCategory = () => {
        wm_item_check_categoryService.getAll().then(
            (response) => {
                setWmItemCheckCategory(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setWmItemCheckCategory(_content);
            }
        )
    }

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
        retrieveWmItemCheckCategory();
        retrieveWmType();
        if (!isAddMode) {
            wm_item_checkService.get(wmItemId).then(
                (response) => {
                    //console.log(response.data);
                    const item = response.data;
                    const itemObj = {
                        id: item.id,
                        name: item.name,
                        standard: item.standard,
                        status: item.status,
                        is_boolean: item.is_boolean,
                        wm_item_check_category_id: item.wm_item_check_category.id,
                        wm_type: item.wm_item_check_category.wm_type.id
                    };
                    console.log(itemObj)
                    setWmItemCheck(itemObj);
                },
                (error) => {
                    const _content =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setWmItemCheck(_content);
                    console.log(_content);
                }
            );
        }
    }, [isAddMode, wmItemId]);

    const handleOnChangeType = (e) => {
        e.preventDefault();
        const id = e.target.value;
        wm_item_check_categoryService.getByWmTypeId(id).then(
            (response) => {
                setWmItemCheckCategory(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setWmItemCheckCategory(_content);
                console.log(_content);
            }
        )
    }


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
                        <Link to={"/wm-item"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>WM Item's Form</Typography>
                    </div>
                    <Card>
                        <CardContent>
                            <Formik
                                enableReinitialize
                                initialValues={currentWmItemCheck}
                                validationSchema={Yup.object({
                                    standard: Yup.string().required("Required"),
                                    name: Yup.string().required("Required"),
                                    wm_item_check_category_id: Yup.string().required("Required"),
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
                                                    <TextField select label="Type" {...formik.getFieldProps('wm_type')} fullWidth onClick={handleOnChangeType}>
                                                        {currentWmType &&
                                                                currentWmType.map((v) => (
                                                                <MenuItem value={v.id}>{v.name}</MenuItem>
                                                            ))}
                                                    </TextField>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField select label="Category" {...formik.getFieldProps('wm_item_check_category_id')} fullWidth>
                                                        {currentWmItemCheckCategory &&
                                                            currentWmItemCheckCategory.map((v) => (
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
                                            <Grid item xs={12}>
                                                <div className={classes.item}>
                                                    <TextField select label="Option/Textbox" {...formik.getFieldProps('is_boolean')} fullWidth>
                                                        <MenuItem value={true}>Option/Dropdown</MenuItem>
                                                        <MenuItem value={false}>Textbox</MenuItem>
                                                    </TextField>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} className={classes.actionButton}>
                                                <div className={classes.item}>
                                                    <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit" disabled={disableButton}>
                                                        <Save className={classes.button} />Save
                                                    </Button>
                                                    <Link to={"/wm-item"} className={classes.link}>
                                                        <Button variant="contained" color="secondary" className={classes.buttonContainer} >
                                                            <Cancel className={classes.button} />Cancel
                                                        </Button>
                                                    </Link>
                                                    {/* <Link to={"/wm-item/upload-excel"} className={classes.link}>
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

export default FormWmItem;