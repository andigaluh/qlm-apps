import { Container, makeStyles, Snackbar, Typography, IconButton, Card, CardContent, Tooltip, Fab } from "@material-ui/core";
import React, { useContext, useEffect, useState, useMemo } from "react"
import { UserContext, ToolsContext } from "../UserContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { Delete, Edit, Add as AddIcon, AccountBalanceWallet, Exposure } from "@material-ui/icons";
import "react-data-table-component-extensions/dist/index.css";
import MuiAlert from '@material-ui/lab/Alert';
import TokenService from "../services/token.service";
import { formatdate, formatdatetime } from "../helpers/DateCustom";
import outgoingService from "../services/outgoing.service";
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


const ReportOutgoing = () => {
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
        outgoingService.getAll(params).then(
            (response) => {
                //console.log(response.data[0].parts.supplier.supplier_name);
                setCurrentItem(response.data);
                //console.log(response.data);
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
            name: "Date Check",
            selector: (row) => formatdatetime(row.createdAt),
            sortable: true,
        },
        {
            name: "Model Name",
            selector: (row) => row.model_name,
            sortable: true,
        },
        {
            name: "Serial Number",
            selector: (row) => row.serial_no,
            sortable: true,
        },
        {
            name: "Lot Number",
            selector: (row) => row.lot_number,
            sortable: true,
        },
        {
            name: "Total Qty",
            selector: (row) => row.total_qty,
            sortable: true,
        },
        {
            name: "Remark",
            selector: (row) => row.note_remark,
            sortable: true,
        },
        {
            name: "User",
            selector: (row) => row.user,
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
        <Container className={classes.container} maxWidth="xl">
            <ToolsContext.Provider value={value}>
                {!user && (
                    <Navigate to="/login" replace={true} />
                )}
                {/* {((!user.roles.includes("ROLE_SUPERVISOR"))) ? (
                    <Typography>Not Allowed</Typography>
                ) : ( */}
                <React.Fragment>
                    <Typography variant="h4" className={classes.title}>Report Sample Outgoing</Typography>
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
                                urlDownload={process.env.REACT_APP_API + "outgoing/download"}
                                
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
            </ToolsContext.Provider>
        </Container>
    );
};

export default ReportOutgoing;