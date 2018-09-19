import React, { Component } from 'react';
import { connect } from 'react-redux';
import { secondsToString } from '../../helpers';
import { pushEosTransfer, pushWithdraw } from '../../actions/api';
import grey from '@material-ui/core/colors/grey';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ButterToast, { CinnamonSugar } from 'butter-toast';
import has from 'lodash/has';

class AccountPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      depositQuantity: 0,
      withdrawQuantity: 0,
    };
  }

  handleDeposit = () => {
    if (!this.props.eos || !this.props.account) {
      this.raiseLocalToast(
        'Please login with Scatter',
        '',
        'orange',
        'user-o',
      );
      return;
    }

    if (!this.quantityIsValid(this.state.depositQuantity)) {
      this.raiseLocalToast(
        'Quantity invalid',
        '',
        'orange',
        'ban',
      );
      return;
    }

    this.props.pushEosTransfer(this.props.eos, this.props.account.name, this.getQuantityString(this.state.depositQuantity), this.props.account.name + '@' + this.props.account.authority, (response) => {
      let r = response;
      if (typeof response !== 'object') {
        r = JSON.parse(response);
      }
      if (has(r, 'error')) {
        this.raiseLocalToast(
          r.message,
          r.error.name + ': ' + r.error.what,
          'red',
          'close',
        );
      } else if (has(r, 'isError')) {
        this.raiseLocalToast(
          r.type,
          r.message,
          'red',
          'close',
        );
      } else {
        this.raiseLocalToast(
          'Successfully deposited',
          '',
          'green',
          'check',
        );
      }
    });
  }

  handleWithdraw = () => {
    if (!this.props.eos || !this.props.account) {
      this.raiseLocalToast(
        'Please login with Scatter',
        '',
        'orange',
        'user-o',
      );
      return;
    }

    if (!this.quantityIsValid(this.state.withdrawQuantity)) {
      this.raiseLocalToast(
        'Quantity invalid',
        '',
        'orange',
        'ban',
      );
      return;
    }

    this.props.pushWithdraw(this.props.eos, this.props.account.name, this.getQuantityString(this.state.withdrawQuantity), this.props.account.name + '@' + this.props.account.authority, (response) => {
      let r = response;
      if (typeof response !== 'object') {
        r = JSON.parse(response);
      }
      if (has(r, 'error')) {
        this.raiseLocalToast(
          r.message,
          r.error.name + ': ' + r.error.what,
          'red',
          'close',
        );
      } else if (has(r, 'isError')) {
        this.raiseLocalToast(
          r.type,
          r.message,
          'red',
          'close',
        );
      } else {
        this.raiseLocalToast(
          'Successfully withdrawn',
          '',
          'green',
          'check',
        );
      }
    });
  }

  raiseLocalToast(title, message, theme, icon) {
    const toast = CinnamonSugar.crunch({
      name: 'local',
      title: title,
      message: message,
      theme: theme,
      icon: icon,
      toastTimeout: 5000,
    });

    ButterToast.raise(toast)
  }

  quantityIsValid = (q) => {
    if (parseFloat(q) > 0) {
      return true;
    }
      return false;
  }

  getQuantityString = (q) => {
    if (this.quantityIsValid(q)) {
      return parseFloat(q).toFixed(4) + ' EOS';
    } else {
      return '0.0000 EOS';
    }
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

  render() {
    return (
      <div>
            <ButterToast
              name="local"
              trayPosition="top-center"
              pauseOnHover
            />
        <Grid
          container
          justify="space-around"
        >
          <Grid
            item
            xs={6}
          >
            <Paper
              style={{
                padding: '10%',
                color: grey[600],
              }}
            >
            <div
              style={{
                fontSize: '400%',
                textAlign: 'center',
              }}
            >
              {'Account'}
            </div>
            <br />
      <Table>
        <TableHead>
              <TableRow>
                <TableCell>
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
        </TableHead>
        <TableBody>
              <TableRow>
                <TableCell>
                  {'Name'}
                </TableCell>
                <TableCell>
                  {this.props.account && this.props.account.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {'EBT Balance'}
                </TableCell>
                <TableCell>
                  {this.getEbtBalanceString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {'EOS Balance'}
                </TableCell>
                <TableCell>
                  {this.getEosBalanceString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {'Referral link'}
                </TableCell>
                <TableCell>
                  {this.props.account && "https://eosbutton.io/?ref=" + encodeURIComponent(btoa(this.props.account.name))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div
                    style={{
                      color: grey[500],
                    }}
                  >
                    {'Referral link Note'}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    style={{
                      color: grey[500],
                    }}
                  >
                    {'Every time your referee presses the button, BOTH the referrer and referee will get 5% extra shares.'}
                    <br />
                    {'You can invite your friends with your referral link even before launch. Data will be stored and you will get extra shares when your referee presses the button after the launch.'}
                    <br />
                    {'Referrer must keep a positive balance in the account all the time, otherwise both the referrer and referee may not get the extra shares.'}
                  </div>
                </TableCell>
              </TableRow>
        </TableBody>
      </Table>
                <br />
                <br />
                {this.props.account?
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{
                      textTransform: "none",
                    }}
                    onClick={this.props.onScatterLogout}
                  >
                    {'Logout'}
                  </Button>
                :
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      textTransform: "none",
                    }}
                    onClick={this.props.onScatterLogin}
                  >
                    {'Login with Scatter'}
                  </Button>
                }
            </Paper>
            <br />
{/*
            <Paper
              style={{
                padding: '10%',
                color: grey[600],
              }}
            >
            <div
              style={{
                fontSize: '400%',
                textAlign: 'center',
              }}
            >
              {'Deposit / Withdraw'}
            </div>
      <Table>
        <TableHead>
              <TableRow>
                <TableCell>
                </TableCell>
                <TableCell>
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
        </TableHead>
        <TableBody>
              <TableRow>
                <TableCell>
                  {'Deposit'}
                </TableCell>
                <TableCell>
                  <TextField
                    label="EOS"
                    defaultValue={this.state.depositQuantity}
                    onChange={(e)=>{this.setState({depositQuantity: e.target.value})}}
                    type="number"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      textTransform: "none",
                    }}
                    onClick={this.handleDeposit}
                  >
                    {'Deposit'}
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {'Withdraw'}
                </TableCell>
                <TableCell>
                  <TextField
                    label="EOS"
                    defaultValue={this.state.withdrawQuantity}
                    onChange={(e)=>{this.setState({withdrawQuantity: e.target.value})}}
                    type="number"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{
                      textTransform: "none",
                    }}
                    onClick={this.handleWithdraw}
                  >
                    {'Withdraw'}
                  </Button>
                </TableCell>
              </TableRow>
        </TableBody>
      </Table>
            </Paper>
*/}
          </Grid>
        </Grid>
        <br />
        <br />
        <br />
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
    };
  },
  {
    pushEosTransfer,
    pushWithdraw,
  }
)(AccountPage);
