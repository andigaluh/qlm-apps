import { Container, makeStyles, Snackbar, Typography, IconButton, Card, CardContent, Tooltip, Fab } from "@material-ui/core";
import React, { useContext, useEffect, useState, useMemo } from "react"
import { UserContext, ToolsContext } from "../UserContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { Delete, Edit, Add as AddIcon, AccountBalanceWallet, Exposure } from "@material-ui/icons";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import MuiAlert from '@material-ui/lab/Alert';
import partsService from "../services/parts.service";
import toolsService from "../services/tools.service";
import TokenService from "../services/token.service";

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


const ReportTools = () => {
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
        toolsService.getAll().then(
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
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: "Tools Type",
            selector: (row) => row.tools_type.name,
            sortable: true,
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Qty",
            selector: (row) => row.qty,
            sortable: true,
        },
        {
            name: "Indikator Qty",
            cell: (row) => {
                let indikator = "";
                let titleIndikator = "";
                if (row.qty <= 5) {
                    indikator = "red";
                    titleIndikator = "Danger";
                } else {
                    indikator = "green";
                    titleIndikator = "OK";
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
            name: "Action",
            cell: (row) => {
                return (
                    <React.Fragment>
                        
                        <Link to={`/tools-adjust/${row.id}/list`} title="Stock history">
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

    return (
        <Container className={classes.container}>
            <ToolsContext.Provider value={value}>
                {!user && (
                    <Navigate to="/login" replace={true} />
                )}
                {/* {( (!user.roles.includes("ROLE_SUPERVISOR")) ) ? (
                    <Typography>Not Allowed</Typography>
                ) : ( */}
                    <React.Fragment>
                        <Typography variant="h4" className={classes.title}>Tools</Typography>
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
                {/* )} */}
            </ToolsContext.Provider>
        </Container>
    );
};

export default ReportTools;