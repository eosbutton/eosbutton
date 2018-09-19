import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { secondsToShortString } from '../../helpers';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import MenuIcon from '@material-ui/icons/Menu';
import grey from '@material-ui/core/colors/grey';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import eosButtonIcon from '../../images/eos-button-icon.png';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };
  }

  getEbtBalanceString = () => {
    if (this.props.ebtBalance) {
      return this.props.ebtBalance;
    } else {
      return '0 EBT';
    }
  }

  getEosBalanceString = () => {
    if (this.props.eosBalance) {
      return this.props.eosBalance;
    } else {
      return '0 EOS';
    }
  }

  renderAppBar = () => { return (
    <div>
            <AppBar color="inherit">
              <Toolbar>
                <Link to={process.env.PUBLIC_URL + '/'}>
                  <img
                    src={eosButtonIcon}
                    style={{
                      height: '5vh',
                    }}
                  />
                </Link>
                <div style={{width: "10px"}}></div>
                <Button
                  component={Link}
                  to={process.env.PUBLIC_URL + '/'}
                  style={{
                    color: grey[600],
                    textTransform: "none",
                  }}
                >
                  <Typography variant="title" style={{flex: 1, color: grey[600]}}>
                    EOS Button
                  </Typography>
                </Button>
                <div style={{width: "10px"}}></div>
                <Button
                  /*
                  component={Link}
                  to={process.env.PUBLIC_URL + '/eos-game'}
                  */
                  style={{
                    color: grey[500],
                    textTransform: "none",
                    cursor: "not-allowed",
                  }}
                >
                  Play with EOS (Launch in early August)
                </Button>
                {this.props.ebtHasLaunched || true?
                  <Button
                    component={Link}
                    to={process.env.PUBLIC_URL + '/ebt-game'}
                    style={{
                      color: grey[600],
                      textTransform: "none",
                    }}
                  >
                    Play with EBT
                  </Button>
                :
                  <Button
                    style={{
                      color: grey[500],
                      textTransform: "none",
                      cursor: "not-allowed",
                    }}
                  >
                    {'Play with EBT (Launch on July 21)'}
                  </Button>
                }
                <Button
                  component={Link}
                  to={process.env.PUBLIC_URL + '/airdrop'}
                  style={{
                    color: grey[600],
                    textTransform: "none",
                  }}
                >
                  Airdrop
                </Button>
                {/*
                <Button
                  component={Link}
                  to={process.env.PUBLIC_URL + '/how-to-play'}
                  style={{
                    color: grey[600],
                    textTransform: "none",
                  }}
                >
                  How to play
                </Button>
                */}
                <Button
                  component={Link}
                  to={process.env.PUBLIC_URL + '/about'}
                  style={{
                    color: grey[600],
                    textTransform: "none",
                  }}
                >
                  About
                </Button>
                <Button
                  style={{
                    color: grey[600],
                    textTransform: "none",
                  }}
                  href='https://discord.gg/ZhyK6xU'
                  rel='nofollow'
                  target='_blank'
                >
                    Discord
                </Button>
                <div style={{flex: 1}}></div>
                {this.props.account?
                  <div>
                  <Button
                    component={Link}
                    to={process.env.PUBLIC_URL + '/account'}
                    style={{
                      color: grey[600],
                      textTransform: "none",
                    }}
                  >
                    {this.props.account.name + ' (' + this.getEbtBalanceString() + ' | ' + this.getEosBalanceString() + ')'}
                  </Button>
                  {/*
                  <Button
                    style={{
                      color: grey[600],
                      textTransform: "none",
                    }}
                    onClick={this.props.onScatterLogout}
                  >
                    Logout
                  </Button>
                  */}
                  </div>
                :
                  <Button
                    style={{
                      color: grey[600],
                      textTransform: "none",
                    }}
                    onClick={this.props.onScatterLogin}
                  >
                    Login with Scatter
                  </Button>
                }
              </Toolbar>
            </AppBar>
    </div>
  );}

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  renderCollapsedAppBar = () => { return (
    <div>
            <AppBar color="inherit">
              <Toolbar>
                <Link to={process.env.PUBLIC_URL + '/'}>
                  <img
                    src={eosButtonIcon}
                    style={{
                      height: '5vh',
                    }}
                  />
                </Link>
                <div style={{width: "10px"}}></div>
                <Button
                  component={Link}
                  to={process.env.PUBLIC_URL + '/'}
                  style={{
                    color: grey[600],
                    textTransform: "none",
                  }}
                >
                  <Typography variant="title" style={{flex: 1, color: grey[600]}}>
                    EOS Button
                  </Typography>
                </Button>
                <div style={{flex: 1}}></div>
                <IconButton
                  onClick={(event) => {this.setState({anchorEl: event.currentTarget})}}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={this.state.anchorEl}
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleClose}
                >
                  <Link
                    to={process.env.PUBLIC_URL + '/'}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <MenuItem
                      style={{
                        color: grey[600],
                        cursor: "not-allowed",
                      }}
                      onClick={this.handleClose}
                    >
                      Play with EOS (Launch in early August)
                    </MenuItem>
                  </Link>
                  {this.props.ebtHasLaunched || true?
                  <Link
                    to={process.env.PUBLIC_URL + '/ebt-game'}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <MenuItem
                      style={{
                        color: grey[600],
                      }}
                      onClick={this.handleClose}
                    >
                      Play with EBT
                    </MenuItem>
                  </Link>
                  :
                  <Link
                    to={process.env.PUBLIC_URL + '/'}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <MenuItem
                      style={{
                        color: grey[600],
                        cursor: "not-allowed",
                      }}
                      onClick={this.handleClose}
                    >
                      {'Play with EBT (Launch in ' + secondsToShortString(this.props.ebtRemainingTimeToLaunch/1000) + ')'}
                    </MenuItem>
                  </Link>
                  }
                  <Link
                    to={process.env.PUBLIC_URL + '/airdrop'}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <MenuItem
                      style={{
                        color: grey[600],
                      }}
                      onClick={this.handleClose}
                    >
                      Airdrop
                    </MenuItem>
                  </Link>
                  <Link
                    to={process.env.PUBLIC_URL + '/about'}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <MenuItem
                      style={{
                        color: grey[600],
                      }}
                      onClick={this.handleClose}
                    >
                      About
                    </MenuItem>
                  </Link>
                  <a
                    href='https://discord.gg/ZhyK6xU'
                    rel='nofollow'
                    target='_blank'
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <MenuItem
                      style={{
                        color: grey[600],
                      }}
                      onClick={this.handleClose}
                    >
                      Discord
                    </MenuItem>
                  </a>
                  {this.props.account?
                  <div>
                  <Link
                    to={process.env.PUBLIC_URL + '/account'}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <MenuItem
                      style={{
                        color: grey[600],
                      }}
                      onClick={this.handleClose}
                    >
                      {this.props.account.name + ' (' + this.getEbtBalanceString() + ' | ' + this.getEosBalanceString() + ')'}
                    </MenuItem>
                  </Link>
                  <MenuItem
                    style={{
                      color: grey[600],
                    }}
                    onClick={() => {
                      this.handleClose();
                      this.props.onScatterLogout();
                    }}
                  >
                    Logout
                  </MenuItem>
                  </div>
                  :
                  <MenuItem
                    style={{
                      color: grey[600],
                    }}
                    onClick={() => {
                      this.handleClose();
                      this.props.onScatterLogin();
                    }}
                  >
                    Login with Scatter
                  </MenuItem>
                  }
                </Menu>
              </Toolbar>
            </AppBar>
    </div>
  );}

  render() {
    return (
      <div>
          <div style={{flexGrow: 1}}>
            {window.innerWidth >= 1280?
              this.renderAppBar()
            :
              this.renderCollapsedAppBar()
            }
            <div style={{height: "65px"}}></div>
            <div style={{height: "20px"}}></div>
          </div>
      </div>
    );
  }
}

export default connect(
  state => {
    let account = null;

    if (state.scatter.identity && state.scatter.identity.accounts && state.scatter.identity.accounts[0]) {
      account = state.scatter.identity.accounts[0];
    }

    return {
      account,
      ebtBalance: state.api.accounts && state.api.accounts.balance,
      eosBalance: state.api.accstatesAccount && state.api.accstatesAccount.eos_balance,
      launchTime: state.general.launchTime,
      ebtRemainingTimeToLaunch: state.general.ebtRemainingTimeToLaunch,
      ebtHasLaunched: state.general.ebtHasLaunched,
    };
  },
  {
  }
)(NavBar);
