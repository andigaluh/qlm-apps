import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Card, CardContent, Container, Fab, Grid, makeStyles, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, CardHeader, Snackbar } from "@material-ui/core";
import { useParams, Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { ArrowBack, PictureAsPdf } from "@material-ui/icons";
import { Formik, Form} from "formik";
import * as Yup from "yup";
import wm_checkService from "../services/wm_check.service";
import report_wm_checkService from "../services/report_wm_check.service"
import { dateNow, formatdate } from "../helpers/DateCustom";
import MuiAlert from '@material-ui/lab/Alert';
import { MyTextInput, MyTextArea, MyTextHidden, MySelect } from "../helpers/FormElement";
import Webcam from "react-webcam";
import wm_modelService from "../services/wm_model.service";
import { PDFDownloadLink } from '@react-pdf/renderer'
import PdfGenerateFile from "./PdfGenerateFile";

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
    width: 480,
    height: 320,
    facingMode: "environment"
};

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
    fab: {
        marginRight: theme.spacing(2)
    },
    buttonContainer: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        display: "flex",
        justifyContent: "center",
    },
    buttonSubmit: {
        marginRight: theme.spacing(2)
    },
    titleSparepartCondition: {
        marginBottom: theme.spacing(4),
    },
    table: {
        minWidth: 550,
    },
    labelWrapper:{
        display: "flex",
        flexDirection: "column"
    },
    label:{
        marginBottom: theme.spacing(1)
    },
    formControl: {
        padding: theme.spacing(2),
        fontSize: 15,
        border: "1px solid #555"
    },
    link: {
        textDecoration: "none"
    },
    cellNG : {
        backgroundColor: "red",
        color: "white"
    },
    captureImage: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    webcam: {
        marginBottom: theme.spacing(2)
    },
    buttonDownload: {
        marginLeft: theme.spacing(2),
        textDecoration: "none"
    }
}));

