import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  VolumeUp, VolumeOff, NotificationsActive, NotificationsOff
} from '@material-ui/icons';
import {
  Grid, FormControl, FormGroup, FormControlLabel, Slider, Switch, CircularProgress
} from '@material-ui/core';

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
  handleSettingsSlider,
  handleConnectOnStart
}) {
  const classes = useStyles();

  const {
    callVolume, ringVolume, connectedPhone, connectingPhone, phoneConnectOnStart
  } = localStatePhone;

  return (


    <div className={classes.root}>
      <Grid
        container
        spacing={2}
      >
        <Grid item xs={3}>
          {ringVolume === 0 ? <NotificationsOff className={classes.sliderIcons} /> : <NotificationsActive className={classes.sliderIcons} />}
        </Grid>
        <Grid item xs={9}>
          <Slider value={ringVolume} onChange={handleSettingsSlider('ringVolume')} aria-labelledby="continuous-slider" />
        </Grid>

        <Grid item xs={3}>
          {callVolume === 0 ? <VolumeOff className={classes.sliderIcons} /> : <VolumeUp className={classes.sliderIcons} />}
        </Grid>
        <Grid item xs={9}>
          <Slider value={callVolume} onChange={handleSettingsSlider('callVolume')} aria-labelledby="continuous-slider" />
        </Grid>


        <FormControl component="fieldset" className={classes.sliderIcons}>
          <FormGroup aria-label="position" row>
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


export default SettingsBlock;
