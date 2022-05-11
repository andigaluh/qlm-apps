import { Container, makeStyles, Snackbar, Typography, IconButton, Card, CardContent, Tooltip, Fab, Chip } from "@material-ui/core";
import React, { useContext, useEffect, useState, useMemo } from "react"
import { UserContext, InboxContext, ToolsContext } from "../UserContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { Delete, Edit, Add as AddIcon, AccountBalanceWallet, Exposure, Search } from "@material-ui/icons";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import MuiAlert from '@material-ui/lab/Alert';
import shiftService from "../services/shift.service";
import notifService from "../services/notif.service";
import TokenService from "../services/token.service";
import { formatdate } from "../helpers/DateCustom";

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


const Inbox = () => {
    const { user } = useContext(UserContext);
    const { totalNotif, setTotalNotif } = useContext(InboxContext);
    const classes = useStyles();
    const [currentItem, setCurrentItem] = useState([]);
    const [open, setOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    //const [person, setPerson] = useState([]);
    const navigate = useNavigate();

    const value = useMemo(() => ({ currentItem, setCurrentItem }), [currentItem, setCurrentItem]);

    const retrieveItem = () => {
        notifService.getAll({user_id: user.id}).then(
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
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "60px"
        },
        {
            name: "Title",
            selector: (row) => row.title,
            sortable: true,
        },
        {
            name: "isRead",
            selector: (row) => (row.is_read === false) ? (<Chip label="Unread" color="secondary" size="small" />) : (<Chip label="Read" color="primary" size="small" />),
            sortable: true,
            width:"120px"
        },
        {
            name: "Date",
            selector: (row) => formatdate(row.createdAt),
            sortable: true,
        },
        {
            name: "Action",
            width: "120px",
            cell: (row) => {
                return (
                    <React.Fragment>
                        <Link to={`/inbox/form/${row.id}`} title="Detail">
                            <IconButton color="primary" aria-label="Edit">
                                <Search size="small" />
                            </IconButton>
                        </Link>
                        <IconButton color="primary" title="Delete" aria-label="Delete" onClick={() => {
                            const r = window.confirm("Are you sure!");
                            if (r == true) {
                                notifService.remove(row.id)
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

    return (
        <Container className={classes.container}>
            <ToolsContext.Provider value={value}>
                {!user && (
                    <Navigate to="/login" replace={true} />
                )}
                
                    <React.Fragment>
                        <Typography variant="h4" className={classes.title}>Inbox</Typography>
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
               
            </ToolsContext.Provider>
        </Container>
    );
};

export default Inbox;