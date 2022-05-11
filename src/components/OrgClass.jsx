import { makeStyles, Snackbar, Typography, IconButton, Card, CardContent, Tooltip, Fab} from "@material-ui/core";
import React, { useContext, useEffect, useState, useMemo } from "react"
import { UserContext, ToolsContext } from "../UserContext";
import { Navigate, Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { Delete, Edit, Add as AddIcon } from "@material-ui/icons";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import MuiAlert from '@material-ui/lab/Alert';
import org_classService from "../services/org_class.service";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    wrapper: {
        marginTop: theme.spacing(2)
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
    link: {
        textDecoration: "none"
    },
    btnOrg: {
        backgroundColor: theme.palette.primary.main,
        color: "white",
        marginRight: theme.spacing(2)
    }
}));


const OrgClass = () => {
    const { user } = useContext(UserContext);
    const classes = useStyles();
    const [currentItem, setCurrentItem] = useState([]);
    const [open, setOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    const value = useMemo(() => ({ currentItem, setCurrentItem }), [currentItem, setCurrentItem]);

    const retrieveItem = () => {
        org_classService.getAll().then(
            (response) => {
                setCurrentItem(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setCurrentItem(_content);
                console.log(`no user ${_content}`);
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
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => {
                return (
                    <React.Fragment>
                        <Link to={`/organization/class/form/${row.id}`} title="Detail">
                            <IconButton color="primary" aria-label="Edit">
                                <Edit size="small" />
                            </IconButton>
                        </Link>
                        <IconButton color="primary" title="Delete" aria-label="Delete" onClick={() => {
                            const r = window.confirm("Are you sure!");
                            if (r == true) {
                                org_classService.remove(row.id)
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
        <div className={classes.wrapper}>
            <ToolsContext.Provider value={value}>
                {!user && (
                    <Navigate to="/login" replace={true} />
                )}
                {!user.roles.includes("ROLE_ADMIN") ? (
                    <Typography>Not Allowed</Typography>
                ) : (
                    <React.Fragment>
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
                )}
                <Link to={"/organization/class/form"}>
                    <Tooltip title="Add" aria-label="add" >
                        <Fab color="primary" className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </Link>
            </ToolsContext.Provider>
        </div>
    );
};

export default OrgClass;