import React, { createRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Page from './phoneBlocks/Page';
import CallIcon from '@material-ui/icons/Call';
import {
  Divider, Drawer, IconButton, TextField, Snackbar
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import _ from 'lodash';
import KeypadBlock from './phoneBlocks/KeypadBlock';
import SwipeCaruselBlock from './phoneBlocks/SwipeCaruselBlock';
import SettingsBlock from './phoneBlocks/SettingsBlock';
import StatusBlock from './phoneBlocks/StatusBlock';
import CallQueue from './phoneBlocks/CallQueue';
import CallsFlowControl from './CallsFlowControl';


const flowRoute = new CallsFlowControl();

const player = createRef();
const ringer = createRef();

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  },
  phone: {
    maxWidth: '256px',
    padding: '27px'
  },
  gridSettings: {
    paddingTop: '26px',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    maxWidth: '202px'

  },
  connected: {
    color: 'green'
  },
  disconnected: {
    color: 'red'
  },

  textform: {
    '& > *': {
      textAlign: 'right',
      width: '100%'
    },
    '.MuiInputBase-input': {
      textAlign: 'right'
    }
  },

  phoneButton: {
    color: 'white',
    backgroundColor: '#3949ab',
    position: 'fixed',
    right: '27px',
    bottom: '27px',
    '&:hover': {
      background: '#94a3fc'
    }

  },
  drawerPaper: {
    width: 280
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: 280,
      flexShrink: 0
    }
  },
  drawerHeader: {
    marginTop: 64,
    minHeight: 30,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start'
  }


}));


