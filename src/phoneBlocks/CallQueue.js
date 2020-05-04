import {
  Button, Grid, Typography, Box
} from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 264,
  },
  answer: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.dark
    },
    fontSize: 9,
    alignItems: 'center'

  },
  reject: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    },
    fontSize: 9,

  },
}));


function CallQueue({ calls, handleAnswer, handleReject }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {calls.map((call) => {
        const parsedCaller = call.callNumber.split('-');
        return (
          <Grid
            key={call.sessionId}
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={12}>

              {parsedCaller[0] ? (
                <Box overflow="auto" component="div" whiteSpace="normal" bgcolor="background.paper">
                  <Typography variant="caption" gutterBottom>
                    Caller:
                    {parsedCaller[0]}
                  </Typography>
                </Box>
              ) : <div />}
              {parsedCaller[1] ? (
                <Box overflow="auto" component="div" whiteSpace="normal" bgcolor="background.paper">
                  <Typography variant="caption" gutterBottom>
                    Jurisdiction:
                    {parsedCaller[1]}
                  </Typography>
                </Box>
              ) : <div />}
              {parsedCaller[2] ? (
                <Box overflow="auto" component="div" whiteSpace="normal" bgcolor="background.paper">
                  <Typography variant="caption" gutterBottom>
                    To Number:
                    {parsedCaller[2]}
                  </Typography>
                </Box>
              ) : <div />}

            </Grid>

            <Grid item xs={6}>
              <div
                className={classes.paper}
              >
                {' '}
                <Button variant="contained" color="primary" onClick={handleAnswer} value={call.sessionId} className={classes.answer}>Answer</Button>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className={classes.paper}>
                {' '}
                <Button variant="contained" color="primary" onClick={handleReject} value={call.sessionId} className={classes.reject}>Reject</Button>
              </div>
            </Grid>
          </Grid>
        );
      })}
    </div>
  );
}


export default CallQueue;
