import React, { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button, Card, CardContent, Checkbox, Container, Fab, FormControlLabel, Grid, makeStyles, MenuItem, Snackbar, TextField, Typography, Select } from "@material-ui/core";
import { ArrowBack, Cancel, FontDownload, GetApp, Publish, Save } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from '@material-ui/lab/Alert';
import partsService from "../services/parts.service";
import iqcService from "../services/iqc.service";
import supplierService from "../services/supplier.service";
import defectService from "../services/defect.service";
import { MySelect } from "../helpers/FormElement"
import { formatdate, formatdatetime } from "../helpers/DateCustom";
import iqc_historyService from "../services/iqc_history.service";
import DataTable from 'react-data-table-component';

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
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: theme.spacing(2),
    },
    formControl: {
        padding: theme.spacing(2),
        fontWeight: "400",
        lineHeight: "1.43",
        fontSize: 14,
        fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
        boxSizing: "content-box",
    },
    table: {
        marginTop: theme.spacing(2)
    },
}));

const FormIqcSummary = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const iqcId = params.id;
    const isAddMode = !iqcId;
    const classes = useStyles();
    const [openAlert, setOpenAlert] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [muiPartsCode, setMuiPartsCode] = useState("");
    const [muiPartsName, setMuiPartsName] = useState("");
    const [inspectorName, setInspectorName] = useState("");
    const [muiSupplierName, setMuiSupplierName] = useState("");
    const [qtyAction, setQtyAction] = useState("Qty");
    const [currentParts, setCurrentParts] = useState([]);
    const [currentDefect, setCurrentDefect] = useState([]);
    const [progress, setProgress] = useState(0);
    const [currentIqc, setCurrentIqc] = useState({
        id: null,
        iqc_date: "",
        incoming_qty: 0,
        sampling_qty: 0,
        ng_qty: 0,
        status: "",
        parts_id: "",
        user_id: user.id,
        supervisor_id: (user.superior_id[0]) ? user.superior_id[0].id : 0,
        defect_id: "",
        sorting_lot: "",
        sorting_ok: "",
        sorting_ng: "",
        detail_problem: "",
        action: null,
        action_qty: "",
        image_sheet: "",
        photo_name: "",
        actual: ""
    });
    const [currentHistory, setCurrentHistory] = useState([]);
    const [muiPartStandard, setMuiPartStandard] = useState("");

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenAlert(false);
    };

    const createItem = (values, setSubmitting, resetForm) => {
        setDisableButton(true);
        //alert(JSON.stringify(values,0,2));
        setTimeout(() => {
            let data = new FormData();
            data.append("file", values.image_sheet);
            data.append("iqc_date", values.iqc_date);
            data.append("incoming_qty", values.incoming_qty);
            data.append("sampling_qty", values.sampling_qty);
            data.append("ng_qty", values.ng_qty);
            data.append("status", values.status);
            data.append("parts_id", values.parts_id);
            data.append("user_id", user.id);
            data.append("supervisor_id", user.superior_id[0].id);

            iqcService.create(data, (event) => {
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
            let data = new FormData();
            data.append("file", values.image_sheet);
            data.append("sorting_lot", values.sorting_lot);
            data.append("sorting_ok", values.sorting_ok);
            data.append("sorting_ng", values.sorting_ng);
            data.append("detail_problem", values.detail_problem);
            data.append("status", values.status);
            data.append("action", values.action);
            data.append("action_qty", values.action_qty);
            data.append("defect_id", values.defect_id);
            iqcService.updateHold(id, data)
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

    const retrieveParts = () => {
        partsService.getAll().then(
            (response) => {
                //console.log(response.data)
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
            }
        )
    }

    const retrieveDefect = () => {
        defectService.getAll().then(
            (response) => {
                //console.log(response.data)
                setCurrentDefect(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setCurrentDefect(_content);
            }
        )
    }

    const retrieveHistory = (id) => {
        iqc_historyService.getByIqcId(id).then(
            (response) => {
                //console.log(response.data)
                setCurrentHistory(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setCurrentHistory(_content);
            }
        )
    };

    const columns = [
        {
            name: "Date",
            selector: (row) => formatdatetime(row.createdAt),
            sortable: true,
            width: "150px"
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
            width: "80px"
        },
        {
            name: "Description",
            selector: (row) => row.description,
            sortable: true,
        }, 
        

    ];

    useEffect(() => {
        retrieveParts();
        retrieveDefect();
        if (!isAddMode) {
            retrieveHistory(iqcId);
            iqcService.get(iqcId).then(
                (response) => {
                    setCurrentIqc({
                        id: iqcId,
                        iqc_date: formatdate(response.data.iqc_date),
                        incoming_qty: response.data.incoming_qty,
                        sampling_qty: response.data.sampling_qty,
                        ng_qty: response.data.ng_qty,
                        status: response.data.status,
                        parts_id: response.data.parts_id,
                        supervisor_id: response.data.supervisor_id,
                        user_id: response.data.user_id,
                        sorting_lot: response.data.sorting_lot,
                        sorting_ng: response.data.sorting_ng,
                        sorting_ok: response.data.sorting_ok,
                        detail_problem: response.data.detail_problem,
                        defect_id: response.data.defect_id,
                        action: response.data.action,
                        action_qty: response.data.action_qty,
                        image_sheet: response.data.image_sheet,
                        photo_name: response.data.photo_name,
                        actual: response.data.actual,
                    });

                    setInspectorName(response.data.user.name)

                    partsService.get(response.data.parts_id).then(
                        (parts) => {
                            const supplier_id = parts.data.supplier_id;
                            supplierService.get(supplier_id).then(
                                (supplier) => {
                                    setMuiSupplierName(supplier.data.supplier_name);
                                },
                                (error) => {
                                    const _content =
                                        (error.response &&
                                            error.response.data &&
                                            error.response.data.message) ||
                                        error.message ||
                                        error.toString();

                                    setMuiSupplierName(_content);
                                    console.log(_content);
                                }
                            );
                            setMuiPartsName(parts.data.parts_name);
                            setMuiPartStandard(parts.data.standard);
                        },
                        (error) => {
                            const _content =
                                (error.response &&
                                    error.response.data &&
                                    error.response.data.message) ||
                                error.message ||
                                error.toString();

                            setMuiPartsName(_content);
                            console.log(_content);
                        }
                    )
                },
                (error) => {
                    const _content =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setCurrentIqc(_content);
                    console.log(_content);
                }
            );
        }
    }, [isAddMode, iqcId]);

    const handleChangeAction = (e) => {
        const action = e.target.value;
        setQtyAction(`Qty ${action}`);
    }



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
                    <Link to={"/iqc-summary"}>
                        <Fab color="primary" className={classes.fab} size="small">
                            <ArrowBack />
                        </Fab>
                    </Link>
                    <Typography variant="h4" className={classes.title}>Incoming Form</Typography>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={9}>
                        <Card>
                            <CardContent>
                                <Formik
                                    enableReinitialize
                                    initialValues={currentIqc}
                                    validationSchema={Yup.object({
                                        sorting_lot: Yup.string().required("Required"),
                                        sorting_ok: Yup.number().required("Required"),
                                        sorting_ng: Yup.number().required("Required"),
                                        status: Yup.string().required("Required"),
                                    })}
                                    onSubmit={(values, { setSubmitting, resetForm }) => {
                                        if (isAddMode) {
                                            createItem(values, setSubmitting, resetForm);
                                        } else {
                                            updateItem(iqcId, values, setSubmitting);
                                        }
                                    }}
                                >
                                    {formik => (
                                        <form className={classes.form} autoComplete="off" onSubmit={formik.handleSubmit}>
                                            <Grid container spacing={2} className={classes.gridContainer}>
                                                <Grid item xs={12} sm={6}>
                                                    <div className={classes.item}>
                                                        <TextField
                                                            variant="outlined"
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            id="inspector"
                                                            label="Inspector"
                                                            autoComplete="inspector"
                                                            value={inspectorName}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <div className={classes.item}>
                                                        <TextField
                                                            variant="outlined"
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            id="iqc_date"
                                                            label="Date"
                                                            type="date"
                                                            autoComplete="iqc_date"
                                                            {...formik.getFieldProps('iqc_date')}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                        {formik.touched.iqc_date && formik.errors.iqc_date ? (
                                                            <Typography size="small" color="error">{formik.errors.iqc_date}</Typography>
                                                        ) : null}
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <div className={classes.item}>
                                                        <TextField select label="Parts" {...formik.getFieldProps('parts_id')} fullWidth InputProps={{
                                                            readOnly: true,
                                                        }}>
                                                            {currentParts &&
                                                                currentParts.map((v) => (
                                                                    <MenuItem value={v.id}>{v.parts_code}</MenuItem>
                                                                ))}
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
                                                            id="parts_name"
                                                            label="Parts name"
                                                            autoComplete="parts_name"
                                                            value={muiPartsName}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <div className={classes.item}>
                                                        <TextField
                                                            variant="outlined"
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            id="supplier_name"
                                                            label="Supplier name"
                                                            autoComplete="supplier_name"
                                                            value={muiSupplierName}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <div className={classes.item}>
                                                        <TextField
                                                            variant="outlined"
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            id="standard"
                                                            label="Standard"
                                                            autoComplete="standard"
                                                            value={muiPartStandard}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <div className={classes.item}>
                                                        <TextField
                                                            variant="outlined"
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            id="actual"
                                                            label="Actual"
                                                            type="text"
                                                            autoComplete="actual"
                                                            {...formik.getFieldProps('actual')}
                                                            defaultValue={0}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                        {formik.touched.actual && formik.errors.actual ? (
                                                            <Typography size="small" color="error">{formik.errors.actual}</Typography>
                                                        ) : null}
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <div className={classes.item}>
                                                        <TextField
                                                            variant="outlined"
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            id="incoming_qty"
                                                            label="Incoming Qty"
                                                            type="number"
                                                            autoComplete="incoming_qty"
                                                            {...formik.getFieldProps('incoming_qty')}
                                                            defaultValue={0}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                        {formik.touched.incoming_qty && formik.errors.incoming_qty ? (
                                                            <Typography size="small" color="error">{formik.errors.incoming_qty}</Typography>
                                                        ) : null}
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <div className={classes.item}>
                                                        <TextField
                                                            variant="outlined"
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            id="sampling_qty"
                                                            label="Sampling Qty"
                                                            type="number"
                                                            autoComplete="sampling_qty"
                                                            {...formik.getFieldProps('sampling_qty')}
                                                            defaultValue={0}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                        {formik.touched.sampling_qty && formik.errors.sampling_qty ? (
                                                            <Typography size="small" color="error">{formik.errors.sampling_qty}</Typography>
                                                        ) : null}
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <div className={classes.item}>
                                                        <TextField
                                                            variant="outlined"
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            id="ng_qty"
                                                            label="NG Qty"
                                                            type="number"
                                                            autoComplete="ng_qty"
                                                            {...formik.getFieldProps('ng_qty')}
                                                            defaultValue={0}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                        {formik.touched.ng_qty && formik.errors.ng_qty ? (
                                                            <Typography size="small" color="error">{formik.errors.ng_qty}</Typography>
                                                        ) : null}
                                                    </div>
                                                </Grid>

                                                <Grid item xs={12} sm={4}>
                                                    <div className={classes.item}>
                                                        <TextField
                                                            variant="outlined"
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            id="sorting_lot"
                                                            label="Sorting Lot"
                                                            type="number"
                                                            autoComplete="sorting_lot"
                                                            {...formik.getFieldProps('sorting_lot')}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                        {formik.touched.sorting_lot && formik.errors.sorting_lot ? (
                                                            <Typography size="small" color="error">{formik.errors.sorting_lot}</Typography>
                                                        ) : null}
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <div className={classes.item}>
                                                        <TextField
                                                            variant="outlined"
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            id="sorting_ok"
                                                            label="Sorting OK"
                                                            type="number"
                                                            autoComplete="sorting_ok"
                                                            {...formik.getFieldProps('sorting_ok')}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                        {formik.touched.sorting_ok && formik.errors.sorting_ok ? (
                                                            <Typography size="small" color="error">{formik.errors.sorting_ok}</Typography>
                                                        ) : null}
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <div className={classes.item}>
                                                        <TextField
                                                            variant="outlined"
                                                            margin="normal"
                                                            required
                                                            fullWidth
                                                            id="sorting_ng"
                                                            label="Sorting NG"
                                                            type="number"
                                                            autoComplete="sorting_ng"
                                                            {...formik.getFieldProps('sorting_ng')}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                        {formik.touched.sorting_ng && formik.errors.sorting_ng ? (
                                                            <Typography size="small" color="error">{formik.errors.sorting_ng}</Typography>
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
                                                            id="detail_problem"
                                                            label="Detail problem"
                                                            type="text"
                                                            autoComplete="detail_problem"
                                                            {...formik.getFieldProps('detail_problem')}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                        {formik.touched.detail_problem && formik.errors.detail_problem ? (
                                                            <Typography size="small" color="error">{formik.errors.detail_problem}</Typography>
                                                        ) : null}
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <div className={classes.item}>
                                                        <TextField select label="Defect" {...formik.getFieldProps('defect_id')} fullWidth InputProps={{
                                                            readOnly: true,
                                                        }}>
                                                            {currentDefect &&
                                                                currentDefect.map((v) => (
                                                                    <MenuItem value={v.id}>{v.name}</MenuItem>
                                                                ))}
                                                        </TextField>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <div className={classes.item}>
                                                        <TextField select label="Action" {...formik.getFieldProps('action')} fullWidth InputProps={{
                                                            readOnly: true,
                                                        }} InputLabelProps={{
                                                            shrink: true
                                                        }}>
                                                            <MenuItem value="repair">Repair</MenuItem>
                                                            <MenuItem value="return">Return</MenuItem>
                                                        </TextField>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <div className={classes.item}>
                                                        <TextField
                                                            variant="outlined"
                                                            margin="normal"
                                                            fullWidth
                                                            id="action_qty"
                                                            label={qtyAction}
                                                            type="number"
                                                            autoComplete="action_qty"
                                                            {...formik.getFieldProps('action_qty')}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                        {formik.touched.action_qty && formik.errors.action_qty ? (
                                                            <Typography size="small" color="error">{formik.errors.action_qty}</Typography>
                                                        ) : null}
                                                    </div>
                                                </Grid>
                                                
                                                <Grid item xs={12} sm={6}>
                                                    <div className={classes.item}>
                                                        <TextField select label="Status" {...formik.getFieldProps('status')} fullWidth InputProps={{
                                                            readOnly: true,
                                                        }}>
                                                            <MenuItem value="NG">NG</MenuItem>
                                                            <MenuItem value="HOLD">HOLD</MenuItem>
                                                            <MenuItem value="OK">OK</MenuItem>
                                                        </TextField>
                                                    </div>
                                                </Grid>

                                                {!isAddMode && formik.values.image_sheet && (
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="body1">
                                                            <a href={process.env.REACT_APP_UPLOADS + formik.values.image_sheet} target="_blank" className={classes.link}><GetApp/> Download Doc</a>
                                                        </Typography>
                                                    </Grid>
                                                )}

                                                {!isAddMode && formik.values.photo_name && (
                                                    <Grid item xs={12} style={{textAlign: "center"}}>
                                                        <Typography variant="body1">Photo</Typography>
                                                        <img src={formik.values.photo_name} id="myImage" className={classes.webcam} />
                                                    </Grid>
                                                )}

                                                <Grid item xs={12} className={classes.actionButton}>
                                                    <div className={classes.item}>

                                                        <Link to={"/iqc-summary"} className={classes.link}>
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
                    </Grid>
                    <Grid item xs={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5"> History</Typography>
                                <Typography variant="h6" className={classes.table}>
                                    <DataTable
                                        columns={columns}
                                        data={currentHistory}
                                        
                                    />
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                

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

export default FormIqcSummary;