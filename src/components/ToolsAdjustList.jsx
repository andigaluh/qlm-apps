import { Button, Card, CardContent, Fab, makeStyles, Snackbar, TextField, Tooltip, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "react-data-table-component-extensions/dist/index.css";
import { useParams, Link } from "react-router-dom";
import tools_adjustment_itemService from "../services/tools_adjustment_item.service";
import MuiAlert from '@material-ui/lab/Alert';
import { formatdate } from "../helpers/DateCustom";
import { Add as AddIcon, CloudDownload, Search } from "@material-ui/icons";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(2)
    },
    title: {
        marginBottom: theme.spacing(2)
    },
    wrapper: {
        marginTop: theme.spacing(2)
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

const ToolsAdjustList = () => {
    const params = useParams();
    const sparepartsId = params.id;
    const classes = useStyles();
    const [currentList, setCurrentList] = useState([]);
    const [open, setOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [searchStartDate, setSearchStartDate] = useState("");
    const [searchEndDate, setSearchEndDate] = useState("");

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

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

    const retriveList = (id) => {
        const params = getRequestParams(searchStartDate, searchEndDate);
        tools_adjustment_itemService.getByToolsId(id, params).then(
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
            name: "Type",
            selector: (row) => row.type,
            sortable: true,
        },
        {
            name: "Qty",
            selector: (row) => row.qty,
            sortable: true,
            cell: (row) => {
                return (
                    <React.Fragment>
                        {row.type && (row.type === "addition") ? (
                            <Typography variant="body1">
                                +{row.qty}
                            </Typography>
                        ) : (
                                <Typography variant="body1">
                                    -{row.qty}
                                </Typography>
                        )}
                    </React.Fragment>
                );
            },
        },{
            name: "PIC",
            selector: (row) => row.user.name,
            sortable: true,
        },
        {
            name: "Date",
            selector: (row) => formatdate(row.createdAt),
            sortable: true,
        }
    ];

    const tableData = {
        columns,
        data: currentList,
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
        retriveList(sparepartsId);
    }

    useEffect(() => {
        retriveList(sparepartsId);
    }, [sparepartsId]);

    return (
        <React.Fragment>
            <div className={classes.wrapper}>
            <Card>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>Stock History</Typography>
                        <div className={classes.searchContainer}>
                            <TextField id="searchStartDate" label="Start date" defaultValue={searchStartDate} onChange={onChangeSearchStartDate} type="date" InputLabelProps={{
                                shrink: true,
                            }} className={classes.searchItem} />
                            <TextField id="searchEndDate" label="End date" defaultValue={searchEndDate} onChange={onChangeSearchEndDate} type="date" InputLabelProps={{
                                shrink: true,
                            }} className={classes.searchItem} />
                            <Button variant="contained" color="primary" onClick={handleSearch} className={classes.searchItem} >
                                <Search />
                            </Button>
                            <a href={process.env.REACT_APP_API + "tools_adjustment_item/download/" + sparepartsId} target="_blank" className={classes.link}>
                                <Button variant="contained" color="default" >
                                    <CloudDownload />
                                </Button>
                            </a>
                        </div>
                    <Typography variant="h6" className={classes.table}>
                        
                            <DataTable
                                columns={columns}
                                data={currentList}
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
        </div>
        </React.Fragment>
    );
};

export default ToolsAdjustList;