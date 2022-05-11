import { Container, makeStyles, Snackbar, Typography, IconButton, Card, CardContent  } from "@material-ui/core";
import React, { useContext, useEffect, useState, useMemo } from "react"
import { UserContext, PersonContext } from "../UserContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Userservice from "../services/users.service";
import { Delete, Edit, VpnKey } from "@material-ui/icons";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import MuiAlert from '@material-ui/lab/Alert';
import AddUser from "./AddUser";
import TokenService from "../services/token.service";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10)
    },
    table:{
        marginTop: theme.spacing(2)
    },
    title:{
        marginBottom:theme.spacing(2)
    }
}));


const Users = () => {
    const { user } = useContext(UserContext);
    const classes = useStyles();
    const [currentUsers, setCurrentUsers] = useState([]);
    const [searchTitle, setSearchTitle] = useState(""); 
    const [open, setOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    //const [person, setPerson] = useState([]);
    const navigate = useNavigate();

    const value = useMemo(() => ({ currentUsers, setCurrentUsers }), [currentUsers, setCurrentUsers]);

    const getRequestParams = (searchTitle) => {
        let params = {};

        if (searchTitle) {
            params["name"] = searchTitle;
        }

        return params;
    };

    const retrieveUsers = () => {
        const params = getRequestParams(searchTitle);

        Userservice.getAll(params).then(
            (response) => {
                //console.log(response.data);
                setCurrentUsers(response.data);
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
        retrieveUsers();
    }, []);

    const columns = [
        {
            name: "Username / NIK",
            selector: (row) => row.username,
            sortable: true,
        },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "Job Title",
            selector: (row) => row.job.name,
            sortable: true,
        },
        {
            name: "Org",
            selector: (row) => row.job.org.name,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => {
                return (
                    <React.Fragment>
                        <Link to={"/users/" + row.id}>
                            <IconButton color="primary" aria-label="Edit">
                                <Edit size="small" />
                            </IconButton>
                            
                        </Link>
                        <IconButton color="error" aria-label="Delete" onClick={() => {
                            const r = window.confirm("Are you sure!");
                            if (r == true) {
                                Userservice.remove(row.id)
                                    .then((response) => {
                                        setOpen(true);
                                        setSnackbarMsg(response.data.message);
                                        retrieveUsers();
                                    })
                                    .catch((e) => {
                                        console.log(e);
                                    });
                            }
                        }}>
                            <Delete/>
                        </IconButton>
                        
                        <Link
                            to={"/users/reset/" + row.id}
                        >
                            <IconButton color="secondary" aria-label="Reset password">
                                <VpnKey size="small" />
                            </IconButton>
                        </Link>
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
        data: currentUsers,
    };

    return (
        <Container className={classes.container}>
           <PersonContext.Provider value={value}> 
            {!user && (
                <Navigate to="/login" replace={true} />
            )}
            {!user.roles.includes("ROLE_ADMIN") ? (
                <Typography>Not Allowed</Typography>
            ) : (
                <React.Fragment>
                <Typography variant="h4" className={classes.title}>Users</Typography>
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
                                data={currentUsers}
                                pagination
                            />
                            </DataTableExtensions>
                        </Typography>
                    </CardContent>
                </Card>
                <Snackbar
                    anchorOrigin={{vertical:"bottom", horizontal: "left"}}
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
            <AddUser />
            </PersonContext.Provider>
        </Container>
    );
};

export default Users;