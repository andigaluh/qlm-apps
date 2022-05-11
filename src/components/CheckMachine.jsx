import React, { useState, useContext, useEffect } from "react";
import { Card, CardActionArea, CardContent, Container, makeStyles, Paper, Typography } from "@material-ui/core";
import { UserContext} from "../UserContext";
import { Navigate, Link, useNavigate } from "react-router-dom";
import wm_typeService from "../services/wm_type.service";
import { Print } from "@material-ui/icons";
import TokenService from "../services/token.service";


const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10)
    },
    wrapper:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"flex-start",
        flexWrap:"wrap"
    },
    card:{
        marginRight:theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    title: {
        marginBottom: theme.spacing(2)
    },
    link:{
        textDecoration:"none",
        color:"#555"
    },
    titleMachine:{
        display:"flex",
        alignItems:"center"
    },
    icon:{
        marginRight:theme.spacing(1)
    }
}));

const CheckMachine = () => {
    const { user } = useContext(UserContext);
    const classes = useStyles();
    const [currentItem, setCurrentItem] = useState([]);
    const navigate = useNavigate();
    const retrieveItem = () => {

        wm_typeService.getAll().then(
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

    return (
        <Container className={classes.container}>
            {!user && (
                <Navigate to="/login" replace={true} />
            )}
            {/* {!user.roles.includes("ROLE_OPERATOR") ? (
                <Typography>Not Allowed</Typography>
            ) : (  */}
                <React.Fragment>
                <Typography variant="h4" className={classes.title}>Outgoing Form</Typography>
                <Typography variant="subtitle2" className={classes.title}>Choose type</Typography>
                <div className={classes.wrapper}>
                    {currentItem && currentItem.map((value, index) => (
                    <Card className={classes.card}>
                        <CardActionArea>
                            <Link to={`/oqc/form/${value.id}`} className={classes.link}>
                            <CardContent>
                                
                                <Typography variant="h6" className={classes.titleMachine}><Print size="small" className={classes.icon}/> {value.name}</Typography>
                                {/* <Typography variant="body1">{value.name}</Typography> */}

                            </CardContent>
                            </Link>
                        </CardActionArea>
                    </Card>   
                    ))} 
                </div>
                </React.Fragment>
            {/* )} */}
        </Container>
    );
};

export default CheckMachine;