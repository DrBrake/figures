import React, { useState, useEffect, useReducer } from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import {
  PlayArrow,
  Pause,
  Close,
  FastForward,
  FastRewind,
} from "@material-ui/icons";

import useTimeout from "./timeout";
import useInterval from "./interval";

const styles = (theme) => ({
  container: {
    width: "100%",
    height: "100%",
  },
  image: {
    position: "absolute",
    height: "100%",
    top: "50%",
    left: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  name: {
    position: "absolute",
    left: 0,
    zIndex: 1,
    color: "white",
    padding: theme.spacing(2),
  },
  icon: {
    cursor: "pointer",
    zIndex: 1,
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
  closeIcon: {
    position: "absolute",
    cursor: "pointer",
    width: theme.spacing(4),
    height: theme.spacing(4),
    right: theme.spacing(2),
    zIndex: 1,
  },
  bar: {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    background: "rgba(0, 0, 0, 0.7)",
    zIndex: 1,
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
  timer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1,
    color: "#ee008b",
    fontWeight: 900,
    fontSize: "10rem",
  },
});

const reducer = (state, action) => {
  switch (action.type) {
    case "newImage":
      const newImages = state.availableImages.filter((el, elIndex) => {
        if (elIndex !== action.index) return el;
        return null;
      });
      return {
        ...state,
        seenImageIndex:
          state.seenImages.length !== 0 ? state.seenImageIndex + 1 : 0,
        seenImages: state.seenImages.concat(
          new Array(state.availableImages[action.index])
        ),
        availableImages: newImages.length > 0 ? newImages : action.data,
      };
    case "imageFromHistory":
      return {
        ...state,
        seenImageIndex: state.seenImageIndex + action.dir,
      };
    default:
      return state;
  }
};

const Images = ({ classes, onClose, options, data }) => {
  const [state, dispatch] = useReducer(reducer, {
    seenImages: [],
    seenImageIndex: 0,
    availableImages: data,
  });
  const [play, setPlay] = useState(true);
  const [controlsVisible, setcontrolsVisible] = useState(false);
  const [visibilityDelay, setVisibilityDelay] = useState(0);
  const [imageTimeout, setImageTimeout] = useState(0);
  const [pictureIndicatorTimeOut, setPictureIndicatorTimeout] = useState(null);

  useEffect(() => {
    setcontrolsVisible(true);
    setVisibilityDelay(3000);
  }, []);

  useInterval(() => setNewImage(), play ? imageTimeout : null);
  useTimeout(
    () => setcontrolsVisible(false),
    controlsVisible ? visibilityDelay : null
  );
  useTimeout(() => setPictureIndicatorTimeout(null), pictureIndicatorTimeOut);

  const getRandom = () => {
    const min = Math.ceil(0);
    const max = Math.floor(state.availableImages.length);
    const randomIndex = Math.floor(Math.random() * (max - min)) + min;
    return randomIndex;
  };

  const setNewImage = () => {
    const index = getRandom();
    dispatch({ type: "newImage", index: index, data: data });
    setImageTimeoutByType();
  };

  const setImageTimeoutByType = () => {
    if (options.type === "same") {
      setImageTimeout(parseInt(options.shortTime));
    } else if (options.type === "class") {
      const timeForLongImage =
        state.seenImages.length > parseInt(options.shortPicturesBeforeLong) - 1;
      setImageTimeout(
        timeForLongImage
          ? parseInt(options.longTime)
          : parseInt(options.shortTime)
      );
      if (timeForLongImage) {
        setPictureIndicatorTimeout(5000);
      }
    }
  };

  return (
    <div className={classes.container}>
      <Typography
        className={classNames(
          classes.name,
          controlsVisible ? classes.visible : classes.hidden
        )}
      >
        {state.seenImages[state.seenImageIndex]?.node?.name}
      </Typography>
      <Close
        className={classNames(
          classes.closeIcon,
          controlsVisible ? classes.visible : classes.hidden
        )}
        color="secondary"
        onClick={onClose}
        onMouseEnter={() => setcontrolsVisible(true)}
        onMouseLeave={() => setVisibilityDelay(3000)}
      />
      <img
        src={state.seenImages[state.seenImageIndex]?.node?.publicURL}
        alt=""
        className={classes.image}
      />
      <div
        className={classNames(
          classes.bar,
          controlsVisible ? classes.visible : classes.hidden
        )}
        onMouseEnter={() => setcontrolsVisible(true)}
        onMouseLeave={() => setVisibilityDelay(3000)}
      >
        <FastRewind
          className={classes.icon}
          color="secondary"
          onClick={() => {
            if (state.seenImageIndex > 0) {
              setPlay(false);
              dispatch({ type: "imageFromHistory", dir: -1 });
            }
          }}
        />
        {play ? (
          <Pause
            className={classes.icon}
            color="secondary"
            onClick={() => setPlay(false)}
          />
        ) : (
          <PlayArrow
            className={classes.icon}
            color="secondary"
            onClick={() => {
              setPlay(true);
              setImageTimeoutByType();
            }}
          />
        )}
        <FastForward
          className={classes.icon}
          color="secondary"
          onClick={() => {
            setPlay(false);
            if (state.seenImageIndex + 1 === state.seenImages.length) {
              setNewImage();
            } else {
              dispatch({ type: "imageFromHistory", dir: +1 });
            }
          }}
        />
      </div>
      {pictureIndicatorTimeOut &&
        state.seenImages.length >
          parseInt(options.shortPicturesBeforeLong) - 1 && (
          <Typography variant="h1" className={classes.timer}>
            {`${parseInt(options.longTime) / 10000 / 6}min`}
          </Typography>
        )}
    </div>
  );
};

export default withStyles(styles)(Images);