const FormApprCheckMachine = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const wmCheckId = params.id;
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [severity, setSeverity] = useState("success");
    const [machine, setMachine] = useState([]);
    const [machineParts, setMachineParts] = useState([]);
    const [machineProblem, setMachineProblem] = useState([]);
    const [machineNeedParts, setMachineNeedParts] = useState([]);
    const [approveButton, setApproveButton] = useState(false);
    const [image, setImage] = useState('');
    const [photoName, setPhotoName] = useState('');
    const webcamRef = useRef(null);
    const [tensionBelt, setTensionBelt] = useState("");
    const [timerPutaranPenuhWash, setTimerPutaranPenuhWash] = useState("");
    const [timerPutaranPenuhSpin, setTimerPutaranPenuhSpin] = useState("");
    const [lidSw, setLidSw] = useState("");
    const [pdfVersion, setPdfVersion] = useState(false);

    const capture = useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot();
            setImage(imageSrc)
            console.log(imageSrc);
        });

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const retrieveMachine = (wm_check_id) => {
        report_wm_checkService.get(wm_check_id).then(
            (response) => {
                setApproveButton((response.data.supervisor_approval === true) ? true : false);
                setPhotoName(response.data.photo_name);
                console.log(response.data);
                setMachine({
                    id: response.data.id,
                    inspection_date: formatdate(response.data.inspection_date),
                    inspection_approval: response.data.inspection_approval,
                    inspection_name: response.data.inspection_name,
                    wm_model_name: response.data.wm_model_name,
                    wm_type_name: response.data.wm_type_name,
                    wm_check_id: wmCheckId,
                    supervisor_id: user.id,
                    photo_name: response.data.photo_name,
                    supervisor_approval: response.data.supervisor_approval,
                    inspection_lot_qty: response.data.inspection_lot_qty,
                    inspection_qty: response.data.inspection_qty,
                    inspection_group: response.data.inspection_group,
                    inspection_line: response.data.inspection_line,
                    inspection_lot_ke: response.data.inspection_lot_ke,
                    inspection_status: response.data.inspection_status,
                    inspection_sn: response.data.inspection_sn,
                    status_parts: response.data.WmCheckItemArr,
                    problems: response.data.wmCheckNgArr,
                    need_parts: response.data.WmCheckImprovementArr,
                });
                setMachineParts(response.data.WmCheckItemArr);
                setMachineProblem(response.data.wmCheckNgArr);
                setMachineNeedParts(response.data.WmCheckImprovementArr);
                setPdfVersion(true);

                const modelId = response.data.wm_model_id;
                wm_modelService.get(modelId).then(
                    (response) => {
                        const resp = response.data;
                        //console.log(resp);
                        setTensionBelt(resp.tension_belt);
                        setTimerPutaranPenuhWash(resp.timer_putaran_penuh_wash);
                        setTimerPutaranPenuhSpin(resp.timer_putaran_penuh_spin);
                        setLidSw(resp.lid_sw);
                    },
                    (error) => {
                        const _content =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();

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
                console.log(_content);
                setMachine(_content);
            }
        );
    };


    useEffect(() => {
        retrieveMachine(wmCheckId);
    }, [wmCheckId]);

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
                        <Link to={"/approval-oqc"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>Outgoing Check Machine</Typography>
                        
                    </div>
                    <Card>
                        <CardContent>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    id: machine.id,
                                    inspection_date: formatdate(machine.date),
                                    inspection_approval: machine.inspection_approval,
                                    inspection_name: machine.inspection_name,
                                    wm_model_name: machine.wm_model_name,
                                    wm_type_name: machine.wm_type_name,
                                    wm_check_id: wmCheckId,
                                    supervisor_id: user.id,
                                    photo_name: machine.photo_name,
                                    supervisor_approval: machine.supervisor_approval,
                                    inspection_lot_qty: machine.inspection_lot_qty,
                                    inspection_qty: machine.inspection_qty,
                                    inspection_group: machine.inspection_group,
                                    inspection_line: machine.inspection_line,
                                    inspection_lot_ke: machine.inspection_lot_ke,
                                    inspection_status: machine.inspection_status,
                                    inspection_sn: machine.inspection_sn,
                                    status_parts: [
                                        {
                                            wm_item_check_id: 0,
                                            status: true,
                                            check_value: ""
                                        },
                                    ],
                                    problems: [
                                        {
                                            masalah: "",
                                            tindakan: "",
                                        },
                                    ],
                                    need_parts: [
                                        {
                                            name: "",
                                            standard: "",
                                            status: "",
                                            is_boolean: true,
                                            result: ""
                                        },
                                    ],
                                }}
                                validationSchema={Yup.object({
                                    inspection_status: Yup.string().required("Required").nullable(),
                                    })}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    setTimeout(() => {
                                        var data = {
                                            wm_check_id: values.wm_check_id,
                                            supervisor_date: dateNow(),
                                            supervisor_approval: true,
                                            supervisor_id: values.supervisor_id,
                                            inspection_status: values.inspection_status,
                                            photo_name: image
                                        };
                                        //alert(JSON.stringify(data, null, 2));
                                        //console.log(JSON.stringify(data, null, 2));
                                        //setSubmitting(false);
                                        wm_checkService.update(wmCheckId, data)
                                            .then(
                                                (response) => {
                                                    setSubmitting(false);
                                                    setOpen(true);
                                                    setApproveButton(true);
                                                    setSnackbarMsg(response.data.message);
                                                },
                                                (error) => {
                                                    const _content =
                                                        (error.response &&
                                                            error.response.data &&
                                                            error.response.data.message) ||
                                                        error.message ||
                                                        error.toString();
                                                    setOpen(true);
                                                    setApproveButton(true);
                                                    setSnackbarMsg(_content);
                                                }
                                            )
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                    }, 400);
                                }}
                            >
                                
                                    <Form className={classes.form} autoComplete="off" novalidate="novalidate">
                                        <MyTextHidden
                                            name="wm_type_id"
                                            type="hidden"
                                            readonly="true"
                                        />
                                        <MyTextHidden
                                            name="inspection_id"
                                            type="hidden"
                                            readonly="true"
                                        />
                                        <Grid container spacing={2}>
                                            <Grid item sm={4} >
                                                <div className={classes.item}>
                                                    <MyTextInput
                                                        label="Type"
                                                        name="wm_type_name"
                                                        type="text"
                                                        placeholder="Enter Type"
                                                        readonly="true"
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item sm={4} >
                                                <div className={classes.item}>
                                                    <MyTextInput
                                                        label="Profile (inspector)"
                                                        name="inspection_name"
                                                        type="text"
                                                        placeholder="Enter inspector"
                                                        readonly="true"
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item sm={4} >
                                                <div className={classes.item}>
                                                    <MyTextInput
                                                        label="Model"
                                                        name="wm_model_name"
                                                        type="text"
                                                        placeholder="Enter Model"
                                                        readonly="true"
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={4} >
                                                <div className={classes.item}>
                                                    <MyTextInput
                                                        label="Lot qty"
                                                        name="inspection_lot_qty"
                                                        type="number"
                                                        placeholder="Enter lot qty"
                                                        readonly="true"
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={4} >
                                                <div className={classes.item}>
                                                    <MyTextInput
                                                        label="Qty"
                                                        name="inspection_qty"
                                                        type="number"
                                                        placeholder="Enter qty"
                                                        readonly="true"
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={4} >
                                                <div className={classes.item}>
                                                    <MyTextInput
                                                        label="Group"
                                                        name="inspection_group"
                                                        type="text"
                                                        placeholder="Enter group"
                                                        readonly="true"
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={4} >
                                                <div className={classes.item}>
                                                    <MyTextInput
                                                        label="Line"
                                                        name="inspection_line"
                                                        type="text"
                                                        placeholder="Enter line"
                                                        readonly="true"
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={4} >
                                                <div className={classes.item}>
                                                    <MyTextInput
                                                        label="Lot ke"
                                                        name="inspection_lot_ke"
                                                        type="number"
                                                        placeholder="Enter Lot ke"
                                                        readonly="true"
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={4} >
                                                <div className={classes.item}>
                                                    <MyTextInput
                                                        label="Serial number"
                                                        name="inspection_sn"
                                                        type="text"
                                                        placeholder="Enter Serial number"
                                                        readonly="true"
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item sm={12}>
                                                <Typography variant="h5" className={classes.titleSparepartCondition}>Item Checks</Typography>
                                                <TableContainer component={Paper}>
                                                    <Table className={classes.table} aria-label="Item Check Category">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>#</TableCell>
                                                                <TableCell>Item</TableCell>
                                                                <TableCell>Standard</TableCell>
                                                                <TableCell>Status</TableCell>
                                                                <TableCell>Result</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {machineParts &&
                                                                machineParts.map((value, index) => {
                                                                    let valueStandard = "";
                                                                    if (value.wm_item_check_id == 1015) {
                                                                        valueStandard = tensionBelt;
                                                                    } else if (value.wm_item_check_id == 1029) {
                                                                        valueStandard = timerPutaranPenuhWash;
                                                                    } else if (value.wm_item_check_id == 1031) {
                                                                        valueStandard = timerPutaranPenuhSpin;
                                                                    } else if (value.wm_item_check_id == 1073) {
                                                                        valueStandard = lidSw;
                                                                    } else {
                                                                        valueStandard = value.wm_item_check_standard;
                                                                    }
                                                                    return (
                                                                        <TableRow key={index}>
                                                                            <TableCell className={(value.status == "NG") ? classes.cellNG : classes.cellOK}>
                                                                                {++index}
                                                                            </TableCell>
                                                                            <TableCell className={(value.status == "NG") ? classes.cellNG : classes.cellOK}>{value.wm_item_check_name}</TableCell>
                                                                            <TableCell className={(value.status == "NG") ? classes.cellNG : classes.cellOK}>{valueStandard}</TableCell>
                                                                            <TableCell className={(value.status == "NG") ? classes.cellNG : classes.cellOK}>{value.status}</TableCell>
                                                                            <TableCell className={(value.status == "NG") ? classes.cellNG : classes.cellOK}>{value.wm_item_check_result}</TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                            
                                                    <React.Fragment>
                                                        <Grid item sm={12}>
                                                            <Card>
                                                                <CardHeader title="Detail NG" />
                                                                <CardContent>
                                                                    <Grid container spacing={2}>
                                                                {machine.problems &&
                                                                    machine.problems.map(
                                                                                (problem, index) => (
                                                                                    <>
                                                                                        <Grid item sm={6} className={classes.labelWrapper}>
                                                                                            <Typography htmlFor="item" className={classes.label}>
                                                                                                Item
                                                                                            </Typography>
                                                                                            <textarea
                                                                                                type="text"
                                                                                                value={problem.wm_item_check_name}
                                                                                                readOnly="true"
                                                                                                className={classes.formControl}
                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item sm={3} className={classes.labelWrapper}>
                                                                                            <Typography htmlFor="masalah" className={classes.label}>
                                                                                                Masalah
                                                                                            </Typography>
                                                                                            <textarea
                                                                                                type="text"
                                                                                                value={problem.masalah}
                                                                                                readOnly="true"
                                                                                                className={classes.formControl}
                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item sm={3} className={classes.labelWrapper}>
                                                                                            <Typography htmlFor="tindakan" className={classes.label}>
                                                                                                Tindakan
                                                                                            </Typography>
                                                                                            <textarea
                                                                                                type="text"
                                                                                                value={problem.tindakan}
                                                                                                readOnly="true"
                                                                                                className={classes.formControl}
                                                                                            />
                                                                                        </Grid>
                                                                                    </>
                                                                                )
                                                                            )}
                                                                    </Grid>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    </React.Fragment>
                                                
                                            
                                                    <React.Fragment>
                                                        <Grid item sm={12}>
                                                            <Card>
                                                                <CardHeader
                                                                    title="Additional Check"
                                                                />
                                                                <CardContent>
                                                                    <Grid container spacing={2}>
                                                                {machine.need_parts && machine.need_parts.map((need_part, index) => (
                                                                            <>
                                                                        <Grid item xs={12} sm={3} className={classes.labelWrapper}>
                                                                            <Typography htmlFor="name" className={classes.label}>
                                                                                        Name
                                                                                    </Typography>
                                                                                    <input
                                                                                        type="text"
                                                                                        value={need_part.name}
                                                                                        readOnly="true"
                                                                                        className={classes.formControl}
                                                                                    />
                                                                                </Grid>
                                                                        <Grid item xs={12} sm={4} className={classes.labelWrapper}>

                                                                            <Typography htmlFor="standard" className={classes.label}>
                                                                                        Standard
                                                                            </Typography>
                                                                            <input
                                                                                className={classes.formControl}
                                                                                type="text"
                                                                                value={need_part.standard}
                                                                                readOnly="true"
                                                                            />
                                                                        </Grid>

                                                                        <Grid item xs={12} sm={1} className={classes.labelWrapper}>

                                                                            <Typography htmlFor="status" className={classes.label}>
                                                                                Status
                                                                            </Typography>
                                                                            <input
                                                                                className={classes.formControl}
                                                                                type="text"
                                                                                value={need_part.status ? "OK" : "NG"}
                                                                                readOnly="true"
                                                                            />
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={4} className={classes.labelWrapper}>

                                                                            <Typography htmlFor="result" className={classes.label}>
                                                                                Result
                                                                            </Typography>
                                                                            <input
                                                                                className={classes.formControl}
                                                                                type="text"
                                                                                value={need_part.result}
                                                                                readOnly="true"
                                                                            />
                                                                        </Grid>
                                                                            </>
                                                                        )
                                                                        )}
                                                                    </Grid>
                                                                </CardContent>
                                                                
                                                            </Card>
                                                        </Grid>
                                                    </React.Fragment>

                                            {!approveButton && (
                                                <Grid item xs={12}>
                                                    <div className={classes.item}>
                                                        <div className={classes.captureImage}>
                                                            {image == '' ? <Webcam
                                                                audio={false}
                                                                height={320}
                                                                width={480}
                                                                ref={webcamRef}
                                                                screenshotFormat="image/jpeg"
                                                                className={classes.webcam}
                                                                videoConstraints={videoConstraints}
                                                            /> : (<React.Fragment>

                                                                <img src={image} id="myImage" className={classes.webcam} />
                                                            </React.Fragment>)}

                                                            {image != '' ?
                                                                <Button variant="contained" color="default" onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setImage('')
                                                                }}
                                                                    className="webcam-btn">
                                                                    Retake Image</Button> :
                                                                <Button variant="contained" color="default" onClick={(e) => {
                                                                    e.preventDefault();
                                                                    capture();
                                                                }}
                                                                    className="webcam-btn">Capture </Button>
                                                            }

                                                        </div>
                                                    </div>
                                                </Grid>
                                            )}

                                            <Grid item xs={12} sm={12} >
                                                <div className={classes.item}>
                                                    <MySelect
                                                        label="Status *"
                                                        name="inspection_status"
                                                        disabled={approveButton}
                                                    >
                                                        <option value="">
                                                            Select a status
                                                        </option>
                                                        <option value="OK">
                                                            OK
                                                        </option>
                                                        <option value="HOLD">
                                                            HOLD
                                                        </option>
                                                        <option value="NG">
                                                            NG
                                                        </option>
                                                    </MySelect>
                                                </div>
                                            </Grid>

                                            {approveButton && photoName && (
                                                <Grid item xs={12} style={{ textAlign: "center" }}>
                                                    <Typography variant="body1">Picture</Typography>
                                                    <img src={photoName} id="myImage" className={classes.webcam} />
                                                </Grid>
                                            )}

                                            <Grid item sm={12} className={classes.buttonContainer}>
                                                
                                                <Button type="submit" variant="contained" color="primary" className={classes.buttonSubmit} disabled={approveButton}>
                                                    Approve
                                                </Button>
                                                <Link to={"/approval-oqc"} className={classes.link}>
                                                    <Button type="button" variant="contained" color="secondary" className={classes.buttonClear}>
                                                        Back
                                                    </Button>
                                                </Link>
                                                {pdfVersion && (
                                                    <PDFDownloadLink document={
                                                        <PdfGenerateFile
                                                            machine={machine}
                                                            
                                                        />
                                                    } fileName={`outgoing_check_sheet_${wmCheckId}.pdf`}>
                                                        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : (
                                                        
                                                                <Button type="button" variant="contained" color="primary" className={classes.buttonDownload}><PictureAsPdf/></Button>
                                                        
                                                        
                                                        ))}
                                                    </PDFDownloadLink>
                                                )}

                                            </Grid>
                                        </Grid>
                                    </Form>
                            
                            </Formik>
                        </CardContent>
                    </Card>
                </React.Fragment>
            {/* )} */}
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={handleClose} severity={severity}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default FormApprCheckMachine;