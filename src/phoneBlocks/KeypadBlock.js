import React from 'react'
import {
  Grid,
  Fab,
  FormControlLabel,
  Switch,
  Tooltip
} from '@material-ui/core'
import {
  Mic,
  MicOff,
  Settings,
  Pause,
  Call,
  CallEnd,
  Transform,
  PlayArrow,
  PhoneForwarded,
  Cancel,
  SwapCalls,
  CallMerge
} from '@material-ui/icons'

import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import SearchList from './SearchList'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  fab: {
    width: '41px',
    height: '41px',
    background: '#f4f6f8'
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
  pauseIcon: {
    color: '#263238'
  },
  gridRaw: {
    paddingTop: '27px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  gridLastRaw: {
    paddingTop: '12px',
    display: 'flex',
    justifyContent: 'center'
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  status: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 0 0 10px'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: '0 10px'
  }
}))

function KeypadBlock({
  handleCallAttendedTransfer,
  handleCallTransfer,
  handlePressKey,
  handleMicMute,
  handleCall,
  handleEndCall,
  activeChanel,
  keyVariant = 'default',
  handleHold,
  asteriskAccounts = [],
  dialState,
  setDialState
}) {
  const classes = useStyles()
  const {
    inCall,
    muted,
    hold,
    sessionId,
    inAnswer,
    inAnswerTransfer,
    inConference,
    inTransfer,
    transferControl,
    allowTransfer,
    allowAttendedTransfer
  } = activeChanel
  const [anchorElTransfer, setAnchorElTransfer] = React.useState(null)
  const [anchorElAttended, setAnchorElAttended] = React.useState(null)
  const handleClickTransferCall = (event) => {
    if (dialState) {
      handleCallTransfer(dialState)
      setDialState('')
      return
    }
    setAnchorElTransfer(event.currentTarget)
  }
  const handleClickAttendedTransfer = (event) => {
    if (dialState) {
      handleCallAttendedTransfer('transfer', {})
      setDialState('')
      return
    }
    setAnchorElAttended(event.currentTarget)
  }
  const AttendedTransferListClick = (id) => {
    handleCallAttendedTransfer('transfer', id)
    setDialState('')
  }
  return (
    <div>
      {keyVariant === 'default' ? (
        <div>
          <Grid container spacing={0} className={classes.gridRaw}>
            <Grid item xs={3}>
              <Grid item xs={12}>
                <Tooltip title={muted ? 'Unmute mic' : 'Mute mic'} disableFocusListener disableTouchListener>
                  <div>
                    <Fab
                      disabled={!inCall}
                      value={inCall}
                      className={classes.fab}
                      size='small'
                      aria-label=''
                      onClick={handleMicMute}
                    >
                      {muted ? <MicOff /> : <Mic />}
                    </Fab>
                  </div>
                </Tooltip>
              </Grid>
              <Grid hidden>
                <FormControlLabel
                  control={<Switch size='small' checked onChange={() => {}} />}
                  label='Mute'
                />
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Tooltip title={hold ? 'Resume' : 'Hold'} disableFocusListener disableTouchListener>
                <div>
                  <Fab
                    disabled={!inCall || !inAnswer}
                    className={classes.fab}
                    size='small'
                    aria-label='4'
                    onClick={() => {
                      handleHold(sessionId, hold)
                    }}
                  >
                    {hold ? <PlayArrow /> : <Pause />}
                  </Fab>
                </div>
              </Tooltip>
            </Grid>
            <Grid item xs={3}>
              <Tooltip title='Transfer Call'>
                <div>
                  <Fab
                    disabled={!inCall || !inAnswer || hold || !allowAttendedTransfer}
                    className={classes.fab}
                    size='small'
                    aria-label='4'
                    onClick={handleClickTransferCall}
                    aria-describedby='transferredBox'
                  >
                    <PhoneForwarded />
                  </Fab>
                </div>
              </Tooltip>
              <SearchList
                asteriskAccounts={asteriskAccounts}
                onClickList={(id) => handleCallTransfer(id)}
                ariaDescribedby='transferredBox'
                anchorEl={anchorElTransfer}
                setAnchorEl={setAnchorElTransfer}
              />
            </Grid>
            <Grid item xs={3}>
              <Tooltip title='Attended Transfer'>
                <div>
                  <Fab
                    disabled={!inCall || !inAnswer || hold || !allowTransfer}
                    className={classes.fab}
                    size='small'
                    aria-label='4'
                    onClick={handleClickAttendedTransfer}
                    aria-describedby='attendedBox'
                  >
                    <Transform />
                  </Fab>
                </div>
              </Tooltip>
              <SearchList
                asteriskAccounts={asteriskAccounts}
                onClickList={AttendedTransferListClick}
                ariaDescribedby='attendedBox'
                anchorEl={anchorElAttended}
                setAnchorEl={setAnchorElAttended}
              />
            </Grid>
            {inAnswerTransfer &&
            !inConference &&
            inTransfer &&
            transferControl ? (
              <Grid container spacing={0} className={classes.gridRaw}>
                  <Grid item xs={3}>
                  <Tooltip title='Conference' aria-label='conference'>
                      <span>
                      <Fab
                          disabled={false}
                          className={classes.fab}
                          size='small'
                          aria-label='4'
                          onClick={() => {
                            handleCallAttendedTransfer('merge', {})
                          }}
                        >
                          <CallMerge />
                        </Fab>
                    </span>
                    </Tooltip>
                </Grid>
                  <Grid item xs={3}>
                  <Tooltip title='Swap Caller' aria-label='swap-caller'>
                      <span>
                      <Fab
                          disabled={false}
                          className={classes.fab}
                          size='small'
                          aria-label='4'
                          onClick={() => {
                            handleCallAttendedTransfer('swap', {})
                          }}
                        >
                          <SwapCalls />
                        </Fab>
                    </span>
                    </Tooltip>
                </Grid>
                  <Grid item xs={3}>
                  <Tooltip title='Pass Call' aria-label='pass-call'>
                      <span>
                      <Fab
                          disabled={false}
                          className={classes.fab}
                          size='small'
                          aria-label='4'
                          onClick={() => {
                            handleCallAttendedTransfer('finish', {})
                          }}
                        >
                          <PhoneForwarded />
                        </Fab>
                    </span>
                    </Tooltip>
                </Grid>
                  <Grid item xs={3}>
                  <Tooltip title='Cancel Transfer' aria-label='cancel-transfer'>
                      <span>
                      <Fab
                          disabled={false}
                          className={classes.fab}
                          size='small'
                          aria-label='4'
                          onClick={() => {
                            handleCallAttendedTransfer('cancel', {})
                          }}
                        >
                          <Cancel />
                        </Fab>
                    </span>
                    </Tooltip>
                </Grid>
                </Grid>
              ) : (
                <div />
              )}
          </Grid>

          <Grid container spacing={0} className={classes.gridLastRaw}>
            {inCall === false ? (
              <Fab
                className={classes.callButton}
                size='small'
                aria-label='4'
                onClick={handleCall}
              >
                <Call />
              </Fab>
            ) : (
              <Fab
                size='small'
                aria-label=''
                className={classes.endCallButton}
                onClick={handleEndCall}
              >
                <CallEnd />
              </Fab>
            )}
            {/* <Fab */}
            {/* className={classes.fab} */}
            {/* size="small" */}
            {/* aria-label="4" */}
            {/* onClick={handleSettingsButton}> */}
            {/* <Settings /> */}
            {/* </Fab> */}
          </Grid>
        </div>
      ) : (
        <div>
          <Grid container spacing={0} className={classes.gridRaw}>
            <Fab
              className={classes.fab}
              size='small'
              aria-label='1'
              value={1}
              onClick={handlePressKey}
            >
              1
            </Fab>
            <Fab
              className={classes.fab}
              size='small'
              aria-label='2'
              value={2}
              onClick={handlePressKey}
            >
              2
            </Fab>
            <Fab
              className={classes.fab}
              size='small'
              aria-label='3'
              value={3}
              onClick={handlePressKey}
            >
              3
            </Fab>
            <Fab className={classes.fab} size='small' aria-label='4'>
              <Settings />
            </Fab>
          </Grid>
          <Grid container spacing={0} className={classes.gridRaw}>
            <Fab
              className={classes.fab}
              size='small'
              aria-label='4'
              value={4}
              onClick={handlePressKey}
            >
              4
            </Fab>
            <Fab
              className={classes.fab}
              size='small'
              aria-label='5'
              value={5}
              onClick={handlePressKey}
            >
              5
            </Fab>
            <Fab
              className={classes.fab}
              size='small'
              aria-label='6'
              value={6}
              onClick={handlePressKey}
            >
              6
            </Fab>
            <Fab className={classes.fab} size='small' aria-label='4'>
              <Pause />
            </Fab>
          </Grid>
          <Grid container spacing={0} className={classes.gridRaw}>
            <Fab
              className={classes.fab}
              size='small'
              aria-label='7'
              value={7}
              onClick={handlePressKey}
            >
              7
            </Fab>
            <Fab
              className={classes.fab}
              size='small'
              aria-label='8'
              value={8}
              onClick={handlePressKey}
            >
              8
            </Fab>
            <Fab
              className={classes.fab}
              size='small'
              aria-label='9'
              value={9}
              onClick={handlePressKey}
            >
              9
            </Fab>
            <Fab className={classes.fab} size='small' aria-label='4'>
              <Transform />
            </Fab>
          </Grid>
          <Grid container spacing={0} className={classes.gridRaw}>
            <Fab
              className={classes.fab}
              size='small'
              aria-label='*'
              value='*'
              onClick={handlePressKey}
            >
              *
            </Fab>
            <Fab
              className={classes.fab}
              size='small'
              aria-label='0'
              value={0}
              onClick={handlePressKey}
            >
              0
            </Fab>
            <Fab
              className={classes.fab}
              size='small'
              aria-label='#'
              value='#'
              onClick={handlePressKey}
            >
              #
            </Fab>
            <Fab className={classes.fab} size='small' aria-label=''>
              <Settings />
            </Fab>
          </Grid>
          <Grid container spacing={0} className={classes.gridLastRaw}>
            {inCall === 0 ? (
              <Fab
                className={classes.callButton}
                size='small'
                aria-label='4'
                onClick={handleCall}
              >
                <Call />
              </Fab>
            ) : (
              <Fab
                size='small'
                aria-label=''
                className={classes.endCallButton}
                onClick={handleEndCall}
              >
                <CallEnd />
              </Fab>
            )}
          </Grid>
        </div>
      )}
    </div>
  )
}
KeypadBlock.propTypes = {
  handleCallAttendedTransfer: PropTypes.any,
  handleCallTransfer: PropTypes.any,
  handlePressKey: PropTypes.any,
  handleMicMute: PropTypes.any,
  handleCall: PropTypes.any,
  handleEndCall: PropTypes.any,
  activeChanel: PropTypes.any,
  keyVariant: PropTypes.any,
  handleHold: PropTypes.any,
  asteriskAccounts: PropTypes.any,
  dialState: PropTypes.any,
  setDialState: PropTypes.any
}
export default KeypadBlock
