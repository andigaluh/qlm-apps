import { Button, Checkbox, Container, Fab, FormControlLabel, Grid, makeStyles, MenuItem, Modal, Snackbar, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon, Cancel } from "@material-ui/icons";
import React, { useState, useEffect, useContext } from "react";
import MuiAlert from '@material-ui/lab/Alert';
import rolesService from "../services/roles.service";
import jobServices from "../services/job.services";
import Userservice from "../services/users.service";
import { Formik } from "formik";
import { PersonContext } from "../UserContext";
import * as Yup from "yup";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    fab: {
        position: "fixed",
        bottom: 20,
        right: 20
    },
    container: {
        width: 900,
        height: 550,
        backgroundColor: "white",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: "auto",
        [theme.breakpoints.down("sm")]: {
            width: "60vh",
            height: "100vh"
        },
        [theme.breakpoints.only("sm")]: {
            width: "70vh",
            height: "50vh"
        }
    },
    form: {
        padding: theme.spacing(2)
    },
    item: {
        marginBottom: theme.spacing(3)
    },
    actionButton:{
        textAlign:"center"
    },
    button:{
        marginRight: theme.spacing(1)
    }
}));

const AddUser = () => {
    const { currentUsers, setCurrentUsers } = useContext(PersonContext);
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [currentRole, setcurrentRole] = useState([]);
    const [currentJob, setcurrentJob] = useState([]);
    const [inputRole, setinputRole] = useState([]);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

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
            setinputRole({ ...inputRole, [name]: value });
        } else {
            const array = Object.values(inputRole);
            const index = array.indexOf(value);
            if (index > -1) {
                array.splice(index, 1);
            }
            setinputRole(array);
        }
    };

    const retrieveUsers = () => {
        Userservice.getAll().then(
            (response) => {
                setCurrentUsers(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setCurrentUsers(_content);
                console.log(`no user ${_content}`);
            }
        );
    };

    useEffect(() => {
        retrieveRole();
        retrieveJob();
    }, [])

    return (
        <>
            <Tooltip title="Add" aria-label="add" onClick={() => setOpen(true)}>
                <Fab color="primary" className={classes.fab}>
                    <AddIcon />
                </Fab>
            </Tooltip>
            <Modal open={open}>
                <Container className={classes.container}>
                    <Formik
                        initialValues={{
                        id: null,
                        name: "",
                        username: "",
                        email: "",
                        phone: "",
                        password: "",
                        job_id: 0,
                        status: false,
                        }}
                        validationSchema={Yup.object({
                        name: Yup.string().required("Required"),
                        username: Yup.string().required("Required"),
                        email: Yup.string()
                            .email("Invalid email address")
                            .required("Required"),
                        phone: Yup.string().required("Required"),
                        password: Yup.string().required("Required"),
                        job_id: Yup.string()
                            .oneOf(["1", "2", "3", "4", "5", "6", "7", "8", "9"], "Invalid Job Title")
                            .required("Required"),
                        })}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                        setTimeout(() => {
                            var rolesArr = Object.values(inputRole).map(function (key) {
                                return key;
                            });

                            var data = {
                                name: values.name,
                                username: values.username,
                                email: values.email,
                                phone: values.phone,
                                password: values.password,
                                job_id: values.job_id,
                                status: true,
                                roles: rolesArr,
                            };

                            Userservice.create(data)
                            .then(
                                (response) => {
                                    setSubmitting(false);
                                    setOpenAlert(true);
                                    setSnackbarMsg(response.data.message);
                                    resetForm();
                                    retrieveUsers();
                                    setOpen(false);
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
                            //alert(JSON.stringify(data, null, 2));
                        }, 400);
                        }}
                    >
                    {formik => (
                        <form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                                <Grid container spacing={2}>
                                <Grid item xs={6}>
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
                                                id="password"
                                                label="Password"
                                                type="password"
                                                autoComplete="password"
                                                
                                                {...formik.getFieldProps('password')}
                                            />
                                            {formik.touched.password && formik.errors.password ? (
                                                <Typography size="small" color="error">{formik.errors.password}</Typography>
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
                                    <Grid item xs={6}>
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
                                                        />
                                                    }
                                                    label={v.name}
                                                />
                                            ))}
                                        </div>
                                </Grid>
                                <Grid item xs={12} className={classes.actionButton}>
                                    <div className={classes.item}>
                                        <Button variant="contained" color="primary" style={{ marginRight: 20 }} type="submit">
                                            <AddIcon className={classes.button}/>Create
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={() => setOpen(false)}>
                                            <Cancel className={classes.button}/>Cancel
                                        </Button>
                                    </div>
                                </Grid>
                        </Grid>
                        </form>
                    )}
                    </Formik>
                </Container>
            </Modal>
            <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={handleClose} severity="success">
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddUser;