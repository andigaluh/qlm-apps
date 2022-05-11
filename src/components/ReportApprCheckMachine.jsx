import { Container, makeStyles, Snackbar, Typography, IconButton, Card, CardContent, Tooltip, Fab, Chip, Avatar, Grid, TextField, Button } from "@material-ui/core";
import React, { useContext, useEffect, useState, useMemo } from "react"
import { UserContext, SparepartsContext } from "../UserContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { Delete, Edit, Add as AddIcon, AccountBalanceWallet, Exposure, Done, CloudDownload, Search } from "@material-ui/icons";
import "react-data-table-component-extensions/dist/index.css";
import MuiAlert from '@material-ui/lab/Alert';
import report_machine_checkService from "../services/report_wm_check.service";
import { formatdate } from "../helpers/DateCustom";
import TokenService from "../services/token.service";
import FormSearch from "./FormSearch";

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
        right: 20,
        backgroundColor: theme.palette.success.main,
    },
    statusNG: {
        backgroundColor: theme.palette.error.main,
    },
    statusOK: {
        backgroundColor: theme.palette.success.main,
    },
    link: {
        textDecoration: "none",
    },
    searchContainer: {
        paddingBottom: theme.spacing(2),
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    searchItem: {
        marginRight: theme.spacing(2),
    }
}));


