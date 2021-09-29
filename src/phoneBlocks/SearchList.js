import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import {
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Paper,
  Popover
} from '@material-ui/core'
import { Search } from '@material-ui/icons'
import OnlineIndicator from './OnlineIndicator'

const useStyles = makeStyles((theme) => ({
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
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}))

function SearchList({
  asteriskAccounts = [],
  onClickList,
  ariaDescribedby,
  anchorEl,
  setAnchorEl
}) {
  const classes = useStyles()
  const [list, setList] = React.useState(asteriskAccounts)
  const [inputSearch, setInputSearch] = useState('')
  const open = Boolean(anchorEl)
  const id = open ? `${ariaDescribedby}` : undefined
  const handleClose = () => setAnchorEl(null)
  const handleClick = (value) => {
    onClickList(value)
    setAnchorEl(null)
  }

  useEffect(() => {
    const searchedAccounts = asteriskAccounts
      .filter((acc) => acc.label.toLowerCase()
        .includes(inputSearch.toLowerCase()) || acc.accountId
        .includes(inputSearch))
    setList(searchedAccounts)
  }, [inputSearch, asteriskAccounts])
  return (
    <>
      { open ? (
        <Popover
          id={id}
          open={open}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <List component='nav' className={classes.list} aria-label='accounts'>
            <ListItem>
              <ListItemText primary={(
                <Paper style={{ padding: '5px' }}>
                  <InputBase
                    id='inputSearch'
                    className={classes.input}
                    placeholder='Search'
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={(event) => setInputSearch(event.target.value)}
                    defaultValue={inputSearch}
                  />
                  <IconButton type='submit' className={classes.iconButton} aria-label='search'>
                    <Search />
                  </IconButton>
                </Paper>
              )}
              />
            </ListItem>
            <Divider />
            {list.map((account) => (
              <ListItem
                button
                key={account.accountId}
                onClick={() => handleClick(account.accountId)}
              >
                <ListItemText primary={(
                  <span className={classes.flexBetween}>
                    {account.label}
                    {' '}
                    {account.accountId}
                    {' '}
                    <div className={classes.status}>
                      <OnlineIndicator
                        size='small'
                        status={account.online === 'true' ? 'online' : 'busy'}
                      />
                    </div>
                  </span>
                )}
                />
              </ListItem>
            ))}
          </List>
        </Popover>
      ) : null }
    </>
  )
}
SearchList.propTypes = {
  asteriskAccounts: PropTypes.any,
  onClickList: PropTypes.any,
  ariaDescribedby: PropTypes.any,
  anchorEl: PropTypes.any,
  setAnchorEl: PropTypes.any
}
export default SearchList
