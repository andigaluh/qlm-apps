import { Container, makeStyles, Snackbar, Typography, IconButton, Card, CardContent, Tooltip, Fab, Divider } from "@material-ui/core";
import React, { useContext, useEffect, useState, useMemo } from "react"
import { UserContext, SparepartsContext } from "../UserContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { Delete, Edit, Add as AddIcon, AccountBalanceWallet, Exposure } from "@material-ui/icons";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import MuiAlert from '@material-ui/lab/Alert';
import partsService from "../services/parts.service";
import TokenService from "../services/token.service";
import { formatdate } from "../helpers/DateCustom";
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
        right: 20
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


const ReportSpareparts = () => {
    const { user } = useContext(UserContext);
    const classes = useStyles();
    const [currentItem, setCurrentItem] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchStartDate, setSearchStartDate] = useState("");
    const [searchEndDate, setSearchEndDate] = useState("");
    const [open, setOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    //const [person, setPerson] = useState([]);
    const navigate = useNavigate();

    const value = useMemo(() => ({ currentItem, setCurrentItem }), [currentItem, setCurrentItem]);

    const getRequestParams = (searchTitle, searchStartDate, searchEndDate) => {
        let params = {};

        if (searchTitle) {
            params["name"] = searchTitle;
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
        partsService.getAll(params).then(
            (response) => {
                //console.log(response.data);
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
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Description",
            selector: (row) => row.description,
            sortable: true,
        },
        {
            name: "Standard",
            selector: (row) => row.standard,
            sortable: true,
        },
        {
            name: "Method",
            selector: (row) => row.method,
            sortable: true,
        },
        {
            name: "Quantity",
            selector: (row) => row.qty,
            sortable: true,
        },
        {
            name: "Exp Date",
            selector: (row) => formatdate(row.expired_date),
            sortable: true,
        },
        {
            name: "Indicator Exp",
            selector: (row) => row.expired_date,
            sortable: true,
            cell: (row) => {
                let indikator = "";
                let titleIndikator = "";
                const dateNow = new Date();
                const date1 = new Date(row.createdAt);
                const date2 = new Date(row.expired_date);
                const prevDate50 = new Date(row.createdAt);
                const prevDate80 = new Date(row.createdAt);

                const diffTime = date2 - date1;
                const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
                const diffDays50 = Math.ceil(diffDays * 0.5);
                const diffDays80 = Math.ceil(diffDays * 0.8);
                const newDate50 = prevDate50.setDate(prevDate50.getDate() + diffDays50);
                const newDate80 = prevDate80.setDate(prevDate80.getDate() + diffDays80);
                if (dateNow < newDate50) {
                    indikator = "green";
                    titleIndikator = "OK";
                } else if ((dateNow >= newDate50) && (dateNow < newDate80)) {
                    indikator = "orange";
                    titleIndikator = "Warning";
                } else if (dateNow >= newDate80) {
                    indikator = "red";
                    titleIndikator = "Expired";
                } else {
                    indikator = "grey";
                    titleIndikator = "Not Applicable";
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
        /* {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => {
                return (
                    <React.Fragment>
                        {row.status && row.status ? (
                            <span style={{ color: "green", fontWeight: "bold" }}>Active</span>
                        ) : (
                            <span style={{ color: "red", fontWeight: "bold" }}>
                                Not Active
                            </span>
                        )}
                    </React.Fragment>
                );
            },
        }, */
        /* {
            name: "Action",
            cell: (row) => {
                return (
                    <React.Fragment>
                        
                        <Link to={"/spareparts-adjust/" + row.id + "/addition"} title="Stock history">
                            <IconButton color="primary" aria-label="Stock History">
                                <Exposure size="small" />
                            </IconButton>
                        </Link>
                        
                    </React.Fragment>
                );
            },
        }, */
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
            <SparepartsContext.Provider value={value}>
                {!user && (
                    <Navigate to="/login" replace={true} />
                )}
                {!user.roles.includes("ROLE_SUPERVISOR") ? (
                    <Typography>Not Allowed</Typography>
                ) : (
                    <React.Fragment>
                        <Typography variant="h4" className={classes.title}>Spareparts</Typography>
                        <Card>
                            <CardContent>
                                <FormSearch
                                    labelTitle="Spareparts name"
                                    searchTitle={searchTitle}
                                    onChangeSearchTitle={onChangeSearchTitle}
                                    labelStartDate="Exp start date"
                                    searchStartDate={searchStartDate}
                                    onChangeSearchStartDate={onChangeSearchStartDate}
                                    labelEndDate="Exp end date"
                                    searchEndDate={searchEndDate}
                                    onChangeSearchEndDate={onChangeSearchEndDate}
                                    handleSearch={handleSearch}
                                    urlDownload={process.env.REACT_APP_API + "parts/download"}
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
            </SparepartsContext.Provider>
        </Container>
    );
};

export default ReportSpareparts;