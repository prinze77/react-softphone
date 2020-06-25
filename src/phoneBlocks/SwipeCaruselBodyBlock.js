import React from 'react';
import {
  AppBar,
  Tabs,
  Divider,
  Tab,
  makeStyles,
  ListSubheader,
  List,
  Box,
  Typography
} from '@material-ui/core';

import {
  Settings as SettingsIcon,
  History as HistoryIcon,
  CallMade as CallMadeIcon,
  CallReceived as CallReceivedIcon
} from '@material-ui/icons';

import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import SettingsBlock from './SettingsBlock';

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
const useStyles = makeStyles((theme) => ({
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
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300
  },
  listSection: {
    backgroundColor: 'inherit'
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0
  }
}));

function SwipeCaruselBodyBlock({
  calls,
  localStatePhone,
  handleConnectPhone,
  handleSettingsSlider,
  handleConnectOnStart,
  handleNotifications,
  timelocale
}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab
            className={classes.tabs}
            icon={<SettingsIcon />}
            label="Settings"
            {...a11yProps(0)}
          />
          <Tab
            className={classes.tabs}
            icon={<HistoryIcon />}
            label="History"
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        {/* Settings Block */}
        <SettingsBlock
          localStatePhone={localStatePhone}
          handleConnectPhone={handleConnectPhone}
          handleSettingsSlider={handleSettingsSlider}
          handleConnectOnStart={handleConnectOnStart}
          handleNotifications={handleNotifications}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        {calls.length === 0 ? (
          'No Calls'
        ) : (
          <List className={classes.root} subheader={<li />}>
            {calls.map(({
              sessionId, direction, number, time, status
            }) => (
              <li key={`section-${sessionId}`} className={classes.listSection}>
                <ul className={classes.ul}>
                  <ListSubheader
                    style={{
                      color: status === 'missed' ? 'red' : 'green',
                      fontSize: '0.675rem',
                      lineHeight: '20px'
                    }}
                  >
                    {`${number}`}
                    {' '}
                    {direction === 'outgoing' ? (
                      <CallMadeIcon style={{ fontSize: '0.675rem' }} />
                    ) : (
                      <CallReceivedIcon style={{ fontSize: '0.675rem' }} />
                    )}
                    <br />
                    {DateTime.fromISO(time.toISOString())
                      .setZone(timelocale)
                      .toString()}
                    <Divider />
                  </ListSubheader>
                </ul>
              </li>
            ))}
          </List>
        )}
      </TabPanel>
    </div>
  );
}


SwipeCaruselBodyBlock.propTypes = {
  calls: PropTypes.any,
  localStatePhone: PropTypes.any,
  handleConnectPhone: PropTypes.any,
  handleSettingsSlider: PropTypes.any,
  handleConnectOnStart: PropTypes.any,
  handleNotifications: PropTypes.any,
  callVolume: PropTypes.any,
  timelocale: PropTypes.any

};
TabPanel.propTypes = {
  props: PropTypes.any,


};
export default SwipeCaruselBodyBlock;
