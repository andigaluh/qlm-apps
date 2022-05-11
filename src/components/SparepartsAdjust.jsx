import React, { useContext, useState, useEffect, useMemo } from "react"
import { Button, Card, CardContent, Container, Divider, Fab, Grid, makeStyles, TextField, Tooltip, Typography } from "@material-ui/core";
import { UserContext } from "../UserContext";
import { Outlet, Navigate, useParams, Link } from "react-router-dom";
import { ArrowBack, Add as AddIcon } from "@material-ui/icons";
import partsService from "../services/parts.service";
import { SparepartsContext } from "../UserContext";


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
        flexDirection:"column",
        alignItems:"stretch",
        alignContent:"space-between",
        '& .MuiTextField-root:nth-child(odd)' : {
            marginBottom: theme.spacing(3),
            marginTop:theme.spacing(3)
        }    
    },
    subtitle: {
        marginBottom: theme.spacing(2)
    },
    buttonWrapper: {
        display: "flex",
        justifyContent:"center",
        alignItems:"center",
        marginTop:theme.spacing(2),
        marginBottom: theme.spacing(2),
        '& .MuiButtonBase-root:nth-child(odd)' : {
            marginRight:theme.spacing(2)
        },
        '& a': {
            textDecoration:"none"
        }
    },
    fabAdd:{
        position: "fixed",
        bottom: 20,
        right: 20
    }
}));

const SparepartsAdjust = () => {
    const params = useParams();
    const sparepartsId = params.id;
    const { user } = useContext(UserContext);
    const classes = useStyles();
    const [currentParts, setCurrentParts] = useState({});
    
    const value = useMemo(() => ({ currentParts, setCurrentParts }), [currentParts, setCurrentParts]);

    const retrieveParts = (id) => {
        partsService.get(id).then(
            (response) => {
                setCurrentParts(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setCurrentParts(_content);
                console.log(_content);
            }
        );
    }

    useEffect(() => {
        retrieveParts(sparepartsId)
    }, [sparepartsId]);

    return (
        <SparepartsContext.Provider value={value}>
        <Container className={classes.container}>
            {!user && (
                <Navigate to="/login" replace={true} />
            )}
                {!user.roles.includes("ROLE_SUPERVISOR") ? (
                <Typography>Not Allowed</Typography>
            ) : (
                <React.Fragment>
                    <div className={classes.titleContainer}>
                        <Link to={"/spareparts"}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <ArrowBack />
                            </Fab>
                        </Link>
                        <Typography variant="h4" className={classes.title}>Spareparts Adjustment</Typography>
                    </div>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" className={classes.subtitle}>Spareparts Detail</Typography>
                                <Divider/>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4} className={classes.gridContainer} >
                                        
                                        <TextField
                                            id="standard-read-only-input"
                                            label="Spareparts name"
                                            value={currentParts.name}
                                            defaultValue="spareparts item"
                                            InputProps={{
                                                readOnly: true,
                                            }} 
                                            
                                        />
                                        <TextField
                                            id="standard-read-only-input"
                                            label="Description"
                                            value={currentParts.description}
                                            defaultValue="spareparts item"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4} className={classes.gridContainer}>
                                        <TextField
                                            id="standard-read-only-input"
                                            label="Standard"
                                            value={currentParts.standard}
                                            defaultValue="spareparts item"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        <TextField
                                            id="standard-read-only-input"
                                            label="Method"
                                            value={currentParts.method}
                                            defaultValue="spareparts item"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4} className={classes.gridContainer}>
                                        <TextField
                                            id="standard-read-only-input"
                                            label="Qty"
                                            value={currentParts.qty}
                                            defaultValue="spareparts item"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        <TextField
                                            id="standard-read-only-input"
                                            label="Status"
                                            value={(currentParts.status === true) ? "Active" : "Not Active"}
                                            defaultValue="spareparts item"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        
                        <div className={classes.buttonWrapper}>
                            <Link to={`/spareparts-adjust/${sparepartsId}/addition`}>
                                <Button variant="outlined" color="primary">
                                    Addition
                                </Button>
                            </Link>
                            <Link to={`/spareparts-adjust/${sparepartsId}/substraction`}>
                                <Button variant="outlined" color="secondary">
                                    Substraction
                                </Button>
                            </Link>
                        </div>
                            
                    <Outlet/>
                        <Link to={`/spareparts-adjust/${sparepartsId}/form`}>
                            <Tooltip title="Add stock" aria-label="add" >
                                <Fab color="primary" className={classes.fabAdd}>
                                    <AddIcon />
                                </Fab>
                            </Tooltip>
                        </Link>
                </React.Fragment>
            )}
        </Container>
        </SparepartsContext.Provider>
    );
};

export default SparepartsAdjust;