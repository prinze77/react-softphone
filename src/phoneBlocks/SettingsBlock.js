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
  CircularProgress
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: '256px',
    padding: '27px'
  },
  sliderIcons: {
    marginRight: '10px', color: '#546e7a'
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
        <Grid item xs={3}>
          {sliderValue.ringVolume === 0
            ? <NotificationsOff className={classes.sliderIcons} />
            : <NotificationsActive className={classes.sliderIcons} />}
        </Grid>
        <Grid item xs={9}>
          <Slider value={sliderValue.ringVolume} onChange={handleSettingsSliderState('ringVolume')} aria-labelledby="continuous-slider" />
        </Grid>

        <Grid item xs={3}>
          {sliderValue.callVolume === 0
            ? <VolumeOff className={classes.sliderIcons} />
            : <VolumeUp className={classes.sliderIcons} />}
        </Grid>
        <Grid item xs={9}>
          <Slider value={sliderValue.callVolume} onChange={handleSettingsSliderState('callVolume')} aria-labelledby="continuous-slider" />
        </Grid>


        <FormControl component="fieldset" className={classes.sliderIcons}>
          <FormGroup aria-label="position" row>
            <FormControlLabel
              value="top"
              control={<Switch checked={notifications} color="primary" onChange={handleNotifications} />}
              label="Notifications"
              labelPlacement="start"
            />
            <FormControlLabel
              value="top"
              control={<Switch checked={phoneConnectOnStart} color="primary" onChange={handleConnectOnStart} />}
              label="Auto Connect"
              labelPlacement="start"
            />

            <FormControlLabel
              value="top"
              control={<Switch disabled={connectingPhone} checked={connectedPhone} color="primary" onChange={handleConnectPhone} />}
              label={connectedPhone ? 'Disconnect' : 'Connect'}
              labelPlacement="start"
            />
            {connectingPhone ? <CircularProgress size={25} /> : ''}

          </FormGroup>
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
