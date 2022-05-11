import React, { useContext, useState, useEffect, useMemo } from "react"
import { Button, Card, CardContent, Container, Divider, Fab, Grid, makeStyles, TextField, Tooltip, Typography } from "@material-ui/core";
import { UserContext } from "../UserContext";
import { Outlet, Navigate, useParams, Link } from "react-router-dom";
import { ArrowBack, Add as AddIcon } from "@material-ui/icons";
import { ToolsContext } from "../UserContext";
import toolsService from "../services/tools.service";


const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10)
    },
    titleContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(2)
    },
    fab: {
        marginRight: theme.spacing(2),
    },
    gridContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        alignContent: "space-between",
        '& .MuiTextField-root:nth-child(odd)': {
            marginBottom: theme.spacing(3),
            marginTop: theme.spacing(3)
        }
    },
    subtitle: {
        marginBottom: theme.spacing(2)
    },
    buttonWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        '& .MuiButtonBase-root:nth-child(odd)': {
            marginRight: theme.spacing(2)
        },
        '& a': {
            textDecoration: "none"
        }
    },
    fabAdd: {
        position: "fixed",
        bottom: 20,
        right: 20
    }
}));

const ToolsAdjust = () => {
    const params = useParams();
    const toolsId = params.id;
    const { user } = useContext(UserContext);
    const classes = useStyles();
    const [currentTools, setCurrentTools] = useState({});
    const [currentToolsType, setCurrentToolsType] = useState({});

    const value = useMemo(() => ({ currentTools, setCurrentTools }), [currentTools, setCurrentTools]);

    const retrieveTools = (id) => {
        toolsService.get(id).then(
            (response) => {
                console.log(response.data);
                setCurrentTools(response.data);
                setCurrentToolsType(response.data.tools_type);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setCurrentTools(_content);
                console.log(_content);
            }
        );
    }

    useEffect(() => {
        retrieveTools(toolsId)
    }, [toolsId]);

    return (
        <ToolsContext.Provider value={value}>
            <Container className={classes.container}>
                {!user && (
                    <Navigate to="/login" replace={true} />
                )}
                {!user.roles.includes("ROLE_SUPERVISOR") ? (
                    <Typography>Not Allowed</Typography>
                ) : (
                    <React.Fragment>
                        <div className={classes.titleContainer}>
                            <Link to={"/tools"}>
                                <Fab color="primary" className={classes.fab} size="small">
                                    <ArrowBack />
                                </Fab>
                            </Link>
                            <Typography variant="h4" className={classes.title}>Tools Adjustment</Typography>
                        </div>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" className={classes.subtitle}>Tools Detail</Typography>
                                <Divider />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4} className={classes.gridContainer} >

                                        <TextField
                                            id="standard-read-only-input"
                                            label="Tools type"
                                            value={currentToolsType.name}
                                            defaultValue="tools item"
                                            InputProps={{
                                                readOnly: true,
                                            }}

                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4} className={classes.gridContainer}>
                                        <TextField
                                            id="standard-read-only-input"
                                            label="Tools name"
                                            value={currentTools.name}
                                            defaultValue="tools item"
                                            InputProps={{
                                                readOnly: true,
                                            }}

                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={4} className={classes.gridContainer}>
                                        <TextField
                                            id="standard-read-only-input"
                                            label="Qty"
                                            value={currentTools.qty}
                                            defaultValue="tools item"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Outlet />
                        <Link to={`/tools-adjust/${toolsId}/form`}>
                            <Tooltip title="Adjust stock" aria-label="add" >
                                <Fab color="primary" className={classes.fabAdd}>
                                    <AddIcon />
                                </Fab>
                            </Tooltip>
                        </Link>
                    </React.Fragment>
                )}
            </Container>
        </ToolsContext.Provider>
    );
};

export default ToolsAdjust;