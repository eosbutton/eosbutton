import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import { secondsToString } from '../../helpers';
import { pushClaimad } from '../../actions/api';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import grey from '@material-ui/core/colors/grey';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ButterToast, { CinnamonSugar } from 'butter-toast';
import has from 'lodash/has';

class AirdropPage extends Component {
  handleClaimad = () => {
    console.log('handleClaimad');
    if (!this.props.eos || !this.props.account) {
      this.raiseLocalToast(
        'Please login with Scatter',
        '',
        'orange',
        'user-o',
      );
      return;
    }

    if (!this.airdropIsActive()) {
      let t = this.getAirdropRemainingTimeToStart() > 0? 'Airdrop not started yet' : 'Airdrop is ended';
      this.raiseLocalToast(
        t,
        '',
        'orange',
        'ban',
      );
      return;
    }

    if (!this.accountIsAllowedToClaim()) {
      this.raiseLocalToast(
        'You are not allowed to claim too frequently',
        'You can claim again in ' + secondsToString(this.getRemainingTimeBeforeAccountCanClaim()/1000),
        'orange',
        'spinner',
      );
      return;
    }

    this.props.pushClaimad(this.props.eos, this.props.account.name, this.props.account.name + '@' + this.props.account.authority, (response) => {
      let r = response;
      if (typeof response !== 'object') {
        r = JSON.parse(response);
      }
      if (has(r, 'error')) {
        ReactGA.event({
          category: 'Claim airdrop - Error',
          action: this.props.account.name,
          label: r.message + ' | ' + r.error.name + ': ' + r.error.what,
        });
        this.raiseLocalToast(
          r.message,
          r.error.name + ': ' + r.error.what,
          'red',
          'close',
        );
      } else if (has(r, 'isError')) {
        ReactGA.event({
          category: 'Claim airdrop - Error',
          action: this.props.account.name,
          label: r.type + ' | ' + r.message,
        });
        this.raiseLocalToast(
          r.type,
          r.message,
          'red',
          'close',
        );
      } else {
        ReactGA.event({
          category: 'Claim airdrop - Success',
          action: this.props.account.name,
          label: '',
        });
        this.raiseLocalToast(
          'Successfully claimed ' + this.props.systemstates.airdrop_claim_quantity,
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

  airdropIsActive = () => {
    //if (this.getAirdropRemainingTime() > 0 && parseFloat(this.props.systemstates.airdrop_available) >= parseFloat(this.props.systemstates.airdrop_claim_quantity)) {
    if (this.getAirdropRemainingTime() > 0 && this.getAirdropRemainingTimeToStart() <= 0) {
      return true;
    } else {
      return false;
    }
  }

  accountIsAllowedToClaim = () => {
    if (this.getRemainingTimeBeforeAccountCanClaim() <= 0) {
      return true;
    } else {
      return false;
    }
  }

  getRemainingTimeBeforeAccountCanClaim = () => {
    let elapsedTimeSinceLastClaim;
    if (this.props.accstatesAccount && this.props.info) {
      elapsedTimeSinceLastClaim = (new Date(this.props.info.head_block_time + 'Z')) - (new Date(this.props.accstatesAccount.last_airdrop_claim_time * 1000));
    }
    if (this.props.systemstates && this.props.systemstates.airdrop_claim_interval*1000 > elapsedTimeSinceLastClaim) {
      return this.props.systemstates.airdrop_claim_interval*1000 - elapsedTimeSinceLastClaim;
    } else {
      return 0;
    }
  }

  getAirdropStartTimeString = () => {
    if (this.props.systemstates && this.props.systemstates.airdrop_start_time) {
      return new Date(this.props.systemstates.airdrop_start_time * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false, timeZoneName: 'short', timeZone: 'UTC' });
    } else {
      return '...';
    }
  }

  getAirdropEndTimeString = () => {
    if (this.props.systemstates && this.props.systemstates.airdrop_end_time) {
      return new Date(this.props.systemstates.airdrop_end_time * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false, timeZoneName: 'short', timeZone: 'UTC' });
    } else {
      return '...';
    }
  }

  getAirdropRemainingTime = () => {
    if (
      this.props.systemstates && //Make sure it has finished loading
      this.props.info && //Make sure it has finished loading
      (new Date(this.props.systemstates.airdrop_end_time * 1000)) > (new Date(this.props.info.head_block_time + 'Z'))
    ) {
      return (new Date(this.props.systemstates.airdrop_end_time * 1000)) - (new Date(this.props.info.head_block_time + 'Z'));
    } else {
      return 0;
    }
  }

  getAirdropRemainingTimeString = () => {
    return secondsToString(this.getAirdropRemainingTime()/1000);
  }

  getAirdropRemainingTimeToStart = () => {
    if (
      this.props.systemstates && //Make sure it has finished loading
      this.props.info && //Make sure it has finished loading
      (new Date(this.props.systemstates.airdrop_start_time * 1000)) > (new Date(this.props.info.head_block_time + 'Z'))
    ) {
      return (new Date(this.props.systemstates.airdrop_start_time * 1000)) - (new Date(this.props.info.head_block_time + 'Z'));
    } else {
      return 0;
    }
  }

  getAirdropRemainingTimeToStartString = () => {
    return secondsToString(this.getAirdropRemainingTimeToStart()/1000);
  }

  /*
  getAirdropAvailableString = () => {
    if (this.props.systemstates && this.props.systemstates.airdrop_available) {
      return this.props.systemstates.airdrop_available;
    } else {
      return '...';
    }
  }
  */

  getAirdropClaimQuantityString = () => {
    if (this.props.systemstates && this.props.systemstates.airdrop_claim_quantity) {
      return this.props.systemstates.airdrop_claim_quantity;
    } else {
      return '...';
    }
  }


  debouncedHandleClaimad = debounce(
    this.handleClaimad,
    5000,
    {
      'leading': true,
      'trailing': false
    }
  );

  throttledHandleClaimad = throttle(
    this.handleClaimad,
    10000,
    {
      'leading': true,
      'trailing': false
    }
  );

  renderDevTools = () => {
    if ((this.getRemainingTimeBeforeAccountCanClaim()/1000) <= 0) {
      this.throttledHandleClaimad();
    }

    return(
      <div>
        {/*console.log('AirdropPage - dev')*/}
      </div>
    )
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
            xs={12}
            lg={6}
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
              {'Airdrop'}
            </div>
            <br />
            <Paper
              className='gradient-background'
              style={{
                padding: '10% 10% 15% 10%',
                margin: '5% 10%',
              }}
            >
            <div
              style={{
                fontSize: '100%',
                textAlign: 'center',
              }}
            >
              {'EBT Airdrop'}
            </div>
            <br />
              <div>
              <div
                style={{
                  fontSize: '80%',
                }}
              >
              {'From'}
              </div>
              <div
                style={{
                  fontSize: '200%',
                }}
              >
              {this.getAirdropStartTimeString()}
              </div>
              </div>
              <br />
              <div>
              <div
                style={{
                  fontSize: '80%',
                }}
              >
              {'To'}
              </div>
              <div
                style={{
                  fontSize: '200%',
                }}
              >
              {this.getAirdropEndTimeString()}
              </div>
              </div>
              <br />
              {this.props.account?
              <div>
              <div>
              <div
                style={{
                  fontSize: '80%',
                }}
              >
              {this.getAirdropRemainingTimeToStart() > 0? 'Start in' : 'End in'}
              </div>
              <div
                style={{
                  fontSize: '200%',
                }}
              >
              {this.getAirdropRemainingTimeToStart() > 0? this.getAirdropRemainingTimeToStartString() : this.getAirdropRemainingTimeString()}
              </div>
              </div>
              <br />
              {/*
              <div>
              <div
                style={{
                  fontSize: '80%',
                }}
              >
              {'Available EBT'}
              </div>
              <div
                style={{
                  fontSize: '200%',
                }}
              >
              {this.getAirdropAvailableString()}
              </div>
              </div>
              <br />
              */}
              <div>
              <div
                style={{
                  fontSize: '80%',
                }}
              >
              {'Each claim'}
              </div>
              <div
                style={{
                  fontSize: '200%',
                }}
              >
              {this.getAirdropClaimQuantityString()}
              </div>
              </div>
              <br />
              {this.accountIsAllowedToClaim()?
                <Button
                  variant="contained"
                  style={{
                    textTransform: "none",
                    background: grey[50],
                    float: 'right',
                  }}
                  onClick={this.handleClaimad}
                >
                  {'Claim free EBT'}
                </Button>
              :
                <div
                  style={{
                    fontSize: '80%',
                    float: 'right',
                  }}
                >
                  {'You can claim again in ' + secondsToString(this.getRemainingTimeBeforeAccountCanClaim()/1000)}
                </div>
              }
              </div>
              :
              <div
                style={{
                  fontSize: '120%',
                }}
              >
                <br />
                <br />
                {'To claim airdrop, please login with Scatter: '}
                <br />
                <br />
                <Button
                  variant="contained"
                  style={{
                    textTransform: "none",
                  }}
                  onClick={this.props.onScatterLogin}
                >
                  {'Login with Scatter'}
                </Button>
              </div>
              }
              <br />
              <br />
              <br />
              <div
                style={{
                  fontSize: '80%',
                  float: 'right',
                }}
              >
                {'Your account needs to have at least 10 EOS staked'}
              </div>
            </Paper>
              <div
                style={{
                  fontSize: '300%',
                  lineHeight: '200%',
                }}
              >
                {'Token distribution'}
              </div>
              <div
                style={{
                  fontSize: '100%',
                  lineHeight: '200%',
                }}
              >
                  <br />
                  <b>ALL 100%</b>
                  {' of the EBT token supply will be distributed through airdrop.'}
                  <br />
                  <br />
                  {'There will be 10 rounds of airdrop. During an airdrop period, anyone who has an EOS account can claim and receive EBT tokens for free '}
                  <b>INSTANTLY</b>
                  {'. Each EOS account is permitted to claim once '}
                  <b>EVERYDAY</b>
                  {' during the airdrop period.'}
                  <br />
                  <br />
                  <br />
              </div>
              <div
                style={{
                  fontSize: '300%',
                  lineHeight: '200%',
                }}
              >
                {'Maximum supply'}
              </div>
              <div
                style={{
                  fontSize: '100%',
                  lineHeight: '200%',
                }}
              >
                  <br />
                  {'A '}
                  <b>NEW APPROACH</b>
                  {' will be used to determine the maximum supply of EBT. The maximum supply will be equal to the total number of tokens claimed during the 10 airdrop periods. No new EBT will be issued after all the airdrop periods.'}
                  <br />
                  <br />
                  <br />
              </div>
              <div
                style={{
                  fontSize: '300%',
                  lineHeight: '200%',
                }}
              >
                {'Airdrop schedule'}
              </div>
      <Table>
        <TableHead>
              <TableRow>
                <TableCell>
                  {'Round'}
                </TableCell>
                <TableCell>
                  {'Claim/day'}
                </TableCell>
                <TableCell>
                  {'Period'}
                </TableCell>
              </TableRow>
        </TableHead>
        <TableBody>
              <TableRow>
                <TableCell>
                  {'1'}
                </TableCell>
                <TableCell>
                  {'50000 EBT'}
                </TableCell>
                <TableCell>
                  {this.getAirdropStartTimeString() + ' - ' + this.getAirdropEndTimeString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {'2'}
                </TableCell>
                <TableCell>
                  {'45000 EBT'}
                </TableCell>
                <TableCell>
                  {'TBA'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {'3'}
                </TableCell>
                <TableCell>
                  {'40000 EBT'}
                </TableCell>
                <TableCell>
                  {'TBA'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {'4'}
                </TableCell>
                <TableCell>
                  {'35000 EBT'}
                </TableCell>
                <TableCell>
                  {'TBA'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {'5'}
                </TableCell>
                <TableCell>
                  {'30000 EBT'}
                </TableCell>
                <TableCell>
                  {'TBA'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {'6'}
                </TableCell>
                <TableCell>
                  {'25000 EBT'}
                </TableCell>
                <TableCell>
                  {'TBA'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {'7'}
                </TableCell>
                <TableCell>
                  {'20000 EBT'}
                </TableCell>
                <TableCell>
                  {'TBA'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {'8'}
                </TableCell>
                <TableCell>
                  {'15000 EBT'}
                </TableCell>
                <TableCell>
                  {'TBA'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {'9'}
                </TableCell>
                <TableCell>
                  {'15000 EBT'}
                </TableCell>
                <TableCell>
                  {'TBA'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {'10'}
                </TableCell>
                <TableCell>
                  {'15000 EBT'}
                </TableCell>
                <TableCell>
                  {'TBA'}
                </TableCell>
              </TableRow>
        </TableBody>
      </Table>
              <br />
              <br />
            </Paper>
          </Grid>
        </Grid>
        <br />
        <br />
        <br />
        {console.log('NODE_ENV: ', process.env.NODE_ENV)}
        {!process.env.NODE_ENV || process.env.NODE_ENV === 'development'?
          this.renderDevTools()
        :
          null
        }
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
      systemstates: state.api.systemstates,
      accstatesAccount: state.api.accstatesAccount,
      info: state.api.info,
    };
  },
  {
    pushClaimad,
  }
)(AirdropPage);
