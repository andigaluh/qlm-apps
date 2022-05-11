import { Container, makeStyles, Snackbar, Typography, IconButton, Card, CardContent, Tooltip, Fab } from "@material-ui/core";
import React, { useContext, useEffect, useState, useMemo } from "react"
import { UserContext, SparepartsContext } from "../UserContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { Delete, Edit, Add as AddIcon, AccountBalanceWallet, Exposure, GetApp } from "@material-ui/icons";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import MuiAlert from '@material-ui/lab/Alert';
import doc_inspectionService from "../services/doc_inspection.service";
import { formatdate } from "../helpers/DateCustom";
import TokenService from "../services/token.service";
import parts_excelService from "../services/parts_excel.service";

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


const SparepartsExcel = () => {
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
        parts_excelService.getAll().then(
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
            name: "Filename",
            selector: (row) => row.file_name,
            sortable: true,
        },
        {
            name: "User",
            selector: (row) => row.user.name,
            sortable: true,
        },
        {
            name: "Created at",
            selector: (row) => formatdate(row.createdAt),
            sortable: true
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
                        <Typography variant="h4" className={classes.title}>Document Upload Spareparts</Typography>
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
                <Link to={"/spareparts/upload-excel"}>
                    <Tooltip title="Add" aria-label="add" >
                        <Fab color="primary" className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                </Link>
            </SparepartsContext.Provider>
        </Container>
    );
};

export default SparepartsExcel;