import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  VolumeUp,
  VolumeOff,
  NotificationsActive,
  NotificationsOff
} from '@material-ui/icons';
import {
  Grid,
  FormControl,
  FormGroup,
  FormControlLabel,
  Slider,
  Switch,
  LinearProgress
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
  },
  sliderIcons: {
    marginRight: '10px', color: '#546e7a'
  },
  tab: {
    '& .MuiBox-root': {
      padding: theme.spacing(2),
    },
  },
  form: {
    margin: 0,
  },
  label: {
    margin: 0,
    padding: '0 8px',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  switch: {
    marginRight: '-8px'
  }
}));

function SettingsBlock({
  localStatePhone,
  handleConnectPhone,
  handleConnectOnStart,
  handleNotifications,
  handleSettingsSlider
}) {
  const classes = useStyles();

  const {
    connectedPhone, connectingPhone, phoneConnectOnStart, notifications, ringVolume, callVolume
  } = localStatePhone;

  const [sliderValue, setSliderValue] = React.useState({
    ringVolume,
    callVolume
  });

  const handleSettingsSliderState = (name) => (e, newValue) => {
    setSliderValue((prevState) => ({
      ...prevState,
      [name]: newValue
    }));

    handleSettingsSlider(name, newValue);
  };

  return (

    <div className={classes.root}>
      <Grid
        container
        spacing={2}
      >
        <Grid container direction="row" justify="space-between" alignItems="center" style={{ margin: '8px 16px 8px 8px' }}>
          {sliderValue.ringVolume === 0
            ? <NotificationsOff className={classes.sliderIcons} />
            : <NotificationsActive className={classes.sliderIcons} />}
          <Slider value={sliderValue.ringVolume} onChange={handleSettingsSliderState('ringVolume')} aria-labelledby="continuous-slider" style={{ width: 'calc(100% - 34px)' }} />
        </Grid>
        <Grid container direction="row" justify="space-between" alignItems="center" style={{ margin: '8px 16px 8px 8px' }}>
          {sliderValue.callVolume === 0
            ? <VolumeOff className={classes.sliderIcons} />
            : <VolumeUp className={classes.sliderIcons} />}
          <Slider value={sliderValue.callVolume} onChange={handleSettingsSliderState('callVolume')} aria-labelledby="continuous-slider" style={{ width: 'calc(100% - 34px)' }} />
        </Grid>
        <FormControl component="fieldset" className={classes.form}>
          <FormGroup aria-label="position" row>
            <FormControlLabel
              value="top"
              control={<Switch className={classes.switch} checked={notifications} color="primary" onChange={handleNotifications} />}
              label="Notifications"
              labelPlacement="start"
              className={classes.label}
            />
            <FormControlLabel
              value="top"
              control={<Switch className={classes.switch} checked={phoneConnectOnStart} color="primary" onChange={handleConnectOnStart} />}
              label="Auto Connect"
              labelPlacement="start"
              className={classes.label}
            />

            <FormControlLabel
              value="top"
              control={<Switch className={classes.switch} disabled={connectingPhone} checked={connectedPhone} color="primary" onChange={handleConnectPhone} />}
              label={connectedPhone ? 'Disconnect' : 'Connect'}
              labelPlacement="start"
              className={classes.label}
            />

          </FormGroup>
          {connectingPhone ? <LinearProgress /> : ''}
        </FormControl>

      </Grid>

    </div>

  );
}
SettingsBlock.propTypes = {
  localStatePhone: PropTypes.any,
  handleConnectPhone: PropTypes.any,
  handleConnectOnStart: PropTypes.any,
  handleSettingsSlider: PropTypes.any,
  handleNotifications: PropTypes.any

};

export default SettingsBlock;
