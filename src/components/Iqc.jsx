import { Container, makeStyles, Snackbar, Typography, IconButton, Card, CardContent, Tooltip, Fab } from "@material-ui/core";
import React, { useContext, useEffect, useState, useMemo } from "react"
import { UserContext, ToolsContext } from "../UserContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { Delete, Edit, Add as AddIcon, AccountBalanceWallet, Exposure } from "@material-ui/icons";
import "react-data-table-component-extensions/dist/index.css";
import MuiAlert from '@material-ui/lab/Alert';
import TokenService from "../services/token.service";
import { formatdate } from "../helpers/DateCustom";
import iqcService from "../services/iqc.service";
import FormSearchDate from "./FormSearchDate";

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


const Iqc = () => {
    const { user } = useContext(UserContext);
    const classes = useStyles();
    const [currentItem, setCurrentItem] = useState([]);
    const [searchStartDate, setSearchStartDate] = useState("");
    const [searchEndDate, setSearchEndDate] = useState("");
    const [open, setOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    //const [person, setPerson] = useState([]);
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
        iqcService.getAll(params).then(
            (response) => {
                //console.log(response.data[0].parts.supplier.supplier_name);
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
            name: "Date",
            selector: (row) => formatdate(row.iqc_date),
            sortable: true,
        },
        {
            name: "Parts code",
            selector: (row) => row.parts.parts_code,
            sortable: true,
        },
        {
            name: "Parts name",
            selector: (row) => row.parts.parts_name,
            sortable: true,
        },
        {
            name: "Supplier name",
            selector: (row) => row.parts.supplier.supplier_name,
            sortable: true,
        }, 
        {
            name: "Incoming Qty",
            selector: (row) => row.incoming_qty,
            sortable: true,
        },
        {
            name: "Sampling Qty",
            selector: (row) => row.sampling_qty,
            sortable: true,
        },
        {
            name: "NG Qty",
            selector: (row) => row.ng_qty,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
        },
        {
            name: "Inspector",
            selector: (row) => row.user.name,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => {
                return (
                    <React.Fragment>
                        <Link to={`/iqc/form/${row.id}`} title="Detail">
                            <IconButton color="primary" aria-label="Edit">
                                <Edit size="small" />
                            </IconButton>
                        </Link>
                        <IconButton color="primary" title="Delete" aria-label="Delete" onClick={() => {
                            const r = window.confirm("Are you sure!");
                            if (r == true) {
                                iqcService.remove(row.id)
                                    .then((response) => {
                                        setOpen(true);
                                        setSnackbarMsg(response.data.message);
                                        retrieveItem();
                                    })
                                    .catch((e) => {
                                        console.log(e);
                                    });
                            }
                        }}>
                            <Delete />
                        </IconButton>
                    </React.Fragment>
                );
            },
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
                {/* {((!user.roles.includes("ROLE_SUPERVISOR"))) ? (
                    <Typography>Not Allowed</Typography>
                ) : ( */}
                    <React.Fragment>
                        <Typography variant="h4" className={classes.title}>Incoming QC</Typography>
                        <Card>
                            <CardContent>
                                <FormSearchDate
                                    labelStartDate="start date"
                                    searchStartDate={searchStartDate}
                                    onChangeSearchStartDate={onChangeSearchStartDate}
                                    labelEndDate="end date"
                                    searchEndDate={searchEndDate}
                                    onChangeSearchEndDate={onChangeSearchEndDate}
                                    handleSearch={handleSearch}
                                    urlDownload={process.env.REACT_APP_API + "iqc/download"}
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
                {/* )} */}
                <Link to={"/iqc/form"}>
                    <Tooltip title="Add" aria-label="add" >
                        <Fab color="primary" className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </Link>
            </ToolsContext.Provider>
        </Container>
    );
};

export default Iqc;