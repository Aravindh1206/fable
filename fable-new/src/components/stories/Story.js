import {
  AppBar,
  Box,
  Card,
  CardMedia,
  Grid,
  Paper,
  Typography,
  makeStyles,
  CardContent,
  Tooltip,
} from "@material-ui/core";
import { Divider, Stack } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Button from "@restart/ui/esm/Button";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
import { Fab } from "@material-ui/core";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Edit from "@mui/icons-material/Edit";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "auto",
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    border: "0px solid #000",
    marginBottom: "10%",
    marginTop: "7%",
  },
  editButton: {
    border: "solid 1px",
    padding: 1,
    float: "left",
    marginTop: 10,
    marginRight: 50,
    backgroundColor: "#e4d4a3",
    "&:hover": {
      backgroundColor: "#000000",
      color: "#fff",
    },
  },
  media: {
    height: "300px",
    width: "100%",
  },
  title: {
    border: " 0px #fff",
    width: "auto",
    height: "auto",
    marginTop: "1px",
    paddingTop: "5%",
    fontFamily: "'Encode Sans Semi Expanded', sans-serif",
  },
  title1: {
    width: "auto",
    height: "auto",
    fontSize: "35px",
    fontFamily: "'Encode Sans Semi Expanded', sans-serif",
  },
  nameBox: {
    marginRight: "1000px",
  },
  button: {
    backgroundColor: "black",
    color: "blanchedalmond",
    width: "auto",
    maxWidth: "500px",
    maxHeight: "200px",
    marginTop: "1%",
    paddingTop: "20px",
    paddingBottom: "20px",
    paddingRight: "40px",
    paddingLeft: "40px",
    borderRadius: "35px",
    fontWeight: "bold",
    fontSize: "16px",
    textDecoration: "white",
    "&:hover": {
      backgroundColor: "blanchedalmond",
      color: "black",
      textDecoration: "white",
      fontWeight: "bold",
    },
  },
  card1: {
    width: "80%",
    marginLeft: "0%",
    paddingRight: "0%",
  },
  card2: {
    width: "120%",
    height: "200%",
    marginBottom: "100%",
  },
  card3: {
    width: "22%",
    height: "22%",
    marginLeft: "0%",
    paddingRight: "0%",
  },
  card4: {
    width: "50%",
    marginLeft: "50%",
    paddingRight: "50%",
  },
  // cardempty: {
  //   width: "100%"
  // },
  similarStories: {
    padding: 6,
  },
  similarImages: {
    maxWidth: 50,
    maxHeight: 50
  },
});

const Story = () => {
  const { id } = useParams();
  const [storyData, setStoryData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function getStoryData() {
      const { data } = await axios.get(`/api/stories/${id}`, {
        headers: { authtoken: await currentUser.getIdToken() },
      });
      console.log(data);
      setStoryData(data);
    }
    getStoryData();
  }, [id]);

  useEffect(() => {
    async function getRecommendations() {
      if (storyData) {
        const { data } = await axios.get(
          `/api/stories/recommendations?genres=${storyData.story.genres ? storyData.story.genres : ""}`,
          {
            headers: {
              authtoken: await currentUser.getIdToken(),
            },
          }
        );
        console.log(data);
        setRecommendations(data.recommendations);
      }
    }
    getRecommendations();
  }, [storyData]);

  if (storyData) {
    console.log(storyData);
    return (
      <div>
        <Paper
          elevation={10}
          sx={{
            bgcolor: "background.default",
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Grid container justifyContent="center">
            <Stack direction={"row"} spacing={7}>
              <Card className={classes.card} elevation={15}>
                <CardMedia className={classes.media} component="img" image={storyData.story.coverImage} />
              </Card>
              <Card className={classes.title} elevation={0}>
                <CardContent>
                  <Typography variant="h2" className={classes.title1}>
                    {storyData.story.title.length > 35
                      ? storyData.story.title.substring(0, 40) + "..."
                      : storyData.story.title}
                  </Typography>{" "}
                  <br></br>
                  <Typography variant="h7">
                    {" "}
                    <FavoriteIcon />
                    {" " + storyData.story.likedBy.length}
                  </Typography>
                  <Typography variant="h7">
                    {" "}
                    <VisibilityIcon />
                    {" " + storyData.story.visitedBy.length}
                  </Typography>
                  <Tooltip placement="right" title="Average time it'll take for you to read this story">
                    <Typography variant="h7">
                      {" "}
                      <AutoStoriesIcon />
                      {" ~" + storyData.story.accessorReadTime + " min"}
                    </Typography>
                  </Tooltip>
                  <br />
                  <br />
                  <span>
                    {currentUser.uid === storyData.story.creatorId && (
                      <Fab
                        className={classes.editButton}
                        onClick={() => navigate(`/stories/${storyData.story._id}/edit`)}
                      >
                        <Edit />
                      </Fab>
                    )}
                  </span>
                  <Link to={`/stories/${storyData.story._id}/book`}>
                    <Button className={classes.button}>
                      <MenuBookIcon /> &nbsp; Start Reading{" "}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Paper>
        <br />
        <br />
        <Paper
          elevation={0}
          sx={{
            bgcolor: "background.default",
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 2,
            height: "auto",
          }}
        >
          <Grid container justifyContent="center">
            <Stack direction={"row"} spacing={90}>
              {/* <Typography variant="h6">{storyData.creator}</Typography> */}
              <Card className={classes.card1} elevation={0}>
                <CardContent>
                  <Link to={`/users/${storyData.creator._id}`}>{storyData.creator.displayName}</Link>
                </CardContent>{" "}
                <br />
                <CardContent>
                  {" "}
                  <Typography variant="subtitle">{storyData.story.shortDescription}</Typography>{" "}
                </CardContent>
              </Card>
              {/* <Card className={classes.cardempty} elevation={10}>
                </Card> */}
              <Card className={classes.card2} elevation={24}>
                <CardContent>
                  <Typography variant="h5">Also you might like</Typography>
                  <Divider />
                  <br />
                  {recommendations && recommendations.length === 0 && <div>No stories available.</div>}
                  {recommendations &&
                    recommendations.map((recommendation) => {
                      return (
                        <div>
                          <Grid className={classes.similarStories}>
                            <Typography variant="subtitle">
                              <Card className={classes.card3}>
                              <img
                                className={classes.similarImages}
                                src={recommendation.coverImage ? recommendation.coverImage : "/fablefinal.png"}
                              />
                              </Card>
                              &nbsp;
                              &nbsp;
                              <Card lassName={classes.card4}>
                              &nbsp; &nbsp;

                              <Link to={`/stories/${recommendation._id}`}>{recommendation.title}</Link>
                              <br />
                              <Typography variant="overline">
                                {recommendation.shortDescription}
                              </Typography>
                              </Card>
                            </Typography>
                          </Grid>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Paper>
      </div>
    );
  }
};

export default Story;
