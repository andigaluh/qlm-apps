import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Checkbox, Container, Fab, FormControlLabel, Grid, IconButton, makeStyles, MenuItem, Snackbar, TextField, Typography } from "@material-ui/core";
import { ArrowBack, Add as AddIcon, Cancel, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import rolesService from "../services/roles.service";
import jobServices from "../services/job.services";
import Userservice from "../services/users.service";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10)
    },
    titleContainer:{
        display:"flex",
        alignItems:"center",
        marginBottom: theme.spacing(2)
    },
    link:{
        textDecoration:"none",
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
        [theme.breakpoints.down("xs")] : {
            marginBottom: theme.spacing(2)
        }
    },
    fab:{
        marginRight:theme.spacing(2)
    }
}));

const EditUser = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const userId = params.id;
    const classes = useStyles();
    const [currentRole, setcurrentRole] = useState([]);
    const [currentJob, setcurrentJob] = useState([]);
    const [inputRole, setinputRole] = useState([]);
    const [openAlert, setOpenAlert] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentUser, setCurrentUser] = useState({
        id: null,
        name: "",
        username: "",
        email: "",
        phone: "",
        job_id: 0,
        status: false,
    });

    const retrieveRole = () => {
        rolesService.getAll().then(
            (response) => {
                setcurrentRole(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setcurrentRole(_content);
            }
        );
    };

    const retrieveJob = () => {
        jobServices.getAll().then(
            (response) => {
                setcurrentJob(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setcurrentJob(_content);
            }
        );
    };

    const handleCheckboxChange = (event) => {
        const { name, value, checked } = event.target;

        if (checked) {
            const array = Object.values(inputRole);
            array.push(value);
            setinputRole(array);
        } else {
            const array = Object.values(inputRole);
            const index = array.indexOf(value);
            if (index > -1) {
                array.splice(index, 1);
            }
            setinputRole(array);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenAlert(false);
    };

    const User = (id) => {
        Userservice.get(id).then(
            (response) => {
                console.log(response.data);
                setCurrentUser(response.data);
                setinputRole(response.data.roles);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setCurrentUser(_content);
                console.log(_content);
            }
        );
    }

    useEffect(() => {
        User(userId);
        retrieveRole();
        retrieveJob();
    }, [userId]);


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
                        <Link to={"/users"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>Detail Users</Typography>
                    </div>
                    <Card>
                        <CardContent>
                            <Formik
                                enableReinitialize
                                initialValues={currentUser}
                                validationSchema={Yup.object({
                                    name: Yup.string().required("Required"),
                                    username: Yup.string().required("Required"),
                                    email: Yup.string()
                                    .email("Invalid email address")
                                    .required("Required"),
                                    phone: Yup.string().required("Required"),
                                    job_id: Yup.string()
                                    .oneOf(
                                        ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
                                        "Invalid Job Title"
                                    )
                                    .required("Required"),
                                })}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    setTimeout(() => {
                                    var rolesArr = Object.values(inputRole).map(function (
                                        key
                                    ) {
                                        return key;
                                    });

                                    var data = {
                                        name: values.name,
                                        username: values.username,
                                        email: values.email,
                                        phone: values.phone,
                                        job_id: values.job_id,
                                        status: true,
                                        roles: rolesArr,
                                    };

                                    Userservice.update(userId, data)
                                        .then(
                                        (response) => {
                                            setSubmitting(false);
                                            setOpenAlert(true);
                                            setSnackbarMsg(response.data.message);
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
                                        }
                                        )
                                        .catch((error) => {
                                        console.log(error);
                                        });

                                    /* alert(JSON.stringify(data, null, 2));
                                    setSubmitting(false); */ 
                                    }, 400);
                                }}
                            >
                            {formik => (
                                <form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <div className={classes.item}>
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    id="username"
                                                    label="Username"
                                                    autoComplete="username"

                                                    {...formik.getFieldProps('username')}
                                                />
                                                {formik.touched.username && formik.errors.username ? (
                                                    <Typography size="small" color="error">{formik.errors.username}</Typography>
                                                ) : null}
                                            </div>

                                            <div className={classes.item}>
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    id="email"
                                                    label="Email"
                                                    autoComplete="email"

                                                    {...formik.getFieldProps('email')}
                                                />
                                                {formik.touched.email && formik.errors.email ? (
                                                    <Typography size="small" color="error">{formik.errors.email}</Typography>
                                                ) : null}
                                            </div>

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
                                        <Grid item xs={12} sm={6}>
                                            <div className={classes.item}>
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    id="phone"
                                                    label="Phone"
                                                    type="text"
                                                    autoComplete="phone"

                                                    {...formik.getFieldProps('phone')}
                                                />
                                                {formik.touched.phone && formik.errors.phone ? (
                                                    <Typography size="small" color="error">{formik.errors.phone}</Typography>
                                                ) : null}
                                            </div>

                                            <div className={classes.item}>
                                                <TextField select label="Job Title" {...formik.getFieldProps('job_id')} fullWidth>
                                                    {currentJob &&
                                                        currentJob.map((v) => (
                                                            <MenuItem value={v.id}>{v.name}</MenuItem>
                                                        ))}
                                                </TextField>
                                            </div>

                                            <div className={classes.item}>
                                                {currentRole && currentRole.map((v, k) => (
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                name={`roles-${k}`}
                                                                id={`roles-${k}`}
                                                                value={v.name}
                                                                onChange={handleCheckboxChange}
                                                                color="primary"
                                                                checked={inputRole.includes(v.name)}
                                                            />
                                                        }
                                                        label={v.name}
                                                    />
                                                ))}
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} className={classes.actionButton}>
                                            <div className={classes.item}>
                                                <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit">
                                                    <Save className={classes.button} />Save
                                                </Button>
                                                <Link to={"/users"} className={classes.link}>
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

export default EditUser;