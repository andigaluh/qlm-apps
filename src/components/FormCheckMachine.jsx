import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, Container, Fab, Grid, makeStyles, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CardActions, Button, CardHeader, Snackbar, Select, TextField } from "@material-ui/core";
import { useParams, Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Add, ArrowBack, Delete } from "@material-ui/icons";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import wm_typeService from "../services/wm_type.service";
import wm_modelService from "../services/wm_model.service";
import wm_item_checkService from "../services/wm_item_check.service";
import { dateNow} from "../helpers/DateCustom";
import MuiAlert from '@material-ui/lab/Alert';
import { MyTextInput, MySelect, MyTextArea} from "../helpers/FormElement"
import wm_item_check_categoryService from "../services/wm_item_check_category.service";
import wm_checkService from "../services/wm_check.service";

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
    buttonContainer:{
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        display: "flex",
        justifyContent:"center",
    },
    buttonSubmit:{
        marginRight: theme.spacing(2)
    },
    titleSparepartCondition:{
        marginBottom: theme.spacing(4),
    },
    table: {
        minWidth: 550,
    },
}));

const FormCheckMachine = () => {
    const { user } = useContext(UserContext);
    const params = useParams();
    const wmTypeId = params.id;
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [currentModel, setCurrentModel] = useState([]);
    const [currentItemCheckCategory, setCurrentItemCheckCategory] = useState([]);
    const [currentItemCheck, setCurrentItemCheck] = useState([]);
    const [currentWmType, setCurrentWmType] = useState({});
    const [currentWmTypeName, setCurrentWmTypeName] = useState("");
    const [machineParts, setMachineParts] = useState([]);
    const [statusItems, setStatusItems] = useState([]);
    const [currentParts, setCurrentParts] = useState([]);
    const [severity, setSeverity] = useState("success");
    const [serialNumber, setSerialNumber] = useState("");
    const [changeModel, setChangeModel] = useState("");
    const [tensionBelt, setTensionBelt] = useState("");
    const [timerPutaranPenuhWash, setTimerPutaranPenuhWash] = useState("");
    const [timerPutaranPenuhSpin, setTimerPutaranPenuhSpin] = useState("");
    const [lidSw, setLidSw] = useState("");

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const retrieveWmModel = (wm_type_id) => {
        wm_modelService.getByWmType(wm_type_id).then(
            (response) => {
                setCurrentModel(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setCurrentModel(_content);
            }
        );
    };

    const retrieveWmItemCheckCategory = (wm_type_id) => {
        wm_item_check_categoryService.getByWmType(wm_type_id).then(
            (response) => {
                //console.log(response.data);
                setCurrentItemCheckCategory(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setCurrentItemCheckCategory(_content);
            }
        );
    };

    const retrieveWmItemCheck = (wm_type_id) => {
        wm_item_checkService.getByCategory(wm_type_id).then(
        /* wm_item_checkService.getByWmType(wm_type_id).then( */
            (response) => {
                //console.log(wm_type_id);
                setCurrentItemCheck(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setCurrentItemCheck(_content);
            }
        );
    };

    const retrieveMachine = (wmTypeId) => {
        wm_typeService.get(wmTypeId).then(
            (response) => {
                //console.log(response.data)
                setCurrentWmType(response.data);
                setCurrentWmTypeName(response.data.name);
                //setMachineParts(response.data.parts);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setCurrentWmType(_content);
            }
        );
    } 

    const handleRadioChange = (event) => {
        const { value, id } = event.target;
        const array = Object.values(statusItems);

        let objIndex = array.findIndex((obj) => obj.wm_item_check_id == id);

        if (objIndex < 0) {
            //alert("obj found:" + value);
            array.push({ wm_item_check_id: id, status: value });
        } else {
            //alert("obj NOT found:" + value);
            array[objIndex].status = value;
        }

        setStatusItems(array);
    };

    const handleResultChange = (event) => {
        const { value, id } = event.target;
        const array = Object.values(statusItems);

        let objIndex = array.findIndex((obj) => obj.wm_item_check_id == id);

        if (objIndex < 0) {
            array.push({ wm_item_check_id: id, status: value });
        } else {
            array[objIndex].check_value = value;
        }

        setStatusItems(array);
    };

    const resetRadioCheck = () => {
        var ele = document.getElementsByClassName("radio-check");
        for (var i = 0; i < ele.length; i++) ele[i].checked = false;
    }

    useEffect(() => {
        retrieveWmModel(wmTypeId);
        retrieveMachine(wmTypeId);
        retrieveWmItemCheck(wmTypeId);
    }, [wmTypeId]);

    const handleModelChange = (e) => {
        e.preventDefault();
        const modelId = e.target.value;
        console.log(modelId);
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
        );
        setChangeModel(modelId);
    }

    return (
        <Container className={classes.container}>
            {!user && (
                <Navigate to="/login" replace={true} />
            )}
            {!user.roles.includes("ROLE_OPERATOR") ? (
                <Typography>Not Allowed</Typography>
            ) : (
                <React.Fragment>
                    <div className={classes.titleContainer}>
                        <Link to={"/oqc"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>Outgoing Form</Typography>
                    </div>
                    <Card>
                        <CardContent>
                                <Formik
                                    enableReinitialize
                                    initialValues={{
                                        id: null,
                                        inspection_lot_qty: 0,
                                        inspection_qty: 0,
                                        inspection_group: "",
                                        inspection_line: "",
                                        inspection_lot_ke: "",
                                        inspection_status: "HOLD",
                                        inspection_sn: "",
                                        inspection_date: dateNow(),
                                        inspection_approval: true,
                                        inspection_id: user.id,
                                        inspection_name: user.name,
                                        supervisor_id: (user.superior_id[0]) ? user.superior_id[0].id : 0,
                                        wm_type_id: wmTypeId,
                                        wm_type_name: currentWmType.name,
                                        wm_model_id: changeModel,
                                        wm_check_item: [
                                            {
                                                wm_item_check_id: 0,
                                                status: true,
                                                check_value: ""
                                            },
                                        ],
                                        wm_check_ng: [
                                            {
                                                masalah: "",
                                                tindakan: "",
                                                wm_item_check_id: 0
                                            },
                                        ],
                                        wm_check_improvement: [
                                            {
                                                name: "",
                                                standard: "",
                                                status: "",
                                                is_boolean: true,
                                                result: "",
                                            },
                                        ],
                                    }}
                                    validationSchema={Yup.object({
                                        inspection_sn: Yup.string().required("Required"),
                                        inspection_lot_qty: Yup.number().required("Required"),
                                        inspection_qty: Yup.number().required("Required"),
                                        inspection_group: Yup.string().required("Required"),
                                        inspection_line: Yup.string().required("Required"),
                                        inspection_lot_ke: Yup.string().required("Required"),
                                        wm_model_id: Yup.number().required("Required"),
                                    })}
                                    onSubmit={(values, { setSubmitting, resetForm }) => {
                                        setTimeout(() => {
                                            //alert(values.wm_model_id);
                                            var statusItemsArr = Object.values(statusItems).map(
                                                function (key) {
                                                    return key;
                                                }
                                            );
                                            var lengthMachineParts = currentItemCheck.length;
                                            //lert(statusItemsArr.length);
                                            if (statusItemsArr.length > 0 && statusItemsArr.length == lengthMachineParts) {
                                                let wm_check_ngArr = values.wm_check_ng;
                                                let wm_check_improvementArr = values.wm_check_improvement;

                                                if (wm_check_ngArr.length > 0 && wm_check_ngArr[0].masalah === "" && wm_check_ngArr[0].tindakan === "") {
                                                    wm_check_ngArr = [];
                                                }

                                                if (wm_check_improvementArr.length > 0 && wm_check_improvementArr[0].name === "" && wm_check_improvementArr[0].standard === "") {
                                                    wm_check_improvementArr = [];
                                                }

                                                var data = {
                                                    inspection_lot_qty: values.inspection_lot_qty,
                                                    inspection_qty: values.inspection_qty,
                                                    inspection_group: values.inspection_group,
                                                    inspection_line: values.inspection_line,
                                                    inspection_lot_ke: values.inspection_lot_ke,
                                                    inspection_status: values.inspection_status,
                                                    inspection_sn: values.inspection_sn,
                                                    inspection_date: values.inspection_date,
                                                    inspection_approval: true,
                                                    inspection_id: values.inspection_id,
                                                    inspection_name: values.inspection_name,
                                                    supervisor_id: values.supervisor_id,
                                                    wm_model_id: values.wm_model_id,
                                                    wm_type_id: values.wm_type_id,
                                                    wm_type_name: values.wm_type_name,
                                                    wm_check_item: statusItemsArr,
                                                    wm_check_ng: wm_check_ngArr,
                                                    wm_check_improvement: wm_check_improvementArr,
                                                };
                                                //console.log(JSON.stringify(data,null,2));
                                                wm_checkService.create(data)
                                                    .then(
                                                        (response) => {
                                                            setSubmitting(false);
                                                            setOpen(true);
                                                            setSnackbarMsg(response.data.message);
                                                            resetForm();
                                                        },
                                                        (error) => {
                                                            const _content =
                                                                (error.response &&
                                                                    error.response.data &&
                                                                    error.response.data.message) ||
                                                                error.message ||
                                                                error.toString();
                                                            setSeverity("error")
                                                            setOpen(true);
                                                            setSnackbarMsg(_content);
                                                        }
                                                    )
                                                    .catch((error) => {
                                                        console.log(error);
                                                    }); 
                                                setSubmitting(false);
                                                resetForm();
                                                resetRadioCheck();
                                                setStatusItems([]);
                                            } else {
                                                setSeverity("error");
                                                setOpen(true);
                                                setSnackbarMsg("Please check all items");
                                                setSubmitting(true);
                                            }
                                        }, 400);
                                    }}
                                >
                                    {({ values, touched, errors }) => (
                                        <Form className={classes.form} autoComplete="off" novalidate="novalidate">
                                            <input
                                                id="wm_type_id"
                                                type="hidden"
                                                readOnly="true"
                                                name="wm_type_id"
                                                value={values.wm_type_id}
                                            />
                                            <input
                                                id="inspection_id"
                                                type="hidden"
                                                readOnly="true"
                                                name="inspection_id"
                                                value={values.inspection_id}
                                            />
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={4} >
                                                <div className={classes.item}>
                                                        <MyTextInput
                                                            label="Washing machine type"
                                                            name="wm_type_name"
                                                            type="text"
                                                            placeholder="Enter washing machine type"
                                                            readonly="true"
                                                        />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={4} >
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
                                            <Grid item xs={12} sm={4} >
                                                <div className={classes.item}>
                                                        
                                                        <MySelect
                                                            label="Model"
                                                            name="wm_model_id"
                                                            onChange={handleModelChange}
                                                            value={changeModel}
                                                            id="wm_model_id"
                                                        >
                                                            <option value="">
                                                                Select a Model
                                                            </option>
                                                            {currentModel &&
                                                                currentModel.map((v) => (
                                                                    <option value={v.id}>
                                                                        {v.name}
                                                                    </option>
                                                                ))}
                                                        </MySelect>
                                                        {touched.shift_id && errors.shift_id ? (
                                                            <Typography size="small" color="error">{errors.shift_id}</Typography>
                                                        ) : null} 
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={4} >
                                                <div className={classes.item}>
                                                    <MyTextInput
                                                        label="Lot qty"
                                                        name="inspection_lot_qty"
                                                        type="number"
                                                        placeholder="Enter lot qty"
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
                                                        required
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
                                                            {currentItemCheck &&
                                                                    currentItemCheck.map((value, index) => {
                                                                        let valueStandard = "";
                                                                        if (value.id == 1015) {
                                                                            valueStandard = tensionBelt;
                                                                        } else if (value.id == 1029) {
                                                                            valueStandard = timerPutaranPenuhWash;
                                                                        } else if (value.id == 1031) {
                                                                            valueStandard = timerPutaranPenuhSpin;
                                                                        } else if (value.id == 1073) {
                                                                            valueStandard = lidSw;
                                                                        }else {
                                                                            valueStandard = value.standard;
                                                                        }
                                                                    return (
                                                                    <TableRow key={index}>
                                                                    <TableCell>
                                                                        {++index}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {value.name}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {valueStandard}
                                                                                                                                                
                                                                    </TableCell>
                                                                    
                                                                    <TableCell>
                                                                        <div className="form-checkbox">
                                                                            <input
                                                                                type="radio"
                                                                                id={`${value.id}`}
                                                                                name={`wm_check_item.${index}.status`}
                                                                                value="OK"
                                                                                onClick={handleRadioChange}
                                                                                className="radio-check"
                                                                            />{" "}
                                                                            OK
                                                                            <br />
                                                                            <br />
                                                                            <input
                                                                                type="radio"
                                                                                id={`${value.id}`}
                                                                                value="NG"
                                                                                name={`wm_check_item.${index}.status`}
                                                                                className="radio-check"
                                                                                onClick={handleRadioChange}
                                                                            />{" "}
                                                                            NG
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {value.is_boolean ? (
                                                                            <>
                                                                                <input
                                                                                    type="text"
                                                                                    id={`${value.id}`}
                                                                                    name={`wm_check_item.${index}.check_value`}
                                                                                    className="form-control"
                                                                                    disabled
                                                                                />
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <input
                                                                                    type="text"
                                                                                    id={`${value.id}`}
                                                                                    name={`wm_check_item.${index}.check_value`}
                                                                                    className="form-control"
                                                                                    onChange={handleResultChange}
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                                );
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                                <FieldArray name="wm_check_ng">
                                                {({ insert, remove, push }) => (
                                                    <React.Fragment>
                                                        <Grid item sm={12}>
                                                            <Card>
                                                                <CardHeader title="Detail NG"/>
                                                                <CardContent>
                                                                    <Grid container spacing={2}>
                                                                            {values.wm_check_ng.length > 0 &&
                                                                                values.wm_check_ng.map(
                                                                                    (problem, index) => (
                                                                                        <>
                                                                                            <Grid item sm={5}>
                                                                                                <div className={classes.item}>
                                                                                                    <MySelect
                                                                                                        label="Item"
                                                                                                        name={`wm_check_ng.${index}.wm_item_check_id`}
                                                                                                    >
                                                                                                        <option>
                                                                                                            Choose 
                                                                                                        </option>
                                                                                                        {currentItemCheck && currentItemCheck.map((values, index) => {
                                                                                                            return (
                                                                                                                <option value={values.id}>
                                                                                                                    {values.name} {" - "} {values.standard}
                                                                                                                </option>
                                                                                                            )
                                                                                                        })}

                                                                                                    </MySelect>
                                                                                                </div>
                                                                                            </Grid>
                                                                                            <Grid item sm={3}>
                                                                                                <MyTextArea
                                                                                                    label="Masalah"
                                                                                                    name={`wm_check_ng.${index}.masalah`}
                                                                                                    placeholder="Enter masalah"
                                                                                                />
                                                                                            </Grid>
                                                                                            <Grid item sm={3}>
                                                                                                <MyTextArea
                                                                                                    label="Tindakan"
                                                                                                    name={`wm_check_ng.${index}.tindakan`}
                                                                                                    placeholder="Enter tindakan"
                                                                                                />
                                                                                            </Grid>
                                                                                            <Grid item sm={1}>
                                                                                                <Typography variant="subtitle2">Action</Typography>
                                                                                                <Button
                                                                                                    type="button"
                                                                                                    className="btn btn-sm btn-danger"
                                                                                                    onClick={() => remove(index)}
                                                                                                >
                                                                                                    <Delete size="small" />
                                                                                                </Button>
                                                                                            </Grid>
                                                                                        </>
                                                                                    )
                                                                                )}
                                                                    </Grid>
                                                                </CardContent>
                                                                <CardActions>
                                                                        <Button
                                                                            type="button"
                                                                            variant="outlined"
                                                                            color="primary"
                                                                            onClick={() =>{
                                                                                push({
                                                                                    masalah: "",
                                                                                    tindakan: "",
                                                                                })
                                                                            }}
                                                                        >
                                                                            <Add size="small" /> Add
                                                                            Problem
                                                                        </Button>
                                                                </CardActions>
                                                            </Card>
                                                        </Grid>
                                                    </React.Fragment>
                                                )}
                                            </FieldArray>
                                            <FieldArray name="wm_check_improvement">
                                                {({ insert, remove, push }) => (
                                                    <React.Fragment>
                                                        <Grid item sm={12}>
                                                            <Card>
                                                                <CardHeader 
                                                                    title="Additional Check"
                                                                />
                                                                <CardContent>
                                                                    <Grid container spacing={2}>
                                                                            {values.wm_check_improvement.length > 0 && values.wm_check_improvement.map((need_part, index) => (
                                                                                <>
                                                                                <Grid item sm={3}>
                                                                                    <MyTextInput
                                                                                        label="Name"
                                                                                        name={`wm_check_improvement.${index}.name`}
                                                                                        placeholder="enter name"
                                                                                        type="text"
                                                                                    />
                                                                                </Grid>
                                                                                <Grid item sm={4}>
                                                                                    
                                                                                        <MyTextInput
                                                                                            label="Standard"
                                                                                            name={`wm_check_improvement.${index}.standard`}
                                                                                            placeholder="enter standard"
                                                                                            type="text"
                                                                                        />
                                                                                </Grid>
                                                                                <Grid item sm={1}>
                                                                                    <div className={classes.item}>
                                                                                        <MySelect
                                                                                            label="Status"
                                                                                            name={`wm_check_improvement.${index}.status`}
                                                                                        >
                                                                                            <option>
                                                                                                Fill status
                                                                                            </option>
                                                                                            
                                                                                            <option value="1">
                                                                                                OK
                                                                                            </option>

                                                                                            <option value="0">
                                                                                                NG
                                                                                            </option>
                                                                                                
                                                                                        </MySelect>
                                                                                    </div>
                                                                                </Grid>
                                                                                <Grid item sm={3}>
                                                                                    <div className={classes.item}>
                                                                                        <MyTextInput
                                                                                            label="Result"
                                                                                            name={`wm_check_improvement.${index}.result`}
                                                                                            placeholder="Result"
                                                                                            type="text"
                                                                                        />
                                                                                    </div>
                                                                                </Grid>
                                                                                <Grid item sm={1}>
                                                                                    <Typography variant="subtitle2">Action</Typography>
                                                                                        <Button
                                                                                            type="button"
                                                                                            
                                                                                            className="btn btn-sm btn-danger"
                                                                                            onClick={() => remove(index)}
                                                                                        >
                                                                                            <Delete size="small"/>
                                                                                        </Button>
                                                                                </Grid>
                                                                                </>
                                                                            )
                                                                        )}
                                                                    </Grid>
                                                                </CardContent>
                                                                <CardActions>
                                                                        <Button
                                                                            type="button"
                                                                            variant="outlined"
                                                                            color="primary"
                                                                            onClick={() =>
                                                                                push({
                                                                                    parts_id: 0,
                                                                                    qty: "",
                                                                                    type: "subtraction",
                                                                                })
                                                                            }
                                                                        >
                                                                            <Add size="small"/> Add
                                                                            Spareparts
                                                                        </Button>
                                                                </CardActions>
                                                            </Card>
                                                        </Grid>
                                                    </React.Fragment>
                                                )}
                                            </FieldArray>
                                            <Grid item sm={12} className={classes.buttonContainer}>
                                                    <Button type="submit" variant="contained" color="primary" className={classes.buttonSubmit}>
                                                        Submit
                                                    </Button>
                                                    <Button type="reset" variant="contained" color="secondary" className={classes.buttonClear}>
                                                        Clear
                                                    </Button>
                                            </Grid>
                                        </Grid>
                                    </Form>
                                )}
                                </Formik>
                        </CardContent>
                    </Card>
                </React.Fragment>
            )}
            <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={handleClose} severity={severity}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default FormCheckMachine;