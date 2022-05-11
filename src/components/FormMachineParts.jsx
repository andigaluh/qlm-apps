import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Checkbox, Container, Fab, FormControlLabel, Grid, makeStyles, Snackbar, TextField, Typography } from "@material-ui/core";
import { ArrowBack, Cancel, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import machineService from "../services/machine.service";
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
    },
    itemWrapper:{
        display:"flex",
        flexWrap:"wrap",
        flexDirection:"column"
    },
    itemCheckbox:{
        
    }
}));

const FormMachineParts = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const machineId = params.id;
    const isAddMode = !machineId;

    const classes = useStyles();
    const [openAlert, setOpenAlert] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [listParts, setListParts] = useState([]);
    const [inputParts, setInputParts] = useState([]);
    const [currentMachine, setCurrentMachine] = useState({
        machine_id: 0,
        parts_id: 0,
    });

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenAlert(false);
    };

    const retrieveParts = () => {
        partsService.getAll().then(
            (response) => {
                setListParts(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setListParts(_content);
            }
        )
    }

    const handleCheckboxChange = (event) => {
        const { name, value, checked } = event.target;
        if (checked) {
            //alert(inputParts)
            const array = Object.values(inputParts);
            array.push(value);
            setInputParts(array);
        } else {
            const array = Object.values(inputParts);
            const index = array.indexOf(value);
            if (index > -1) {
                array.splice(index, 1);
            }
            setInputParts(array);
        }
    };

    const updateItem = (id, values, setSubmitting) => {
        setDisableButton(true);

        setTimeout(() => {
            var partsArr = Object.values(inputParts).map(function (key) {
                return key;
            });

            var data = {
                machine_id: id,
                parts_id: partsArr,
            };

            machineService.updateParts(id, data)
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
        retrieveParts();
        if (!isAddMode) {
            machineService.get(machineId).then(
                (response) => {
                    var partsNameArr = []
                    var dataParts = response.data.parts;
                    dataParts.map((value) => {
                        partsNameArr.push(value.name);
                    });
                    setInputParts(partsNameArr);
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
                    console.log(_content);
                }
            );
        }
    }, [isAddMode, machineId]);


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
                        <Link to={"/machines"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>Add Machine's Spareparts</Typography>
                    </div>
                    <Card>
                        <CardContent>
                            <Formik
                                enableReinitialize
                                initialValues={currentMachine}
                                validationSchema={Yup.object({})}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    updateItem(machineId, values, setSubmitting);
                                }}
                            >
                                {formik => (
                                    <form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} className={classes.itemWrapper}>
                                                {listParts &&
                                                    listParts.map((v, k) => (
                                                        <div className={classes.itemCheckbox} >
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    name={`parts-${k}`}
                                                                    id={`parts-${k}`}
                                                                    value={v.name}
                                                                    onChange={handleCheckboxChange}
                                                                    color="primary"
                                                                    checked={inputParts.includes(v.name)}
                                                                />
                                                            }
                                                            label={v.name}
                                                        />
                                                        </div>
                                                    ))}
                                            </Grid>
                                            <Grid item xs={12} className={classes.actionButton}>
                                                <div className={classes.item}>
                                                    <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit" disabled={disableButton}>
                                                        <Save className={classes.button} />Save
                                                    </Button>
                                                    <Link to={"/machines"} className={classes.link}>
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
        </Container>
    );
};

export default FormMachineParts;