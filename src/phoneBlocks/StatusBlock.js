import Grid from '@material-ui/core/Grid';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Label from './Label';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  online: {
    color: 'green',
    backgroundColor: '#d0f6bb'
  },
  offline: {
    color: 'red',
    backgroundColor: '#f6bbbb'
  }
}));

function StatusBlock({ connectingPhone, connectedPhone }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid container direction="row" justify="flex-start" alignItems="center" style={{ flexGrow: 0, maxWidth: '50%', flexBasis: '50%' }}>
          <Typography id="continuous-slider">STATUS</Typography>
        </Grid>
        <Grid container direction="row" justify="flex-end" alignItems="center" style={{ flexGrow: 0, maxWidth: '50%', flexBasis: '50%' }}>
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

StatusBlock.propTypes = {
  connectingPhone: PropTypes.any,
  connectedPhone: PropTypes.any,
};

export default StatusBlock;