export default function SoftPhone({
  callVolume, ringVolume, setConnectOnStartToLocalStorage, connectOnStart=false, config
}) {
  const defaultSoftPhoneState = {
    displayCalls: [
      {
        id: 0,
        info: 'Ch 1',
        hold: false,
        muted: 0,
        autoMute: 0,
        inCall: false,
        inAnswer: false,
        inTransfer: false,
        callInfo: 'Ready',
        inAnswerTransfer: false,
        allowTransfer: true,
        transferControl: false,
        allowAttendedTransfer: true,
        transferNumber: '',
        attendedTransferOnline: '',
        inConference: false,
        callNumber: '',
        duration: 0,
        side: '',
        sessionId: '',
      },
      {
        id: 1,
        info: 'Ch 2',
        hold: false,
        muted: 0,
        autoMute: 0,
        inCall: false,
        inAnswer: false,
        inAnswerTransfer: false,
        inConference: false,
        inTransfer: false,
        callInfo: 'Ready',
        allowTransfer: true,
        transferControl: false,
        allowAttendedTransfer: true,
        transferNumber: '',
        attendedTransferOnline: '',
        callNumber: '',
        duration: 0,
        side: '',
        sessionId: '',
      },
      {
        id: 2,
        info: 'Ch 3',
        hold: false,
        muted: 0,
        autoMute: 0,
        inCall: false,
        inConference: false,
        inAnswer: false,
        callInfo: 'Ready',
        inTransfer: false,
        inAnswerTransfer: false,
        Transfer: false,
        allowTransfer: true,
        transferControl: false,
        allowAttendedTransfer: true,
        transferNumber: '',
        attendedTransferOnline: '',
        callNumber: '',
        duration: 0,
        side: '',
        sessionId: '',
      }
    ],
    phoneConnectOnStart: connectOnStart,
    phoneCalls: [],
    connectedPhone: false,
    connectingPhone: false,
    activeCalls: [],
    callVolume,
    ringVolume
  };
  const classes = useStyles();

  const [drawerOpen, drawerSetOpen] = useState(false);
  const [dialState, setdialState] = useState('');
  const [activeChannel, setActiveChannel] = useState(0);
  const [localStatePhone, setLocalStatePhone] = useState(defaultSoftPhoneState);
  const [notificationState, setNotificationState] = React.useState({ open: false, message: '' });
  const notify = (message) => {
    setNotificationState((notification) => ({ ...notification, open: true, message }));
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setNotificationState((notification) => ({ ...notification, open: false }));
  };
  function Alert(props) {
    return ;
  }
  flowRoute.activeChanel = localStatePhone.displayCalls[activeChannel];
  flowRoute.connectedPhone = localStatePhone.connectedPhone;
  flowRoute.engineEvent = (event, payload) => {
    // Listen Here for Engine "UA jssip" events
    switch (event) {
      case 'connecting':
        break;
      case 'connected':
        setLocalStatePhone((prevState) => ({
          ...prevState,
          connectingPhone: false,
          connectedPhone: true
        }));
        break;
      case 'registered':
        break;
      case 'disconnected':
        setLocalStatePhone((prevState) => ({
          ...prevState,
          connectingPhone: false,
          connectedPhone: false
        }));
        break;
      case 'registrationFailed':
        break;

      default:
        break;
    }
  };


  flowRoute.onCallActionConnection = async (type, payload, data) => {
    //  console.log(e);
    switch (type) {
      case 'reinvite':
        // looks like its Attended Transfer
        // Success transfer
        setLocalStatePhone((prevState) => ({
          ...prevState,
          displayCalls: _.map(localStatePhone.displayCalls, (a) => (a.sessionId === payload ? {
            ...a,
            allowAttendedTransfer: true,
            allowTransfer: true,
            inAnswerTransfer: true,
            inTransfer: true,
            attendedTransferOnline: data.request.headers['P-Asserted-Identity'][0].raw.split(' ')[0]

          } : a))
        }));


        break;
      case 'incomingCall':
        // looks like new call its incoming call
        // Save new object with the Phone data of new incoming call into the array with Phone data
        setLocalStatePhone((prevState) => ({
          ...prevState,
          phoneCalls: [
            ...prevState.phoneCalls,
            {
              callNumber: (payload.remote_identity.display_name !== '') ? `${payload.remote_identity.display_name || ''}__${payload.remote_identity.uri.user}__` : payload.remote_identity.uri.user,
              sessionId: payload.id,
              ring: false,
              duration: 0,
              direction: payload.direction
            }
          ]
        }));
        break;
      case 'outgoingCall':
        // looks like new call its outgoing call
        // Create object with the Display data of new outgoing call


        const newProgressLocalStatePhone = _.cloneDeep(localStatePhone);
        newProgressLocalStatePhone.displayCalls[activeChannel] = {
          ...localStatePhone.displayCalls[activeChannel],
          inCall: true,
          hold: false,
          inAnswer: false,
          direction: payload.direction,
          sessionId: payload.id,
          callNumber: payload.remote_identity.uri.user,
          callInfo: 'In out call',
        };
        // Save new object into the array with display calls

        setLocalStatePhone((prevState) => ({
          ...prevState,
          displayCalls: newProgressLocalStatePhone.displayCalls
        }));

        break;
      case 'callEnded':
        // Call is ended, lets delete the call from calling queue
        // Call is ended, lets check and delete the call from  display calls list
        //        const ifExist= _.findIndex(localStatePhone.displayCalls,{sessionId:e.sessionId})
        setLocalStatePhone((prevState) => ({
          ...prevState,
          phoneCalls: localStatePhone.phoneCalls.filter((item) => item.sessionId !== payload),
          displayCalls: _.map(localStatePhone.displayCalls, (a) => (a.sessionId === payload ? {
            ...a,
            inCall: false,
            inAnswer: false,
            hold: false,
            muted: 0,
            inTransfer: false,
            inAnswerTransfer: false,
            allowFinishTransfer: false,
            allowTransfer: true,
            allowAttendedTransfer: true,
            inConference: false,
            callInfo: 'Ready',

          } : a))
        }));
        break;
      case 'callAccepted':
        // Established conection
        // Set caller number for Display calls
        let displayCallId = data.customPayload;
        let acceptedCall = localStatePhone.phoneCalls.filter((item) => item.sessionId === payload);

        if (!acceptedCall[0]) {
          acceptedCall = localStatePhone.displayCalls.filter((item) => item.sessionId === payload);
          displayCallId = acceptedCall[0].id;
        }

        // Call is Established
        // Lets make a copy of localStatePhone Object
        const newAcceptedLocalStatePhone = _.cloneDeep(localStatePhone);
        // Lets check and delete the call from  phone calls list
        const newAcceptedPhoneCalls = newAcceptedLocalStatePhone.phoneCalls.filter((item) => item.sessionId !== payload);
        // Save to the local state
        setLocalStatePhone((prevState) => ({
          ...prevState,
          phoneCalls: newAcceptedPhoneCalls,
          displayCalls: _.map(localStatePhone.displayCalls, (a) => (a.id === displayCallId ? {
            ...a,
            callNumber: acceptedCall[0].callNumber,
            sessionId: payload,
            duration: 0,
            direction: acceptedCall[0].direction,
            inCall: true,
            inAnswer: true,
            hold: false,
            callInfo: 'In call',
          } : a))
        }));

        break;
      case 'hold':

        // let holdCall = localStatePhone.displayCalls.filter((item) => item.sessionId === payload);


        setLocalStatePhone((prevState) => ({
          ...prevState,
          displayCalls: _.map(localStatePhone.displayCalls, (a) => (a.sessionId === payload ? {
            ...a,
            hold: true
          } : a))
        }));
        break;
      case 'unhold':

        setLocalStatePhone((prevState) => ({
          ...prevState,
          displayCalls: _.map(localStatePhone.displayCalls, (a) => (a.sessionId === payload ? {
            ...a,
            hold: false
          } : a))
        }));
        break;
      case 'unmute':


        setLocalStatePhone((prevState) => ({
          ...prevState,
          displayCalls: _.map(localStatePhone.displayCalls, (a) => (a.sessionId === payload ? {
            ...a,
            muted: 0
          } : a))
        }));
        break;
      case 'mute':


        setLocalStatePhone((prevState) => ({
          ...prevState,
          displayCalls: _.map(localStatePhone.displayCalls, (a) => (a.sessionId === payload ? {
            ...a,
            muted: 1
          } : a))
        }));
        break;
      case 'notify':
        notify(payload);
        break;
      default:
        break;
    }
  };
  const handleSettingsSlider = (name) => (e, newValue) => {
    setLocalStatePhone((prevState) => ({
      ...prevState,
      [name]: newValue
    }));

    switch (name) {
      case 'ringVolume':
        ringer.current.volume = parseInt(newValue, 10) / 100;
        // flowRoute.setOutputVolume(newValue);
        break;

      case 'callVolume':
        player.current.volume = parseInt(newValue, 10) / 100;
        break;

      default:
        break;
    }
  };
  const handleConnectPhone = (event, connectionStatus) => {
    try {
      event.persist();
    } catch (e) {
    }
    setLocalStatePhone((prevState) => ({
      ...prevState,
      connectingPhone: true
    }));
    if (connectionStatus === true) {
      flowRoute.start();
    } else {
      flowRoute.stop();
    }

    return true;
  };
  const toggleDrawer = (openDrawer) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    drawerSetOpen(openDrawer);
  };
  const handleDialStateChange = (event) => {
    event.persist();
    setdialState(event.target.value);
  };
  const handleConnectOnStart = (event, newValue) => {
    event.persist();
    setLocalStatePhone((prevState) => ({
      ...prevState,
      phoneConnectOnStart: newValue
    }));

    setConnectOnStartToLocalStorage(newValue);
  };
  const handlePressKey = (event) => {
    event.persist();
    setdialState(dialState + event.currentTarget.value);
  };
  const handleCall = (event) => {
    event.persist();
    flowRoute.call(dialState);
  };
  const handleEndCall = (event) => {
    event.persist();
    flowRoute.hungup(localStatePhone.displayCalls[activeChannel].sessionId);
  };
  const handleHold = (sessionId, hold) => {
    if (hold === false) {
      flowRoute.hold(sessionId);
    } else if (hold === true) {
      flowRoute.unhold(sessionId);
    }
  };
  const handleAnswer = (event) => {
    flowRoute.answer(event.currentTarget.value);
  };
  const handleReject = (event) => {
    flowRoute.hungup(event.currentTarget.value);
  };
  const handleMicMute = () => {
    flowRoute.setMicMuted();
  };
  const handleCallTransfer = () => {
    const newCallTransferDisplayCalls = _.map(localStatePhone.displayCalls, (a) => (a.id === activeChannel ? {
      ...a,
      transferNumber: dialState,
      inTransfer: true,
      allowAttendedTransfer: false,
      allowFinishTransfer: false,
      allowTransfer: false,
      callInfo: 'Transfering...',
    } : a));
    setLocalStatePhone((prevState) => ({
      ...prevState,
      displayCalls: newCallTransferDisplayCalls
    }));
    flowRoute.activeCall.sendDTMF(`##${dialState}`);
  };


  const handleCallAttendedTransfer = (event) => {
    switch (event) {
      case 'transfer':
        setLocalStatePhone((prevState) => ({
          ...prevState,
          displayCalls: _.map(localStatePhone.displayCalls, (a) => (a.id === activeChannel ? {
            ...a,
            transferNumber: dialState,
            allowAttendedTransfer: false,
            allowTransfer: false,
            transferControl: true,
            allowFinishTransfer: false,
            callInfo: 'Attended Transfering...',
            inTransfer: true,
          } : a))
        }));
        flowRoute.activeCall.sendDTMF(`*2${dialState}`);
        break;
      case 'merge':
        const newCallMergeAttendedTransferDisplayCalls = _.map(localStatePhone.displayCalls, (a) => (a.id === activeChannel ? {
          ...a,
          callInfo: 'Conference',
          inConference: true,
        } : a));
        setLocalStatePhone((prevState) => ({
          ...prevState,
          displayCalls: newCallMergeAttendedTransferDisplayCalls
        }));

        flowRoute.activeCall.sendDTMF('*5');
        break;
      case 'swap':
        flowRoute.activeCall.sendDTMF('*6');
        break;
      case 'finish':
        flowRoute.activeCall.sendDTMF('*4');
        break;
      case 'cancel':
        const newCallCancelAttendedTransferDisplayCalls = _.map(localStatePhone.displayCalls, (a) => (a.id === activeChannel ? {
          ...a,
          transferNumber: dialState,
          allowAttendedTransfer: true,
          allowTransfer: true,
          allowFinishTransfer: false,
          transferControl: false,
          inAnswerTransfer: false,
          callInfo: 'In Call',
          inTransfer: false,
        } : a));
        setLocalStatePhone((prevState) => ({
          ...prevState,
          displayCalls: newCallCancelAttendedTransferDisplayCalls
        }));
        flowRoute.activeCall.sendDTMF('*3');
        break;
      default:
        break;
    }
  };
  const handleSettingsButton = () => {
    flowRoute.tmpEvent();
  };


  useEffect(() => {
    flowRoute.config = config;
    flowRoute.init();
    if (localStatePhone.phoneConnectOnStart) {
      handleConnectPhone(null, true);
    }

    try {
      player.current.defaultMuted = false;
      player.current.autoplay = true;
      player.current.volume = parseInt(localStatePhone.callVolume, 10) / 100;
      // player.volume = this.outputVolume;
      flowRoute.player = player;
      ringer.current.src = '/sound/ringing.mp3';
      ringer.current.loop = true;
      ringer.current.volume = parseInt(localStatePhone.ringVolume, 10) / 100;
      flowRoute.ringer = ringer;
    }catch (e) {

    }
  },
  []);


  return (
    <Page
      className={classes.root}
      title="Phone"
    >

      {/* Phone Button */}
      <label htmlFor="icon-button-file">
        <IconButton
          className={classes.phoneButton}
          color="primary"
          aria-label="call picture"
          component="span"
          variant="contained"
          onClick={toggleDrawer(true)}
        >
          <CallIcon />
        </IconButton>
      </label>

      <Drawer
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="right"
        open={drawerOpen}
        variant="persistent"
      >
        {/* Hide Phone Button */}
        <div style={{ minHeight: 30 }} className={classes.drawerHeader}>
          <IconButton onClick={toggleDrawer(false)}>
            {classes.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Snackbar open={notificationState.open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="warning">
            {' '}
            { notificationState.message}
            {' '}
          </Alert>
        </Snackbar>
        <Divider />
        {/* Call Queue Block */}
        <CallQueue
          calls={localStatePhone.phoneCalls}
          handleAnswer={handleAnswer}
          handleReject={handleReject}
        />

        {/* Swipe Carusel */}
        <SwipeCaruselBlock
          setLocalStatePhone={setLocalStatePhone}
          setActiveChannel={setActiveChannel}
          activeChannel={activeChannel}
          localStatePhone={localStatePhone}
        />

        {/* Main  Div Phone */}
        <div className={classes.phone}>

          {/* Dial number input */}
          <TextField
            value={dialState}
            style={{ textAlign: 'right' }}
            id="standard-basic"
            label="Number"
            fullWidth
            onChange={handleDialStateChange}
          />

          {/* Dial Keypad */}
          <KeypadBlock
            handleCallAttendedTransfer={handleCallAttendedTransfer}
            handleCallTransfer={handleCallTransfer}
            handleMicMute={handleMicMute}
            handleHold={handleHold}
            handleCall={handleCall}
            handleEndCall={handleEndCall}
            handlePressKey={handlePressKey}
            activeChanel={localStatePhone.displayCalls[activeChannel]}
            handleSettingsButton={handleSettingsButton}

          />
        </div>

        <Divider />

        {/* Settings Block */}
        <SettingsBlock
          localStatePhone={localStatePhone}
          handleConnectPhone={handleConnectPhone}
          handleSettingsSlider={handleSettingsSlider}
          handleConnectOnStart={handleConnectOnStart}
        />

        <Divider />

        {/* Status Block */}
        <StatusBlock
          connectedPhone={localStatePhone.connectedPhone}
          connectingPhone={localStatePhone.connectingPhone}
        />
      </Drawer>

      <div hidden>
        <audio preload="auto" ref={player} />
      </div>
      <div hidden>
        <audio preload="auto" ref={ringer} />
      </div>
    </Page>
  );
}

