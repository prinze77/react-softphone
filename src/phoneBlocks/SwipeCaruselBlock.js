import React from 'react';
import SwipeableViews from 'react-swipeable-views';

import {
  Typography,
  Box,
  AppBar,
  Tabs,
  Tab,
  makeStyles,


} from '@material-ui/core';
import PropTypes from 'prop-types';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  };
}

const useStyles = makeStyles(() => {
  return {
    tabs: {
      textTransform: 'none',
      minWidth: '25%',
      marginRight: 'auto',
      // marginRight: theme.spacing(4),
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
      ].join(','),
      '&:hover': {
        color: '#40a9ff',
        opacity: 1
      },
      '&:focus': {
        color: '#40a9ff'
      }
    },
    tabPanelHold: {
      backgroundColor: '#ff8686',
    },
    tabPanelActive: {
      backgroundColor: '#8bff87',
    },
    text: {
      color: 'black',
    }

  };
});

function SwipeCaruselBlock({
  localStatePhone, activeChannel, setActiveChannel
}) {
  const classes = useStyles();
  const [duration, setDuration] = React.useState(
    [{
      duration: 0,
    },
    {
      duration: 0,
    },
    {
      duration: 0,
    }]
  );
  const [intervals, setintervals] = React.useState(
    [{
      intrId: 0,
      active: false
    },
    {
      intrId: 0,
      active: false
    },
    {
      intrId: 0,
      active: false
    }
    ]
  );
  const { displayCalls } = localStatePhone;
  const handleTabChangeIndex = (index) => {
    setActiveChannel(index);
  };
  const handleTabChange = (event, newValue) => {
    setActiveChannel(newValue);
  };


  displayCalls.map((displayCall, key) => {
    // if Call just started then increment duration every one second
    if (displayCall.inCall === true
      && displayCall.inAnswer === true && intervals[key].active === false) {
      const intr = setInterval(() => {
        setDuration((durations) => ({
          ...durations,
          [key]: { duration: durations[key].duration + 1 }
        }));
      }, 1000);

      setintervals((inter) => ({ ...inter, [key]: { intrId: intr, active: true } }));
    }
    // if Call ended  then stop  increment duration every one second
    if (displayCall.inCall === false
      && displayCall.inAnswer === false && intervals[key].active === true) {
      clearInterval(intervals[key].intrId);
      setDuration((durations) => ({ ...durations, [key]: { duration: 0 } }));
      setintervals((inter) => ({ ...inter, [key]: { intrId: 0, active: false } }));
    }
    return true;
  });

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={activeChannel}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab className={classes.tabs} label="CH 1" {...a11yProps(0)} />
          <Tab className={classes.tabs} label="CH 2" {...a11yProps(1)} />
          <Tab className={classes.tabs} label="Ch 3" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis="x"
        index={activeChannel}
        onChangeIndex={handleTabChangeIndex}
      >

        {displayCalls.map((displayCall, key) => (
          <TabPanel
            key={`${displayCall.id}-TabPanel`}
            className={displayCall.hold ? classes.tabPanelHold : classes.tabPanelActive}
            value={key}
            index={displayCall.id}
          >
            {() => {
              if (displayCall.inCall === true) {
                if (displayCall.inAnswer === true) {
                  if (displayCall.hold === true) {
                    return (
                      // Show hold Call info
                      <div className={classes.text}>
                        <Typography>
                          Status:
                          {' '}
                          {displayCall.callInfo}
                        </Typography>
                        <Typography>
                          Duration:
                          {duration[key].duration}
                        </Typography>
                        <Typography>
                          Number:
                          {displayCall.callNumber}
                        </Typography>
                        <Typography>
                          Side:
                          {displayCall.direction}
                        </Typography>
                      </div>
                    );
                  }
                  if (displayCall.inTransfer === true) {
                    return (
                      // Show In Transfer info
                      <div className={classes.text}>
                        <Typography>
                          Status:
                          {' '}
                          {displayCall.callInfo}
                        </Typography>
                        <Typography>
                          Side:
                          {displayCall.direction}
                        </Typography>
                        <Typography>
                          Duration:
                          {duration[key].duration}
                        </Typography>
                        <Typography>
                          Number:
                          {' '}
                          {displayCall.callNumber}
                        </Typography>
                        <Typography>
                          Transfer to :
                          {' '}
                          {displayCall.transferNumber}
                        </Typography>
                        <Typography>
                          {displayCall.attendedTransferOnline.length > 1
                          && !displayCall.inConference ? (
                            <span>
                              { 'Talking with :' }
                              {' '}
                              {displayCall.attendedTransferOnline}
                            </span>
                            ) : null}
                        </Typography>

                      </div>
                    );
                  }

                  return (
                    // Show In Call info
                    <div className={classes.text}>
                      <Typography>
                        Status:
                        {displayCall.callInfo}
                      </Typography>
                      <Typography>
                        Side:
                        {displayCall.direction}
                      </Typography>
                      <Typography>
                        Duration:
                        {duration[key].duration}
                      </Typography>
                      <Typography>
                        Number:
                        {displayCall.callNumber}
                      </Typography>

                    </div>
                  );
                }

                return (
                  // Show Calling info
                  <div className={classes.text}>
                    <Typography>
                      Status:
                      {' '}
                      {displayCall.callInfo}
                    </Typography>
                    <Typography>
                      Side:
                      {' '}
                      {displayCall.direction}
                    </Typography>
                    <Typography>
                      Number:
                      {' '}
                      {displayCall.callNumber}
                    </Typography>

                  </div>
                );
              }

              return (
                // Show Ready info
                <div className={classes.text}>
                  <Typography>
                    Status:
                    {' '}
                    {displayCall.callInfo}
                    {' '}
                    {displayCall.info}
                  </Typography>

                </div>
              );
            }}

          </TabPanel>
        ))}


      </SwipeableViews>
    </div>
  );
}

SwipeCaruselBlock.propTypes = {
  localStatePhone: PropTypes.any,
  activeChannel: PropTypes.any,
  setActiveChannel: PropTypes.any


};
export default SwipeCaruselBlock;
