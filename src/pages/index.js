import React, { useState, useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby"
import { Button, RadioGroup, Radio, Typography, FormControlLabel, FormControl, FormLabel } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import Fullscreen from "react-full-screen";

import Images from "../components/images";
import theme from '../styles/theme';

const styles = theme => ({
  container: {
    margin: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
  },
  marginBottomMedium: {
    marginBottom: theme.spacing(2),
  },
  timer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
});

const IndexPage = ({ classes }) => {
  const [type, setType] = useState("same");
  const [shortTime, setShortTime] = useState("60000");
  const [longTime, setLongTime] = useState("600000");
  const [fullScreen, setFullScreen] = useState(false);
  const [timer, setTimer] = useState(0);

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

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.container}>
        <Typography
          variant="h4"
          className={classes.marginBottomMedium}>
            Figures
        </Typography>
        <FormControl component="fieldset">
          <FormLabel component="legend">Type of session</FormLabel>
          <RadioGroup
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={classes.marginBottomMedium}
          >
            <FormControlLabel value="same" control={<Radio color="primary" />} label="Same length" />
            <FormControlLabel value="class" control={<Radio color="primary" />} label="Class" />
          </RadioGroup>
          <FormLabel component="legend">{type === "class" ? "Short picture time" : "Time per picture"}</FormLabel>
          <RadioGroup
            value={shortTime}
            onChange={(e) => setShortTime(e.target.value)}
            className={classes.marginBottomMedium}
          >
            <FormControlLabel value="30000" control={<Radio color="primary" />} label="30 sec" />
            <FormControlLabel value="60000" control={<Radio color="primary" />} label="60 sec" />
            <FormControlLabel value="90000" control={<Radio color="primary" />} label="90 sec" />
            <FormControlLabel value="120000" control={<Radio color="primary" />} label="120 sec" />
          </RadioGroup>
          {type === "class" && (
            <>
              <FormLabel component="legend">Long picture time</FormLabel>
              <RadioGroup
                value={longTime}
                onChange={(e) => setLongTime(e.target.value)}
                className={classes.marginBottomMedium}
              >
                <FormControlLabel value="300000" control={<Radio color="primary" />} label="5 min" />
                <FormControlLabel value="600000" control={<Radio color="primary" />} label="10 min" />
                <FormControlLabel value="1800000" control={<Radio color="primary" />} label="30 min" />
                <FormControlLabel value="3600000" control={<Radio color="primary" />} label="60 min" />
                <FormControlLabel value="86400000‬" control={<Radio color="primary" />} label="No limit" />
              </RadioGroup>
            </>
          )}
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
        </FormControl>
      </div>
      {timer !== 0 && (
        <Typography
          variant="h1"
          className={classes.timer}>
            {timer}
        </Typography>)}
      <Fullscreen enabled={fullScreen} onChange={(enabled) => setFullScreen(enabled)}>
        {fullScreen && <Images data={data.allFile.edges} onClose={() => setFullScreen(false)} options={{ type, shortTime, longTime }} />}
      </Fullscreen>
    </ThemeProvider>
  )
};

export default withStyles(styles)(IndexPage);
