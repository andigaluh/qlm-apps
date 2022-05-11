import { Avatar, Card, CardActions, CardContent, CardHeader, Container, Grid, IconButton, makeStyles, Typography } from "@material-ui/core";
import Post from "./Post";
import React, { useContext, useState, useEffect } from "react"
import { UserContext } from "../UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import doc_inspectionService from "../services/doc_inspection.service";
import { formatdate } from "../helpers/DateCustom";
import { GetApp } from "@material-ui/icons";
import { red } from "@material-ui/core/colors";
import TokenService from "../services/token.service";

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(10)
    },
    avatar: {
        backgroundColor: red[500],
    },
    title: {
        marginBottom: theme.spacing(2)
    },
}));

const DocInstruction = () => {
    const { user, setUser } = useContext(UserContext);
    const classes = useStyles();
    const [currentItem, setCurrentItem] = useState([]);
    const navigate = useNavigate();

    const retrieveItem = () => {
        doc_inspectionService.getAll().then(
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
                    console.log(_content);
            }
        ).catch(error => {
            const _content =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
                
            if (error.response) {
                navigate("/login", { replace: true });
            }
        });
    };

    useEffect(() => {
        retrieveItem();
    }, []);

    return (
        <Container className={classes.container} maxWidth="xl">
            {!user && (
                <Navigate to="/login" replace={true} />
            )}
            <Typography variant="h4" className={classes.title}>Document Instruction</Typography>
            <Grid container spacing={2}>
                {currentItem && currentItem.map((v,i) => (
                    <Grid item xs={12} sm={4} key={i}>
                        <Card>
                            <CardHeader
                                avatar={<Avatar aria-label="recipe" className={classes.avatar}>
                                    {v.title.substring(0,1).toUpperCase()}
                                </Avatar>}
                                title={v.title}
                                subheader={`Exp : ${formatdate(v.expired_date)}`}
                            />
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {v.description.substring(0, 150)} ...{" "}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <a href={`${process.env.REACT_APP_UPLOADS}${v.file_name}`} target="_blank">
                                    <IconButton aria-label="download file">
                                        <GetApp />
                                    </IconButton>
                                </a>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                
            </Grid>
        </Container>
    );
};

export default DocInstruction;