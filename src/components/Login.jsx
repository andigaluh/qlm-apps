import { Container, makeStyles, Typography, CssBaseline, Avatar, TextField, FormControlLabel, Checkbox, Button, Snackbar } from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { Formik } from 'formik';
import * as Yup from 'yup';
import authService from "../services/auth.service";
import { UserContext, InboxContext } from "../UserContext";
import { useContext, useState } from "react";
import MuiAlert from '@material-ui/lab/Alert';
import { useNavigate } from "react-router-dom";
import notifService from "../services/notif.service";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10)
    },
    paper:{
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
}));

const Login = (props) => {
    const { user, setUser } = useContext(UserContext);
    const { totalNotif, setTotalNotif } = useContext(InboxContext);
    const [errorMsg, setErrorMsg] = useState(null);
    const [ openAlert, setOpenAlert ] = useState(false);
    let navigate = useNavigate();

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

    const classes = useStyles();
    return (
        <Container className={classes.container}>
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">Sign In</Typography>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={Yup.object({
                        username: Yup.string().required('Required'),
                        password: Yup.string().required('Required'),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        setTimeout(() => {
                            authService.login(values.username, values.password).then(
                                (response) => {
                                    setUser(response);

                                    notifService.getUnread({ user_id: response.id }).then(
                                        (response) => {
                                            setTotalNotif(response.data.length);
                                        },
                                        (error) => {
                                            const _content =
                                                (error.response &&
                                                    error.response.data &&
                                                    error.response.data.message) ||
                                                error.message ||
                                                error.toString();

                                            //setTotalNotif(_content);
                                            console.log(`notif error : ${_content}`);
                                        }
                                    );

                                    navigate("../doc-instruction", { replace: true });
                                },
                                (error) => {
                                    const _content =
                                        (error.response &&
                                            error.response.data &&
                                            error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        setErrorMsg(_content);
                                        setOpenAlert(true);
                                        
                                    console.log(`error ${_content}`);
                                }
                            );
                            setSubmitting(false);
                            resetForm();
                        }, 400);
                    }}
                >
                    {formik => (
                        <form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                /* name="username" */
                                autoComplete="username"
                                autoFocus
                                {...formik.getFieldProps('username')}
                            />
                            {formik.touched.username && formik.errors.username ? (
                                <Typography size="small" color= "error">{formik.errors.username}</Typography>
                            ) : null}

                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                /* name="password" */
                                label="Password"
                                type="password"
                                id="password"
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <Typography size="small" color="error">{formik.errors.password}</Typography>
                            ) : null}
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign In
                            </Button>
                        </form>
                    )}

                </Formik>
                <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                    <Alert onClose={handleClose} severity="error">
                        {errorMsg}
                    </Alert>
                </Snackbar>
            </div>
        </Container>
    );
};

export default Login;