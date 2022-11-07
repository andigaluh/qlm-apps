import React, { useState, useContext } from 'react'
import { Fab, TextareaAutosize, makeStyles, Container, Typography } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import { Navigate, Link, useNavigate } from "react-router-dom";
import QrScan from 'react-qr-reader';
import { UserContext } from "../UserContext";
import toolsService from "../services/tools.service";
import TokenService from '../services/token.service';

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

function QRscanner() {
    const { user } = useContext(UserContext);
    const classes = useStyles();
    const navigate = useNavigate();
    const [qrscan, setQrscan] = useState('No result');
    const handleScan = data => {
        if (data) {
            setQrscan(data);
            console.log(data)
            toolsService.getByCode(data).then(
                (response) => {
                    const value = response.data;
                    navigate(`/tools/form/${value.id}`, { replace: true });
                },
                (error) => {
                    const _content =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    if (error.response && error.response.status === 403) {
                        TokenService.removeUser();
                        navigate("/login", { replace: true });
                    }
                    console.log(_content)
                }
            )
        }
    }
    const handleError = err => {
        console.error(err)
    }

    return (
        <Container className={classes.container} maxWidth="sm">
            {!user && (
                <Navigate to="/login" replace={true} />
            )}
            {!user.roles.includes("ROLE_OPERATOR") ? (
                <Typography>Not Allowed</Typography>
            ) : (
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
                        style={{ fontSize: 18, width: 320, height: 100, marginTop: 300 }}
                        maxRows={4}
                        value={qrscan}
                    /> 
                    </center>


                </React.Fragment>
            )}
        </Container>
    );
}

export default QRscanner;
