import { Container, makeStyles, Snackbar, Typography, IconButton, Card, CardContent, Tooltip, Fab, Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@material-ui/core";
import React, { useContext, useEffect, useState, useMemo } from "react"
import { UserContext, SparepartsContext } from "../UserContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { Delete, Edit, Add as AddIcon, AccountBalanceWallet, Exposure, GetApp } from "@material-ui/icons";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import MuiAlert from '@material-ui/lab/Alert';
import daily_reportService from "../services/daily_report.service";
import { formatdate } from "../helpers/DateCustom";
import TokenService from "../services/token.service";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ClearIcon from '@material-ui/icons/Clear';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10)
    },
    table: {
        marginTop: theme.spacing(2)
    },
    title: {
        marginBottom: theme.spacing(2)
    },
    fab: {
        position: "fixed",
        bottom: 20,
        right: 20
    },
}));


const DailyReport = () => {
    const { user } = useContext(UserContext);
    const classes = useStyles();
    const [currentItem, setCurrentItem] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [open, setOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");


    //const [person, setPerson] = useState([]);
    const navigate = useNavigate();

    const value = useMemo(() => ({ currentItem, setCurrentItem }), [currentItem, setCurrentItem]);

    const retrieveItem = () => {
        daily_reportService.getAllPublic().then(
            (response) => {
                console.log(response.data);
                setCurrentItem(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                /* if (error.response && error.response.status === 403) {
                    TokenService.removeUser();
                    navigate("/login", { replace: true });
                } */
                console.log(_content)
            }
        );
    };

    useEffect(() => {
        retrieveItem();
    }, []);

    const columns = [
        {
            name: "Title",
            selector: (row) => row.title,
            sortable: true,
            minWidth: "200px",
            maxWidth: "250px",
        },
        {
            name: "Description",
            selector: (row) => row.description,
            sortable: true,
            minWidth: "400px",
            maxWidth: "450px"
        },
        {
            name: "Expired Date",
            selector: (row) => formatdate(row.expired_date),
            sortable: true,
            minWidth: "100px",
            maxWidth: "120px"
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => {
                return (
                    <React.Fragment>
                        {row.status && row.status ? (
                            <span style={{ color: "green", fontWeight: "bold" }}>Release</span>
                        ) : (
                            <span style={{ color: "red", fontWeight: "bold" }}>
                                Draft
                            </span>
                        )}
                    </React.Fragment>
                );
            },
            minWidth: "100px",
            maxWidth: "120px"
        },
        {
            name: "Draft File",
            cell: (row) => {
                return (
                    <React.Fragment>
                        {row.draft_file_name ? (
                            <React.Fragment>
                                <a href={`${process.env.REACT_APP_UPLOADS}${row.draft_file_name}`} title={`Download draft file ${row.draft_file_name}`} target="_blank">
                                    <IconButton color="primary" aria-label="Edit">
                                        <CloudDownloadIcon size="small" />
                                    </IconButton>
                                </a>
                            </React.Fragment>
                        ) : (
                                <React.Fragment>
                                    <ClearIcon color="secondary" size="small" />
                                </React.Fragment>
                        )}
                    </React.Fragment>
                )
            },
            minWidth: "100px",
            maxWidth: "120px"
        },
        {
            name: "Release File",
            cell: (row) => {
                return (
                    <React.Fragment>
                        {row.release_file_name ? (
                            <React.Fragment>
                                <a href={`${process.env.REACT_APP_UPLOADS}${row.release_file_name}`} title={`Download release file ${row.release_file_name}`} target="_blank">
                                    <IconButton color="primary" aria-label="Edit">
                                        <CloudDownloadIcon size="small" />
                                    </IconButton>
                                </a>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                    <ClearIcon color="secondary" size="small" />
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )
            },
            minWidth: "100px",
            maxWidth: "120px"
        },
    ];

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const tableData = {
        columns,
        data: currentItem,
    };

    return (
        <Container className={classes.container} maxWidth="xl">
            <SparepartsContext.Provider value={value}>
                    <React.Fragment>
                        <Typography variant="h4" className={classes.title}>Quality Footprint</Typography>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" className={classes.table}>
                                    <DataTableExtensions
                                        {...tableData}
                                        export={false}
                                        print={false}
                                    >
                                        <DataTable
                                            columns={columns}
                                            data={currentItem}
                                            pagination
                                        />
                                    </DataTableExtensions>
                                </Typography>
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
            </SparepartsContext.Provider>
        </Container>
    );
};

export default DailyReport;