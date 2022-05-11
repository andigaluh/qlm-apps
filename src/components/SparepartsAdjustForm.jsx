import React, { useState, useContext} from "react"
import { Button, Card, CardContent, Container, Grid, makeStyles, Snackbar, TextField, Typography } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import parts_adjustment_itemService from "../services/parts_adjustment_item.service";
import { useParams, Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Cancel, Save } from "@material-ui/icons";
import { SparepartsContext } from "../UserContext";
import partsService from "../services/parts.service";

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

const SparepartsAdjustForm = () => {
    const params = useParams();
    const sparepartsId = params.id;
    const classes = useStyles();
    const { currentParts, setCurrentParts } = useContext(SparepartsContext)
    const [open, setOpen] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentAdjust, setCurrentAdjust] = useState({
        id: null,
        qty: 1,
        type: "addition",
        notes: "",
        parts_id: sparepartsId,
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
            parts_adjustment_itemService
                .create(values)
                .then(
                    (response) => {
                        setSubmitting(false);
                        setOpen(true);
                        setSnackbarMsg(response.data.message);
                        resetForm();
                        setDisableButton(false);
                        retrieveParts(sparepartsId)
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

    const retrieveParts = (id) => {
        partsService.get(id).then(
            (response) => {
                setCurrentParts(response.data);
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
                            notes: Yup.string().required("Required"),
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
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="notes"
                                                label="Notes"
                                                type="text"
                                                autoComplete="notes"

                                                {...formik.getFieldProps('notes')}
                                            />
                                            {formik.touched.notes && formik.errors.notes ? (
                                                <Typography size="small" color="error">{formik.errors.notes}</Typography>
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
                                        <Link to={`/spareparts-adjust/${sparepartsId}/addition`} className={classes.link}>
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

export default SparepartsAdjustForm;