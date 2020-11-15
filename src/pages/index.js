import React, { useState, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby";
import {
  Button,
  RadioGroup,
  Radio,
  Typography,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Grid,
  Dialog,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import Fullscreen from "react-full-screen";
import { v4 as uuidv4 } from "uuid";

import Images from "../components/images";
import theme from "../styles/theme";

const styles = (theme) => ({
  container: {
    margin: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
  },
  marginBottomMedium: {
    marginBottom: theme.spacing(2),
  },
  timer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  toggleText: {
    color: theme.palette.primary.main,
    cursor: "pointer",
    marginLeft: theme.spacing(2),
  },
  image: {
    objectFit: "cover",
    width: "100px",
    height: "100px",
    cursor: "pointer",
  },
  actionContainer: {
    display: "flex",
    alignItems: "center",
    paddingBottom: theme.spacing(2),
  },
  dialogImage: {
    overflow: "hidden",
    objectFit: "contain",
  },
  dialogName: {
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 1,
    color: "white",
    padding: theme.spacing(2),
  },
  paper: {
    background: "transparent",
    boxShadow: "none",
  },
});

const SESSION_TYPES = {
  SAME: "same",
  CLASS: "class",
};

const IndexPage = ({ classes }) => {
  const [type, setType] = useState(SESSION_TYPES.SAME);
  const [shortTime, setShortTime] = useState("60000");
  const [longTime, setLongTime] = useState("600000");
  const [shortPicturesBeforeLong, setShortPicturesBeforeLong] = useState(10);
  const [fullScreen, setFullScreen] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showImageGrid, setShowImageGrid] = useState(false);
  const [imageFromGrid, setImageFromGrid] = useState(null);

  const data = useStaticQuery(graphql`
    {
      allFile(filter: { extension: { regex: "/(jpg)|(jpeg)|(png)|(webp)/" } }) {
        edges {
          node {
            publicURL
            name
          }
        }
      }
    }
  `);

  useEffect(() => {
    let countdownTimer = setTimeout(() => {
      if (timer === 0) {
        clearTimeout(countdownTimer);
        return;
      }
      setTimer(timer - 1);
    }, 1000);
  }, [timer]);

  const disableShortRadioButtons =
    (shortPicturesBeforeLong === "0" || shortPicturesBeforeLong === 0) &&
    type === SESSION_TYPES.CLASS;

  const sortByName = (array) => {
    if (array) {
      return array.sort((a, b) => {
        if (a?.node?.name < b?.node?.name) return -1;
        else if (a?.node?.name > b?.node?.name) return 1;
        return 0;
      });
    }
    return [];
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.container}>
        <Typography variant="h4" className={classes.marginBottomMedium}>
          Figures
        </Typography>
        <FormControl component="fieldset">
          <FormLabel component="legend">Type of session</FormLabel>
          <RadioGroup
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={classes.marginBottomMedium}
          >
            <FormControlLabel
              value={SESSION_TYPES.SAME}
              control={<Radio color="primary" />}
              label="Same length"
            />
            <FormControlLabel
              value={SESSION_TYPES.CLASS}
              control={<Radio color="primary" />}
              label="Class"
            />
          </RadioGroup>
          <FormLabel component="legend">
            {type === SESSION_TYPES.CLASS
              ? "Short picture time"
              : "Time per picture"}
          </FormLabel>
          <RadioGroup
            value={shortTime}
            onChange={(e) => setShortTime(e.target.value)}
            className={classes.marginBottomMedium}
          >
            <FormControlLabel
              value="30000"
              control={
                <Radio color="primary" disabled={disableShortRadioButtons} />
              }
              label="30 sec"
            />
            <FormControlLabel
              value="60000"
              control={
                <Radio color="primary" disabled={disableShortRadioButtons} />
              }
              label="60 sec"
            />
            <FormControlLabel
              value="90000"
              control={
                <Radio color="primary" disabled={disableShortRadioButtons} />
              }
              label="90 sec"
            />
            <FormControlLabel
              value="120000"
              control={
                <Radio color="primary" disabled={disableShortRadioButtons} />
              }
              label="120 sec"
            />
          </RadioGroup>
          {type === SESSION_TYPES.CLASS && (
            <>
              <FormLabel component="legend">Long picture time</FormLabel>
              <RadioGroup
                value={longTime}
                onChange={(e) => setLongTime(e.target.value)}
                className={classes.marginBottomMedium}
              >
                <FormControlLabel
                  value="600000"
                  control={<Radio color="primary" />}
                  label="10 min"
                />
                <FormControlLabel
                  value="1200000"
                  control={<Radio color="primary" />}
                  label="20 min"
                />
                <FormControlLabel
                  value="2400000"
                  control={<Radio color="primary" />}
                  label="40 min"
                />
                <FormControlLabel
                  value="3600000"
                  control={<Radio color="primary" />}
                  label="60 min"
                />
                <FormControlLabel
                  value="86400000‬"
                  control={<Radio color="primary" />}
                  label="No limit"
                />
              </RadioGroup>
              <TextField
                value={shortPicturesBeforeLong}
                onChange={(e) => setShortPicturesBeforeLong(e.target.value)}
                type="number"
                variant="outlined"
                label="Short pictures before long"
                className={classes.marginBottomMedium}
              />
            </>
          )}
          <div className={classes.actionContainer}>
            <Button
              color="primary"
              variant="contained"
              disabled={timer !== 0}
              onClick={() => {
                setTimer(3);
                setTimeout(() => {
                  setFullScreen(true);
                }, 3000);
              }}
            >
              Start!
            </Button>
            <Typography
              variant="body1"
              className={classes.toggleText}
              onClick={() => setShowImageGrid(!showImageGrid)}
            >
              Toggle images
            </Typography>
          </div>
        </FormControl>
        {showImageGrid && (
          <Grid container>
            {sortByName(data?.allFile?.edges).map((item) => (
              <Grid item key={uuidv4()}>
                <img
                  src={item.node?.publicURL}
                  alt=""
                  className={classes.image}
                  onClick={() => setImageFromGrid(item.node)}
                />
              </Grid>
            ))}
          </Grid>
        )}
        <Dialog
          open={imageFromGrid !== null}
          onClose={() => setImageFromGrid(null)}
          maxWidth={false}
          classes={{
            paper: classes.paper,
          }}
        >
          <Typography className={classes.dialogName}>
            {imageFromGrid?.name}
          </Typography>
          <img
            src={imageFromGrid?.publicURL}
            alt=""
            onClick={() => setImageFromGrid(null)}
            className={classes.dialogImage}
          />
        </Dialog>
      </div>
      {timer !== 0 && (
        <Typography variant="h1" className={classes.timer}>
          {timer}
        </Typography>
      )}
      <Fullscreen
        enabled={fullScreen}
        onChange={(enabled) => setFullScreen(enabled)}
      >
        {fullScreen && (
          <Images
            data={data.allFile.edges}
            onClose={() => setFullScreen(false)}
            options={{ type, shortTime, longTime, shortPicturesBeforeLong }}
          />
        )}
      </Fullscreen>
    </ThemeProvider>
  );
};

export default withStyles(styles)(IndexPage);
