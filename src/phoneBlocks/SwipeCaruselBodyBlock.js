import React from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import SettingsIcon from '@material-ui/icons/Settings'
import HistoryIcon from '@material-ui/icons/History'
import CallMadeIcon from '@material-ui/icons/CallMade'
import CallReceivedIcon from '@material-ui/icons/CallReceived'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import { Divider, TableCell } from '@material-ui/core'
import { DateTime } from 'luxon'
import SettingsBlock from './SettingsBlock'

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
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
}))

function SwipeCaruselBodyBlock({
  calls,
  localStatePhone,
  handleConnectPhone,
  handleSettingsSlider,
  handleConnectOnStart,
  timelocale
}) {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div>
      <AppBar position='static' color='default'>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
          aria-label='full width tabs example'
        >
          <Tab className={classes.tabs} icon={<SettingsIcon />} label='Settings' {...a11yProps(0)} />
          <Tab className={classes.tabs} icon={<HistoryIcon />} label='History' {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        {/* Settings Block */}
        <SettingsBlock
          localStatePhone={localStatePhone}
          handleConnectPhone={handleConnectPhone}
          handleSettingsSlider={handleSettingsSlider}
          handleConnectOnStart={handleConnectOnStart}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        {calls.length === 0 ? 'No Calls' : (

          <List className={classes.root} subheader={<li />}>
            {calls.map(({
              sessionId, direction, number, time, status
            }) => (
              <li key={`section-${sessionId}`} className={classes.listSection}>
                <ul className={classes.ul}>
                  <ListSubheader style={{ color: status === 'missed' ? 'red' : 'green', fontSize: '0.675rem', lineHeight: '20px' }}>
                    {`${number}`}
                    {' '}
                    {direction === 'outgoing' ? <CallMadeIcon style={{ fontSize: '0.675rem' }} /> : <CallReceivedIcon style={{ fontSize: '0.675rem' }} />}
                    <br />
                    {DateTime.fromISO(time.toISOString()).setZone(timelocale).toString()}
                    <Divider />
                  </ListSubheader>
                </ul>
              </li>
            ))}
          </List>

        )}
      </TabPanel>
    </div>
  )
}

export default SwipeCaruselBodyBlock
