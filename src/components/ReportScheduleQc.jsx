import { Container, makeStyles, Snackbar, Typography, IconButton, Card, CardContent, Tooltip, Fab, Chip, Modal, Button } from "@material-ui/core";
import React, { useContext, useEffect, useState, useMemo } from "react"
import { UserContext, ToolsContext } from "../UserContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { Delete, Edit, Add as AddIcon, Done } from "@material-ui/icons";
import "react-data-table-component-extensions/dist/index.css";
import MuiAlert from '@material-ui/lab/Alert';
import TokenService from "../services/token.service";
import schedule_qcService from "../services/schedule_qc.service";
import { formatdate } from "../helpers/DateCustom";
import FormSearchDate from "./FormSearchDate";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
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
    paper: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    photo: {
        maxWidth: '350px'
    }
}));


const ReportScheduleQc = () => {
    const { user } = useContext(UserContext);
    const classes = useStyles();
    const [currentItem, setCurrentItem] = useState([]);
    const [open, setOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const navigate = useNavigate();
    const [modalStyle] = useState(getModalStyle);
    const [openModal, setOpenModal] = useState(false);
    const [searchStartDate, setSearchStartDate] = useState("");
    const [searchEndDate, setSearchEndDate] = useState("");
    const [itemSelected, setItemSelected] = useState("");

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
        schedule_qcService.getAll(params).then(
            (response) => {
                console.log(response.data);
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
            selector: (row) => row.plan_date,
            sortable: true,
            cell: (row) => {
                let indikator = "";
                let titleIndikator = "";
                const dateNow = new Date();
                const date1 = new Date(row.createdAt);
                const date2 = new Date(row.plan_date);
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
            width: "10%"
        },
        {
            name: "Supplier",
            selector: (row) => row.supplier,
            sortable: true,
        },
        {
            name: "Parts",
            selector: (row) => row.parts,
            sortable: true,
        },
        {
            name: "Objective",
            selector: (row) => row.objective,
            sortable: true,
        },
        /* {
            name: "Activity",
            selector: (row) => row.activity,
            sortable: true,
        }, */
        {
            name: "Plan Date",
            selector: (row) => formatdate(row.plan_date),
            sortable: true,
        },
        {
            name: "Execution Date",
            selector: (row) => formatdate(row.photo_date),
            sortable: true,
            cell: (row) => {
                let status = false;
                if (row.photo_date) {
                    status = true;
                }
                return (
                    <React.Fragment>
                        {status ? (
                            <Chip
                                label={formatdate(row.photo_date)}
                                color="primary"
                                clickable
                                deleteIcon={<Done />}
                                className={classes.statusOK}
                            />
                        ) : (
                            <Chip
                                label="Not Applicable"
                                color="primary"
                                clickable
                                deleteIcon={<Done />}
                                className={classes.statusNG}
                            />
                        )}
                    </React.Fragment>
                );
            },
        },
        {
            name: "PIC",
            selector: (row) => row.user,
            sortable: true,
        },
        {
            name: "Photo",
            selector: (row) => row.photo_name,
            sortable: true,
            width: "10%",
            cell: (row) => {

                return (
                    <React.Fragment>
                        <Button size="small" variant="contained" color="primary" type="button" onClick={() => handleOpenModal(row.photo_name)}>
                            View
                        </Button>
                        <Modal
                            open={openModal}
                            onClose={handleCloseModal}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            id={row.id}
                        >
                            <div style={modalStyle} className={classes.paper}>
                                <h2 id="simple-modal-title">Photo Schedule</h2>
                                <p id="simple-modal-description">
                                    {itemSelected && (
                                        <img src={itemSelected} className={classes.photo} />
                                    )}

                                </p>
                            </div>
                        </Modal>
                    </React.Fragment>
                )
            }
        },
        /* {
            name: "Action",
            cell: (row) => {
                return (
                    <React.Fragment>
                        <Link to={`/schedule-qc/form/${row.id}`} title="Detail">
                            <IconButton color="primary" aria-label="Edit">
                                <Edit size="small" />
                            </IconButton>
                        </Link>
                        <IconButton color="primary" title="Delete" aria-label="Delete" onClick={() => {
                            const r = window.confirm("Are you sure!");
                            if (r == true) {
                                schedule_qcService.remove(row.id)
                                    .then((response) => {
                                        retrieveItem();
                                        setOpen(true);
                                        setSnackbarMsg(response.data.message);

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
        }, */
    ];

    const handleOpenModal = (item) => {
        setItemSelected(item);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setItemSelected();
        setOpenModal(false);
    };

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

    /* const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">Text in a modal</h2>
            <p id="simple-modal-description">
                <img src={process.env.REACT_APP_UPLOADS + row.photo_name} alt={row.photo_name} />
            </p>
        </div>
    ); */

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
                    <Typography variant="h4" className={classes.title}>Schedule Maintenance</Typography>
                    <Card>
                        <CardContent>
                            <FormSearchDate
                                labelStartDate="plan start date"
                                searchStartDate={searchStartDate}
                                onChangeSearchStartDate={onChangeSearchStartDate}
                                labelEndDate="plan end date"
                                searchEndDate={searchEndDate}
                                onChangeSearchEndDate={onChangeSearchEndDate}
                                handleSearch={handleSearch}
                                urlDownload={process.env.REACT_APP_API + "schedule_qc/download"}
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
                <Link to={"/schedule-qc/form"}>
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

export default ReportScheduleQc;