import React, { useState, useContext } from 'react'
import { Fab, TextareaAutosize, makeStyles, Container, Typography, Snackbar } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import { Navigate, Link, useNavigate } from "react-router-dom";
import QrScan from 'react-qr-reader';
import { UserContext } from "../UserContext";
import outgoingService from "../services/outgoing.service";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10)
    },
    wrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap"
    },
    title: {
        marginBottom: theme.spacing(2)
    },
}));

function OutgoingScanner() {
    const { user } = useContext(UserContext);
    const classes = useStyles();
    const navigate = useNavigate();
    const [qrscan, setQrscan] = useState('No result');
    const [openAlert, setOpenAlert] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [severity, setSeverity] = useState("success");
    const handleScan = async (data) => {
        if (data) {
            /* let scanResult = [];
            let modelName = "";
            let serialNumber = ""; */
            setQrscan(data);
            let scanResult = data.split(",");
            //console.log(data);
            let modelName = scanResult[0];
            let fullSerialNumber = scanResult[1];
            let serialNumber = fullSerialNumber.substr(0,5);
            let lotNumber = fullSerialNumber.substr(-6,6);
            /* console.log(`modelName : ${modelName}`);
            console.log(`fullSerialNumber : ${fullSerialNumber}`);
            console.log(`serialNumber : ${serialNumber}`);
            console.log(`lotNumber : ${lotNumber}`); */
            //console.log(user);
            let values = {
                model_name: modelName,
                serial_no: fullSerialNumber,
                lot_number: lotNumber,
                total_qty: 500,
                note_remark: "",
                user_id: user.id,
                barcode: data,
                date_check: new Date("Y-m-d")
            }

            const checkBarcode = await outgoingService.getByBarcode(data);
            const countBarcode = checkBarcode.data.length; 

            if(countBarcode <= 0) {
                setTimeout(() => {
                    outgoingService.create(values)
                        .then(
                            (response) => {
                                console.log(response);
                                navigate(`/outgoing-list`, { replace: true });
                            },
                            (error) => {
                                const _content =
                                    (error.response &&
                                        error.response.data &&
                                        error.response.data.message) ||
                                    error.message ||
                                    error.toString();
                                console.log(_content)
                            }
                        )
                        .catch((error) => {
                            console.log(error);
                        });
                }, 400);
            } else {
                setQrscan("This serial number already EXIST in system, please scan another QR CODE");
                setSnackbarMsg("This serial number already EXIST in system, please scan another QR CODE");
                setOpenAlert(true);
                setSeverity("error")
            }
        }
    }
    const handleError = err => {
        console.error(err)
    }

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenAlert(false);
    };

    return (
        <Container className={classes.container} maxWidth="sm">
            {!user && (
                <Navigate to="/login" replace={true} />
            )}
            {/* {!user.roles.includes("ROLE_OPERATOR") ? (
                <Typography>Not Allowed</Typography>
            ) : ( */}
                <React.Fragment>
                    <Typography variant="h4" className={classes.title}>QR Scanner</Typography>

                    <center>
                        <QrScan
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ height: 320, width: 480 }}
                        />

                        <TextareaAutosize
                            style={{ fontSize: 18, width: 320, height: 100, marginTop: 200 }}
                            maxRows={4}
                            value={qrscan}
                        />
                    </center>


                </React.Fragment>
            {/* )} */}
            <Snackbar open={openAlert} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
                <Alert onClose={handleClose} severity={severity}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default OutgoingScanner;
