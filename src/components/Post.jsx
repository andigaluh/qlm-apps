import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Container, makeStyles, Typography } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    media: {
        height: 250,
        [theme.breakpoints.down("sm")] : {
            height: 150
        }
    },
    card: {
        marginBottom: theme.spacing(5)
    }
}));

const Post = () => {
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <CardActionArea>
                <CardMedia className={classes.media} image="https://mui.com/static/images/cards/contemplative-reptile.jpg" title="Contemplative Reptile" />
                <CardContent>
                    <Typography gutterBottom variant="h5">Post Title</Typography>
                    <Typography variant="body2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo, lorem in efficitur lacinia, turpis velit vulputate nunc, sed pretium odio diam ac tortor. Fusce consequat quis nisi at congue.
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary">Share</Button>
                <Button size="small" color="primary">Learn More</Button>
            </CardActions>
        </Card>
    );
};

export default Post;