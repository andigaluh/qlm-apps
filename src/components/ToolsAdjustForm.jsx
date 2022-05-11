import React, { useState, useContext } from "react"
import { Button, Card, CardContent, Container, Grid, makeStyles, MenuItem, Snackbar, TextField, Typography } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { useParams, Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Cancel, Save } from "@material-ui/icons";
import { ToolsContext } from "../UserContext";
import toolsService from "../services/tools.service";
import tools_adjustment_itemService from "../services/tools_adjustment_item.service";
import { UserContext } from "../UserContext";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10)
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
    link: {
        textDecoration: "none",
    },
}));

const ToolsAdjustForm = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const toolsId = params.id;
    const classes = useStyles();
    const { currentTools, setCurrentTools } = useContext(ToolsContext)
    const [open, setOpen] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentAdjust, setCurrentAdjust] = useState({
        id: null,
        qty: 1,
        type: "addition",
        tools_id: toolsId,
        user_id: user.id
    });

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const createItem = (values, setSubmitting, resetForm) => {
        setDisableButton(true);
        setTimeout(() => {
            tools_adjustment_itemService
                .create(values)
                .then(
                    (response) => {
                        setSubmitting(false);
                        setOpen(true);
                        setSnackbarMsg(response.data.message);
                        resetForm();
                        setDisableButton(false);
                        retrieveTools(toolsId)
                    },
                    (error) => {
                        const _content =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();
                        setOpen(true);
                        setSnackbarMsg(_content);
                        setDisableButton(false);
                    }
                )
                .catch((error) => {
                    setDisableButton(false);
                    console.log(error);
                });
        }, 150);
    };

    const retrieveTools = (id) => {
        toolsService.get(id).then(
            (response) => {
                setCurrentTools(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setCurrentTools(_content);
                console.log(_content);
            }
        );
    }

    return (
        <React.Fragment>
            <Card>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>Stock Addition Form</Typography>
                    <Formik
                        enableReinitialize
                        initialValues={currentAdjust}
                        validationSchema={Yup.object({
                            qty: Yup.number().required("Required"),
                        })}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            createItem(values, setSubmitting, resetForm);

                        }}
                    >
                        {formik => (
                            <form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <div className={classes.item}>
                                            <TextField select label="Type" value="addition" {...formik.getFieldProps('type')} fullWidth>
                                                <MenuItem value="addition">Addition</MenuItem>
                                                <MenuItem value="subtraction">Subtraction</MenuItem>
                                            </TextField>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div className={classes.item}>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="qty"
                                                label="Qty"
                                                type="text"
                                                autoComplete="qty"

                                                {...formik.getFieldProps('qty')}
                                            />
                                            {formik.touched.qty && formik.errors.qty ? (
                                                <Typography size="small" color="error">{formik.errors.qty}</Typography>
                                            ) : null}
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} className={classes.actionButton}>
                                    <div className={classes.item}>
                                        <Button variant="contained" color="primary" className={classes.buttonContainer} type="submit" disabled={disableButton}>
                                            <Save className={classes.button} />Save
                                        </Button>
                                        <Link to={`/tools-adjust/${toolsId}/list`} className={classes.link}>
                                            <Button variant="contained" color="secondary" className={classes.buttonContainer} >
                                                <Cancel className={classes.button} />Cancel
                                            </Button>
                                        </Link>
                                    </div>
                                </Grid>

                            </form>
                        )}
                    </Formik>

                </CardContent>
            </Card>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="success">
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
};

export default ToolsAdjustForm;