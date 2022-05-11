import React, { useState, useEffect} from "react";
import { Card, CardContent, Container, makeStyles, Snackbar, Typography } from "@material-ui/core";
import { Outlet, Navigate, useParams, Link } from "react-router-dom";
import machine_check_need_partsService from "../services/machine_check_need_parts.service";
import MuiAlert from '@material-ui/lab/Alert';
import { formatdate } from "../helpers/DateCustom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(2)
    }
}));

const SparepartsAdjustSubs = () => {
    const params = useParams();
    const sparepartsId = params.id;
    const classes = useStyles();
    const [currentList, setCurrentList] = useState([]);
    const [open, setOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const retriveList = (id) => {
        machine_check_need_partsService.getAllByParts(id).then(
            (response) => {
                setCurrentList(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setCurrentList(_content);
                console.log(`error: ${_content}`);
            }
        );
    };

    const columns = [
        {
            name: "Machine Check Id",
            selector: (row) => row.machine_check_id,
            sortable: true,
        },
        {
            name: "Type",
            selector: (row) => row.type,
            sortable: true,
        },
        {
            name: "Qty",
            selector: (row) => row.qty,
            sortable: true,
        },
        {
            name: "Date",
            selector: (row) => formatdate(row.createdAt),
            sortable: true,
        },
    ];
    const tableData = {
        columns,
        data: currentList,
    };

    useEffect(() => {
        retriveList(sparepartsId);
    }, [sparepartsId]);

    return (
        <React.Fragment>
            <Card>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>Stock Substraction History</Typography>
                    <Typography variant="h6" className={classes.table}>
                        <DataTableExtensions
                            {...tableData}
                            export={false}
                            print={false}
                        >
                            <DataTable
                                columns={columns}
                                data={currentList}
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
    );
};

export default SparepartsAdjustSubs;