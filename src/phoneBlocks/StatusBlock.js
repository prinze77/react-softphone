import Grid from '@material-ui/core/Grid';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Label from './Label';


const useStyles = makeStyles(() => ({
  root: {
    maxWidth: '256px',
    padding: '27px'
  },
  online: {
    color: 'green',
    backgroundColor: '#d0f6bb'

  },
  offline: {
    color: 'red',
    backgroundColor: '#f6bbbb'

  },
}));


function StatusBlock({ connectingPhone ,connectedPhone}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={5}>
        <Grid item xs={5}>
          <Typography id="continuous-slider" gutterBottom>STATUS</Typography>
        </Grid>
        <Grid item xs={3}>
          {
            !connectingPhone ? (connectedPhone
              ? <Label className={classes.online} color="primary">ONLINE</Label>
              : <Label className={classes.offline} color="primary">OFFLINE</Label>
            ) : (!connectedPhone
              ? <Label className={classes.online} color="primary">CONNECTING</Label>
              : <Label className={classes.offline} color="primary">DISCONNECTING</Label>)
          }
        </Grid>
      </Grid>
    </div>

  );
}


export default StatusBlock;
