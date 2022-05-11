import { Button, makeStyles, TextField } from "@material-ui/core";
import { CloudDownload, Search } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
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

const FormSearchDate = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.searchContainer}>
            <TextField id="searchStartDate" label={props.labelStartDate} defaultValue={props.searchStartDate} onChange={props.onChangeSearchStartDate} type="date" InputLabelProps={{
                shrink: true,
            }} className={classes.searchItem} />
            <TextField id="searchEndDate" label={props.labelEndDate} defaultValue={props.searchEndDate} onChange={props.onChangeSearchEndDate} type="date" InputLabelProps={{
                shrink: true,
            }} className={classes.searchItem} />
            <Button variant="contained" color="primary" onClick={props.handleSearch} className={classes.searchItem} >
                <Search />
            </Button>
            <a href={props.urlDownload} target="_blank" className={classes.link}>
                <Button variant="contained" color="default" >
                    <CloudDownload />
                </Button>
            </a>
        </div>
    );
};

export default FormSearchDate;