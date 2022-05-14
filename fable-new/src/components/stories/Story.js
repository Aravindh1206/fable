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
import ForumIcon from "@mui/icons-material/Forum";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Button from "@restart/ui/esm/Button";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useContext } from "react";
import { AuthContext } from "../../firebase/Auth";

import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { Fab } from "@material-ui/core";

import Edit from "@mui/icons-material/Edit";
import { Chip } from "@material-ui/core";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import Comments from "./Comments";
import { toast } from "react-toastify";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Sugar from "sugar";

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
    padding: 1,
    float: "left",
    marginTop: 10,
    marginRight: 10,
    backgroundColor: "black",
    color: "white",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
      border: "solid 1px",
    },
  },
  media: {
    height: "100%",
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
    color: "white",
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
      backgroundColor: "white",
      color: "black",
      textDecoration: "white",
      fontWeight: "bold",
    },
  },
  card1: {
    width: "100%",
    marginLeft: "10%",
    paddingRight: "0%",
  },
  card2: {
    width: "70%",
    height: "100%",
    marginRight: "13vw !important",
  },
  card3: {
    width: "5vw",
    height: "5vw",
    marginLeft: "5%",
    paddingRight: "0%",
  },
  card4: {
    height: "50%",
    width: "50%",
    marginLeft: "0%",
    paddingRight: "0%",
    paddingLeft: "0%",
  },
  similarStories: {
    padding: 6,
  },
  similarImages: {
    maxWidth: 50,
    maxHeight: 50,
  },
  content1: {
    paddingLeft: "22%",
  },
});

const Story = () => {
  const { id } = useParams();
  const [storyData, setStoryData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const classes = useStyles();
  const [commentsModal, setCommentsModal] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function getStoryData() {
      try {
        const { data } = await axios.get(`/api/stories/${id}`, {
          headers: { authtoken: await currentUser.getIdToken() },
        });
        console.log(data);
        setStoryData(data);
      } catch (e) {
        console.log(e);
        if (e.response.status === 404)
          toast.error("The requested resource does not exist.", {
            theme: "dark",
          });
        setTimeout(() => navigate(`/home`), 500);
        return;
      }
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

  const buildFriendlyDate = (date) => {
    try {
      let dateObj = new Date(date);
      // if (isNaN(Date.parse(dateObj))) {
      //   console.log("Invalid date");
      //   return "";
      // }
      return Sugar.Date.relative(dateObj);
    } catch (e) {
      return "";
    }
  };

  if (storyData) {
    console.log(storyData);
    return (
      <span>
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
                  <Tooltip placement="right" title={buildFriendlyDate(storyData.story.createdAt)}>
                    <Typography variant="h2" className={classes.title1}>
                      {storyData.story.title.length > 35
                        ? storyData.story.title.substring(0, 40) + "..."
                        : storyData.story.title}
                    </Typography>
                  </Tooltip>{" "}
                  <br></br> &nbsp;
                  <Typography variant="inherit">
                    {" "}
                    <FavoriteIcon /> &nbsp;
                    {" " + storyData.story.likedBy.length}
                  </Typography>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                  <Typography variant="inherit">
                    {" "}
                    <VisibilityIcon />
                    {" " + storyData.story.visitedBy.length}
                  </Typography>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                  <Tooltip placement="right" title="Average time it'll take for you to read this story">
                    <Typography variant="inherit">
                      {" "}
                      <AutoStoriesIcon />
                      {" ~" + storyData.story.accessorReadTime + " min"}
                    </Typography>
                  </Tooltip>
                  <br />
                  <br />
                  <Link to={`/stories/${storyData.story._id}/book`}>
                    <Button className={classes.button} elevation={20}>
                      <MenuBookIcon /> &nbsp; Start Reading{" "}
                    </Button>
                  </Link>
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
                  <Fab className={classes.editButton} onClick={() => setCommentsModal(true)}>
                    <ForumIcon />
                  </Fab>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Paper>
        <br />
        <br />
        <Paper elevation={0}>
          <Grid>
            {/* <Stack direction={"row"} spacing={20}> */}

            <Stack direction={"row"} spacing={30}>
              {/* <Typography variant="h6">{storyData.creator}</Typography> */}
              <Card className={classes.card1} elevation={0}>
                {" "}
                <br />
                <CardContent>
                  {" "}
                  <Typography variant="subtitle">{storyData.story.shortDescription}</Typography> <br />
                  <br />
                  <br />
                  <Stack direction="row" spacing={1}>
                    {storyData &&
                      storyData.story &&
                      storyData.story.genres &&
                      storyData.story.genres.map((genre) => {
                        return (
                          <Chip
                            label={genre}
                            size={"small"}
                            color="info"
                            onClick={() => navigate(`/stories/choose/${genre}`)}
                          />
                        );
                      })}
                  </Stack>
                </CardContent>{" "}
                <Typography>&nbsp;&nbsp; Story Written by:</Typography>
                <CardContent>
                  <Link to={`/users/${storyData.creator._id}`} class="text-decoration-none">
                    {storyData.creator.displayName}
                  </Link>
                </CardContent>
              </Card>

              <Card className={classes.card2} elevation={24}>
                <CardContent>
                  <Typography variant="h5">You might also like</Typography>
                  <Divider />
                  <br />
                  {recommendations && recommendations.length === 0 && <div>No stories available.</div>}
                  {recommendations &&
                    recommendations.map((recommendation) => {
                      if (recommendation._id !== id) {
                        return (
                          <div>
                            <Grid className={classes.similarStories}>
                              <Typography variant="subtitle">
                                <span className={classes.card3}>
                                  <img
                                    className={classes.similarImages}
                                    src={recommendation.coverImage ? recommendation.coverImage : "/fablefinal.png"}
                                  />
                                </span>
                                &nbsp; &nbsp;
                                <span className={classes.card4}>
                                  &nbsp; &nbsp;
                                  <span className={classes.content}>
                                    <Link to={`/stories/${recommendation._id}`} class="text-decoration-none">
                                      {recommendation.title}
                                    </Link>
                                  </span>
                                  <br />
                                  <span className={classes.content1}>
                                    <Typography variant="caption">
                                      {recommendation.shortDescription.length > 50
                                        ? recommendation.shortDescription.substring(0, 50) + "..."
                                        : recommendation.shortDescription}
                                    </Typography>
                                  </span>
                                </span>
                              </Typography>
                            </Grid>
                          </div>
                        );
                      }
                    })}
                </CardContent>
              </Card>
            </Stack>
            {/* </Stack> */}
          </Grid>
        </Paper>
        <Comments
          storyId={id}
          open={commentsModal}
          existingComments={storyData.story.comments}
          handleClose={() => setCommentsModal(false)}
        />
      </span>
    );
  }
};

export default Story;
