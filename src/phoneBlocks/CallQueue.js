import {
  Grid, Typography, Box, Paper, Fab
} from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Call, CallEnd } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    width: '100%'
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
    fontSize: 9
  },
  wrapper: {
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px'
  },
  callButton: {
    color: 'white',
    background: '#4ada61',
    '&:hover': {
      background: '#94f3a4'
    }
  },
  endCallButton: {
    color: 'white',
    background: '#fa1941',
    '&:hover': {
      background: '#f8939b'
    }
  },
  '@keyframes ringing': {
    '0%': { transform: 'translate(0, 0)' },
    '10%': { transform: 'translate(4px, 0px)' },
    '20%': { transform: 'translate(-4px, 0px)' },
    '30%': { transform: 'translate(3px, 0px)' },
    '40%': { transform: 'translate(-3px, 0px)' },
    '50%': { transform: 'translate(2px, 0px)' },
    '60%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(0, 0)' }
  },
  ringing: {
    animation: '$ringing .6s infinite'
  }
}))

function CallQueue({ calls, handleAnswer, handleReject }) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      {calls.map((call) => {
        const parsedCaller = call.callNumber.split('-')
        return (
          <Paper
            className={classes.wrapper}
            key={call.sessionId}
          >
            <Grid item xs={12}>
              {parsedCaller[0] ? (
                <Box overflow='auto' component='div' whiteSpace='normal' bgcolor='background.paper'>
                  <Typography variant='subtitle1'>
                    Caller:
                    {parsedCaller[0]}
                  </Typography>
                </Box>
              ) : <div />}
              {parsedCaller[1] ? (
                <Box overflow='auto' component='div' whiteSpace='normal' bgcolor='background.paper'>
                  <Typography variant='subtitle1'>
                    Jurisdiction:
                    {parsedCaller[1]}
                  </Typography>
                </Box>
              ) : <div />}
              {parsedCaller[2] ? (
                <Box overflow='auto' component='div' whiteSpace='normal' bgcolor='background.paper'>
                  <Typography variant='subtitle1'>
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
                <Fab
                  className={classes.callButton}
                  size='small'
                  onClick={handleAnswer}
                  value={call.sessionId}
                >
                  <Call className={classes.ringing} />
                </Fab>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className={classes.paper}>
                {/* <Button variant="contained" color="primary" onClick={handleReject} value={call.sessionId} className={classes.reject}>Reject</Button> */}
                <Fab
                  size='small'
                  className={classes.endCallButton}
                  onClick={handleReject}
                  value={call.sessionId}
                >
                  <CallEnd />
                </Fab>
              </div>
            </Grid>
          </Paper>
        )
      })}
    </div>
  )
}

export default CallQueue
