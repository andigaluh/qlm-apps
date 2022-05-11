import { Container, makeStyles, Snackbar, Typography, IconButton, Card, CardContent, Tooltip, Fab, Chip } from "@material-ui/core";
import React, { useContext, useEffect, useState, useMemo } from "react"
import { UserContext, ToolsContext } from "../UserContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { Delete, Edit, Add as AddIcon } from "@material-ui/icons";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import MuiAlert from '@material-ui/lab/Alert';
import TokenService from "../services/token.service";
import { formatdatetime } from "../helpers/DateCustom";
import problem_machineService from "../services/problem_machine.service";
import FormSearchDateTime from "./FormSearchDateTime";

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


const ReportProblemMachine = () => {
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

    const getRequestParams = (searchStartDate, searchEndDate) => {
        let params = {};

        if (searchStartDate) {
            params["start_date"] = searchStartDate;
        }

        if (searchEndDate) {
            params["end_date"] = searchEndDate;
        }

        return params;
    };

    const retrieveItem = () => {
        const params = getRequestParams(searchStartDate, searchEndDate);
        problem_machineService.getAll(params).then(
            (response) => {
                setCurrentItem(response.data)
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
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "7%"
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
            width: "10%",
            cell: (row) => {
                let indikator = "";
                let titleIndikator = "";
                if (row.status === 1) {
                    indikator = "green";
                    titleIndikator = "OK";
                } else if (row.status === 2) {
                    indikator = "orange";
                    titleIndikator = "Pending";
                } else {
                    indikator = "red";
                    titleIndikator = "NG";
                }
                return (
                    <React.Fragment>
                        <Tooltip title={titleIndikator} aria-label={titleIndikator}>
                            <Fab size="small" style={{ backgroundColor: `${indikator}` }}>

                            </Fab>
                        </Tooltip>
                    </React.Fragment>
                )
            },
        },
        {
            name: "Machine",
            selector: (row) => row.machine,
            sortable: true,
        },
        {
            name: "Problem",
            selector: (row) => row.problem,
            sortable: true,
        },
        /* {
            name: "Counter Measure",
            selector: (row) => row.counter_measure,
            sortable: true,
        }, */
        {
            name: "PIC",
            selector: (row) => row.user,
            sortable: true,
        },
        {
            name: "Start Problem (WIB)",
            selector: (row) => formatdatetime(row.start_problem),
            sortable: true,
        },
        {
            name: "End Problem (WIB)",
            selector: (row) => formatdatetime(row.end_problem),
            sortable: true,
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
            <ToolsContext.Provider value={value}>
                {!user && (
                    <Navigate to="/login" replace={true} />
                )}
                {((!user.roles.includes("ROLE_SUPERVISOR"))) ? (
                    <Typography>Not Allowed</Typography>
                ) : (
                    <React.Fragment>
                        <Typography variant="h4" className={classes.title}>Problem Machine</Typography>
                        <Card>
                            <CardContent>
                                <FormSearchDateTime
                                    labelStartDate="problem start date"
                                    searchStartDate={searchStartDate}
                                    onChangeSearchStartDate={onChangeSearchStartDate}
                                    labelEndDate="problem end date"
                                    searchEndDate={searchEndDate}
                                    onChangeSearchEndDate={onChangeSearchEndDate}
                                    handleSearch={handleSearch}
                                    urlDownload={process.env.REACT_APP_API + "problem_machine/download"}
                                />
                                <Typography variant="h6" className={classes.table}>

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
                
            </ToolsContext.Provider>
        </Container>
    );
};

export default ReportProblemMachine;