const ReportApprCheckMachine = () => {
    const { user } = useContext(UserContext);
    const classes = useStyles();
    const [currentItem, setCurrentItem] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchStartDate, setSearchStartDate] = useState("");
    const [searchEndDate, setSearchEndDate] = useState("");
    const [open, setOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const navigate = useNavigate();

    const value = useMemo(() => ({ currentItem, setCurrentItem }), [currentItem, setCurrentItem]);

    const getRequestParams = (searchTitle, searchStartDate, searchEndDate) => {
        let params = {};

        if (searchTitle) {
            params["title"] = searchTitle;
        }

        if (searchStartDate) {
            params["start_date"] = searchStartDate;
        }

        if (searchEndDate) {
            params["end_date"] = searchEndDate;
        }

        return params;
    };

    const retrieveItem = () => {
        const params = getRequestParams(searchTitle, searchStartDate, searchEndDate);
        report_machine_checkService.getAll(params).then(
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

                if (error.response && error.response.status === 403) {
                    TokenService.removeUser();
                    navigate("/login", { replace: true });
                }
                console.log(_content)
            }
        );
    };

    useEffect(() => {
        retrieveItem();
    }, []);

    const columns = [
        {
            name: "Status",
            sortable: true,
            cell: (row) => {
                return (
                    <React.Fragment>
                        {!row.status ? (
                            <Chip
                                label="NG"
                                color="secondary"
                                deleteIcon={<Done />}
                                className={classes.statusNG}
                            />
                        ) : (
                            <Chip
                                label="OK"
                                color="primary"
                                deleteIcon={<Done />}
                                className={classes.statusOK}
                            />
                        )}
                    </React.Fragment>
                );
            },
        },
        {
            name: "Supervisor Approval",
            selector: (row) => row.supervisor_approval,
            sortable: true,
            cell: (row) => {
                return (
                    <React.Fragment>
                        {row.supervisor_approval && row.supervisor_approval === true ? (
                            
                                <Chip
                                    label="Approved"
                                    color="primary"
                                    deleteIcon={<Done />}
                                    className={classes.statusOK}
                                />
                            
                        ) : (
                            
                                <Chip
                                    label="Not Approved"
                                    color="primary"
                                    deleteIcon={<Done />}
                                    className={classes.statusNG}
                                />
                            
                        )}
                    </React.Fragment>
                );
            },
        },
        {
            name: "Inspection Date",
            selector: (row) => formatdate(row.inspection_date),
            sortable: true,
        },
        {
            name: "Inspection Time",
            selector: (row) => row.time,
            sortable: true,
        },
        {
            name: "Machine Code",
            selector: (row) => row.machine_code,
            sortable: true,
        },
        {
            name: "Machine Name",
            selector: (row) => row.machine_name,
            sortable: true,
        },
        {
            name: "Shift Name",
            selector: (row) => row.shift_name,
            sortable: true,
        },
        {
            name: "Inspector Name",
            selector: (row) => row.inspection_name,
            sortable: true,
        },
        {
            name: "Supervisor Name",
            selector: (row) => row.supervisor_name,
            sortable: true,
        },
        {
            name: "Total Spareparts",
            selector: (row) => row.total_parts,
            sortable: true,
        },
        {
            name: "Total Need Parts",
            selector: (row) => row.jumlah_need_parts,
            sortable: true,
        },
        {
            name: "Total Problems",
            selector: (row) => row.jumlah_problems,
            sortable: true,
            cell: (row) => {
                var isProblems = false;
                if (row.jumlah_problems > 0) {
                    isProblems = true;
                }
                return (
                    <React.Fragment>
                        {isProblems && isProblems ? (
                            <span style={{ color: "red", fontWeight: "bold" }}>
                                {row.jumlah_problems}
                            </span>
                        ) : (
                            <span style={{ color: "green" }}>{row.jumlah_problems}</span>
                        )}
                    </React.Fragment>
                );
            },
        }
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

    const onChangeSearchTitle = (e) => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    }

    const onChangeSearchStartDate = (e) => {
        const searchStartDate = e.target.value;

        setSearchStartDate(searchStartDate);
    }

    const onChangeSearchEndDate = (e) => {
        const searchEndDate = e.target.value;
        setSearchEndDate(searchEndDate);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        retrieveItem()
    }

    return (
        <Container className={classes.container}>
            {!user && (
                <Navigate to="/login" replace={true} />
            )}
            {!user.roles.includes("ROLE_SUPERVISOR") ? (
                <Typography>Not Allowed</Typography>
            ) : (
                <React.Fragment>
                    <Typography variant="h4" className={classes.title}>Approval Check Machine</Typography>
                    <Card>
                        <CardContent>
                            <FormSearch
                                labelTitle="Machine name"
                                searchTitle={searchTitle}
                                onChangeSearchTitle={onChangeSearchTitle}
                                labelStartDate="start date"
                                searchStartDate={searchStartDate}
                                onChangeSearchStartDate={onChangeSearchStartDate}
                                labelEndDate="end date"
                                searchEndDate={searchEndDate}
                                onChangeSearchEndDate={onChangeSearchEndDate}
                                handleSearch={handleSearch}
                                urlDownload={process.env.REACT_APP_API + "report-machine-check/download"}
                            />
                            {/* <div className={classes.searchContainer}>
                                    <TextField id="searchMachineName" label="Machine name" defaultValue={searchTitle} onChange={onChangeSearchTitle} InputLabelProps={{
                                        shrink: true,
                                    }} className={classes.searchItem} />
                                    <TextField id="searchStartDate" label="Start date" defaultValue={searchStartDate} onChange={onChangeSearchStartDate} type="date" InputLabelProps={{
                                        shrink: true,
                                    }} className={classes.searchItem} />
                                    <TextField id="searchEndDate" label="End date" defaultValue={searchEndDate} onChange={onChangeSearchEndDate} type="date" InputLabelProps={{
                                        shrink: true,
                                    }} className={classes.searchItem} />
                                    <Button variant="contained" color="primary" onClick={handleSearch} className={classes.searchItem} >
                                        <Search/>
                                    </Button>
                                    <a href={process.env.REACT_APP_API + "report-machine-check/download"} target="_blank" className={classes.link}>
                                        <Button variant="contained" color="default" >
                                            <CloudDownload />
                                        </Button>
                                    </a>
                                </div> */}
                            <Typography variant="body2" className={classes.table}>
                                <DataTable
                                    columns={columns}
                                    data={currentItem}
                                    pagination
                                />
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
            )}

        </Container>
    );
};

export default ReportApprCheckMachine;