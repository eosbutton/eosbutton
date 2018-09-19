import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import { secondsToString } from '../../helpers';
import MainButton from '../MainButton';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import NumericInput from 'react-numeric-input';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import ButterToast, { CinnamonSugar } from 'butter-toast';
import has from 'lodash/has';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const countdown_cap = 120;
const countdown_increase_step = 120;
const roundInterval = 600;

class ButtonPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quantity: parseFloat(localStorage.getItem(this.props.currency + 'quantity')) || 1000,
      dialogOpen: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.currency === this.props.currency && //Make sure the currency is the same (not sure why react seems to be able to read the other game's props here)
      nextProps.games && //Make sure it has finished loading
      this.props.games && //Make sure it has finished loading
      this.props.games.total_shares && //Make sure the last props' total_shares is not undefined, so that the first data change caused by the page's initial loading is ignored.
      nextProps.games.last_full_press_time !== this.props.games.last_full_press_time //Check if there is a new press
    ) {
      this.raiseGlobalToast(
        nextProps.games.last_full_press_player + ' pressed at ' + nextProps.games.last_full_press_remaining_time + 's',
        nextProps.games.last_full_press_shares/10000 + ' share(s)'
      );
    }
  }

  handleMainButtonPress = () => {

    return;

    if (!this.props.eos || !this.props.account) {
      this.raiseLocalToast(
        'Please login with Scatter',
        '',
        'orange',
        'user-o',
      );
      return;
    }

    if (!(this.roundIsReadyToStart() || this.roundIsActive())) {
      this.raiseLocalToast(
        'Not started yet',
        '',
        'orange',
        'spinner',
      );
      return;
    }

    let referrer = this.props.referrer;
    if (!referrer) {
      referrer = this.props.account.name;
    }
    let p = 0;
    let q = this.state.quantity.toFixed(4) + ' ' + this.props.currency;
    if (this.roundIsReadyToStart() && !this.roundIsActive()) {
      q = '0.0000 ' + this.props.currency;
    }
    this.props.press(this.props.eos, this.props.account.name, q, p, referrer, this.props.account.name + '@' + this.props.account.authority, (response) => {
      let r = response;
      if (typeof response !== 'object') {
        r = JSON.parse(response);
      }
      if (has(r, 'error')) {
        ReactGA.event({
          category: 'Press - Error',
          action: 'Account: ' + this.props.account.name + ' | Quantity: ' + q + ' | Protection: ' + p + ' | Referrer: ' + referrer + ' |',
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
          category: 'Press - Error',
          action: 'Account: ' + this.props.account.name + ' | Quantity: ' + q + ' | Protection: ' + p + ' | Referrer: ' + referrer + ' |',
          label: r.type + ' | ' + r.message,
        });
        this.raiseLocalToast(
          r.type,
          r.message,
          'red',
          'close',
        );
      } else {
        if (r.last_press_info === 1) {
          ReactGA.event({
            category: 'Press - Not started yet',
            action: 'Account: ' + this.props.account.name + ' | Quantity: ' + q + ' | Protection: ' + p + ' | Referrer: ' + referrer + ' |',
            label: '',
          });
          this.raiseLocalToast(
            'Not started yet',
            '',
            'orange',
            'spinner',
          );
        } else if (r.last_press_info === 2 || r.last_press_info === 3) {
          ReactGA.event({
            category: 'Pressed - Success',
            action: 'Account: ' + this.props.account.name + ' | Quantity: ' + q + ' | Protection: ' + p + ' | Referrer: ' + referrer + ' |',
            label: 'Successfully pressed at ' + r.last_press_remaining_time + 's | ' + r.last_press_shares/10000 + ' share(s)',
          });
          this.raiseLocalToast(
            'Successfully pressed at ' + r.last_press_remaining_time + 's',
            r.last_press_shares/10000 + ' share(s)',
            'green',
            'check',
          );
        } else if (r.last_press_info === 4) {
          ReactGA.event({
            category: 'Press - Protected',
            action: 'Account: ' + this.props.account.name + ' | Quantity: ' + q + ' | Protection: ' + p + ' | Referrer: ' + referrer + ' |',
            label: '',
          });
          this.raiseLocalToast(
            'Your press was cancelled by the activated protection',
            'You were protected from pressing when the countdown was too high',
            'orange',
            'shield',
          );
        }
      }
    });
  }


  raiseGlobalToast(title, message) {
    const toast = CinnamonSugar.crisp({
      name: 'global',
      title: title,
      message: message,
      theme: 'golden',
      icon: 'hand-pointer-o',
      toastTimeout: 5000,
    });

    ButterToast.raise(toast)
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

  getElapsedSecondsSinceLastPress = () => {
    let currentTime;
    let lastPressTime;
    if (this.props.info && this.props.games) {
      currentTime = this.props.info.head_block_time;
      lastPressTime = this.props.games.last_full_press_time;
    }

    if (this.props.games && currentTime && (lastPressTime || lastPressTime === 0)) { //Consider loading finished even if lastPressTime === 0, this happens when the table is first created.
      return (
        (new Date(currentTime + 'Z')).getTime() -
        (new Date(lastPressTime * 1000)).getTime()
      )/1000;
    } else {
      return 0;
    }
  }

  getElapsedSecondsSinceStart = () => {
    let currentTime;
    let startTime;
    if (this.props.info && this.props.games) {
      currentTime = this.props.info.head_block_time;
      startTime = this.props.games.start_time;
    }

    if (this.props.games && currentTime && startTime) {
      return (
        (new Date(currentTime + 'Z')).getTime() -
        (new Date(startTime * 1000)).getTime()
      )/1000;
    } else {
      return 0;
    }
  }

  getTimeLasted = () => {
    let currentDate;
    let startDate;
    let lastPressDate;
    if (this.props.info && this.props.games) {
      currentDate = new Date(this.props.info.head_block_time + 'Z');
      startDate = new Date(this.props.games.start_time * 1000);
      lastPressDate = new Date(this.props.games.last_full_press_time * 1000);
    }

    let millisecondsLasted;
    if (this.roundIsActive()) {
      millisecondsLasted = currentDate - startDate;
    } else {
      millisecondsLasted = lastPressDate - startDate + (this.getRemainingSecondsRightAfterLastFullPress() * 1000); //Note that the order does matter. The ingegers needs to be at the end of this formula due to how js handles dates.
    }

    return secondsToString(millisecondsLasted/1000);
  }

  getRemainingSecondsRightAfterLastFullPress = () => {
    if (
      //Make sure it has finished loading even if the results are zeros.
      this.props.games &&
      (this.props.games.last_full_press_remaining_time || this.props.games.last_full_press_remaining_time === 0) &&
      (this.props.games.last_full_press_shares || this.props.games.last_full_press_shares === 0)
    ) {
      let s = Math.min(
        countdown_cap,
        this.props.games.last_full_press_remaining_time + countdown_increase_step * this.props.games.last_full_press_shares / 10000
      );
      return s;
    } else {
      return 0;
    }

  }

  roundIsActive = () => {
    let currentDate;
    let startDate;
    let lastPressDate;
    let finishedLoading = false;
    if (this.props.info && this.props.games) {
      currentDate = new Date(this.props.info.head_block_time + 'Z');
      startDate = new Date(this.props.games.start_time * 1000);
      lastPressDate = new Date(this.props.games.last_full_press_time * 1000);
      if (this.props.info.head_block_time && (this.props.games.start_time || this.props.games.start_time === 0)) { //Consider loading finished even if start_time === 0, this happens when the table is first created.
        finishedLoading = true;
      }
    }

    if (finishedLoading) {
      if (currentDate.getTime() < lastPressDate.getTime() + (this.getRemainingSecondsRightAfterLastFullPress() * 1000)) {
        return true;
      } else {
        return false;
      }
    } else {
      return true; //Returns true if data is not available, because it is better to show that a round is active on the UI when loading.
    }
  }

  roundIsReadyToStart = () => {
    return this.getElapsedSecondsSinceLastPress() > this.getRemainingSecondsRightAfterLastFullPress() + roundInterval;
  }

  getRemainingSeconds = () => {
    return Math.min(
      Math.max(
        0,
        this.getRemainingSecondsRightAfterLastFullPress() - this.getElapsedSecondsSinceLastPress()
      ),
      countdown_cap //Cap the number to avoid confusion
    );
  }

  getRemainingSecondsBeforeNextRound = () => {
    return Math.min(
      Math.max(
        0,
        this.getRemainingSecondsRightAfterLastFullPress() + roundInterval - this.getElapsedSecondsSinceLastPress()
      ),
      countdown_cap + roundInterval //Cap the number to avoid confusion
    );
  }

  getPricePerShare = () => {
    //(remaining^2 + 2280) * (timeElapsedSinceStart + 86400) / 1036800000
    let price = (Math.pow(this.getRemainingSeconds(), 2) + 2280) * (this.getElapsedSecondsSinceStart() + 86400) / 1036800000;
    return price;
  }

  getPrice = (shares) => {
    return this.getPricePerShare() * shares;
  }

  getShares = (price) => {
    return price / this.getPricePerShare();
  }

  isWinner = () => {
    if (this.props.account && this.props.games) {
      if (!this.roundIsActive() && this.props.account.name === this.props.games.last_full_press_player) {
        return true;
      }
    }
    return false;
  }

  getRewardString = () => {
    let rewardForShares = parseFloat(this.props.games.pot) * 0.95 * this.props.playersAccount.shares / this.props.games.shares;
    let finalPrize = parseFloat(this.props.games.pot) * 0.05;

    if (!(this.props.playersAccount.shares && this.props.games.shares)) {
      return '...'; //Return ... if no finished loading
    }

    if (!this.roundIsActive() && this.isWinner()) {
      return (rewardForShares + finalPrize).toFixed(4) + ' ' + this.props.currency;
    } else {
      return rewardForShares.toFixed(4) + ' ' + this.props.currency;
    }
  }

  renderTopCenter = () => { 
    if (this.roundIsActive()) {
      return (
        <div>
          <div
            style={{
              fontSize: '400%',
            }}
          >
          {this.getRemainingSeconds().toFixed(0)}
          </div>
          <br />
          <div>
                    {"(" + this.getPricePerShare().toFixed(4) + " " + this.props.currency + " / Share)"}
          </div>
          <br />
        </div>
      );
    }

    if (!this.roundIsActive() && !this.roundIsReadyToStart()) {
      return (
        <div>
          <div
            style={{
              fontSize: '200%',
            }}
          >
            {'Round ' + this.props.games.round + ' is ended'}
            <br />
            <div
              className='animated-color-text'
              style={{
                fontWeight: '700',
              }}
            >
            {this.props.games.last_full_press_player? 'Final Prize Winner: ' + this.props.games.last_full_press_player : null}
            </div>
            <div
              style={{
                fontSize: '70%',
              }}
            >
            {'Next round starts in ' + secondsToString(this.getRemainingSecondsBeforeNextRound())}
            </div>
            <br />
          </div>
        </div>
      );
    }

    if (!this.roundIsActive() && this.roundIsReadyToStart()) {
      return (
        <div
          style={{
            fontSize: '200%',
            margin: '10% 0% 10% 0%',
          }}
        >
          EBT version is temporarily suspended
          {/*
          <div
            style={{
              fontSize: '200%',
            }}
          >
            {'Round ' + (this.props.games.round + 1) + ' is ready'}
          </div>
            <br />
          <div
            style={{
              fontSize: '100%',
            }}
          >
            {'Waiting for the first player ...'}
          </div>
            <br />
            <br />
          */}
        </div>
      );
    }
  }

  renderBottomCenter = () => { 
    if (this.roundIsActive()) {
      return (
        <div>
{/*
        <NumericInput
          value={this.state.shares}
          mobile={true}
          min={1}
          style={{
            wrap: {
              fontSize: 64,
            },
            input: {
              color: grey[700],
              fontFamily: 'roboto',
            }
          }}
          size={2}
          onChange={(valueAsNumber, valueAsString, input) => {
            this.setState({shares: valueAsNumber});
            localStorage.setItem(this.props.currency + 'quantity', valueAsString);
          }}
        />
*/}
        <NumericInput
          value={this.state.quantity}
          mobile={true}
          min={0.1}
          style={{
            wrap: {
              fontSize: 64,
            },
            input: {
              color: grey[700],
              fontFamily: 'roboto',
            }
          }}
          size={6}
          step={1}
          precision={1}
          onChange={(valueAsNumber, valueAsString, input) => {
            this.setState({quantity: valueAsNumber});
            localStorage.setItem(this.props.currency + 'quantity', valueAsString);
          }}
        />
        <div>
          {this.props.currency}
        </div>
        <div style={{height: '10px'}} />
        <span
          style={{
            fontSize: '180%',
          }}
        >
          {this.getShares(this.state.quantity).toFixed(4)}
        </span>
        <span
          style={{
            fontSize: '120%',
          }}
        >
          {' Shares'}
        </span>
        <span
          style={{
            fontSize: '80%',
          }}
        >
          {'(est.)'}
        </span>
        {this.getShares(this.state.quantity) < 1?
          <div
            style={{
              color: red[900],
            }}
          >
            {'Warning! Less than 1 share!'}
            <br />
            {'Not eligible for Final Prize. Countdown won\'t reset.'}
          </div>
        :
          <div>
            <br />
            <br />
          </div>
        }
        </div>
      );
    }

    if (!this.roundIsActive() && !this.roundIsReadyToStart()) {
      return (
        <div>
          {'When the next round is ready, the first player will get a share for free.'}
        </div>
      );
    }

    if (!this.roundIsActive() && this.roundIsReadyToStart()) {
      return (
        <div>
          {/*'The first player will get a share for free'*/}
        </div>
      );
    }
  }

  customTableCell = (c, size) => { return(
    <TableCell
      style={{
        fontSize: size,
        color: grey[600],
      }}
    >
      {c}
    </TableCell>
  );}

  renderDevTools = () => { return(
    <div>
      {console.log('ButtonPage - dev')}
    </div>
  )}

  render() {
    return (
      <div>
            <ButterToast
              name="global"
              trayPosition="top-right"
              pauseOnHover
            />
            <ButterToast
              name="local"
              trayPosition="top-center"
              pauseOnHover
            />
        <Dialog
          open={this.state.dialogOpen}
          onClose={()=>{this.setState({dialogOpen: false})}}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"EBT version"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <b>Round 1 finished</b>
              <br />
              Round 1 has successfully finished.
              <br />
              Congratulations to the winner - gy3damzzgige!!!
              <br />
              All rewards for round 1 have been distributed.
              <br />
              <br />
              <b>Round 2</b>
              <br />
              The EBT version is temporarily suspended, that means round 2 will not start soon, it may even be later than the EOS version. It is because there are multiple features being developed to improve the EBT version (e.g. allow players to withdraw rewards during the round), it would be better to start the EBT version again after the new features are implemented.
              <br />
              Why round 2 may start even after the EOS version? Because currently, most development effort is going to the EOS version, the top priority right now is to make sure the EOS version is safe.
              <br />
              (The restart of the EBT version is subject to change)
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>{this.setState({dialogOpen: false})}} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
<Grid
  container
  justify="space-around"
>
<Grid
  item
  xs={12}
  lg={3}
>
          <Paper style={{padding: '30px'}}>
            <div
              style={{
                fontSize: '100%',
                color: grey[500],
              }}
            >
              {'Round ' + (this.props.games? this.props.games.round : '...')}
              {this.roundIsActive()? '' : ' - Results'}
            </div>
            <br />
      <div
        style={{
          overflow: 'auto',
        }}
      >
      <Table
        style={{
          fontSize: '200%',
        }}
      >
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
                {this.customTableCell(
                  'Pot',
                  '50%',
                )}
                {this.customTableCell(
                  (this.props.games && this.props.games.pot? this.props.games.pot : '...'),
                  '80%',
                )}
              </TableRow>
              <TableRow>
                {this.customTableCell(
                  'Final Prize',
                  '50%',
                )}
                {this.customTableCell(
                  (this.props.games && this.props.games.pot? (parseFloat(this.props.games.pot) * 0.05).toFixed(4) + ' ' + this.props.currency : '...'),
                  '80%',
                )}
              </TableRow>
              <TableRow>
                {this.customTableCell(
                  'Time lasted',
                  '50%',
                )}
                {this.customTableCell(
                  this.getTimeLasted(),
                  '80%',
                )}
              </TableRow>
              <TableRow>
                {this.customTableCell(
                  'Total shares',
                  '50%',
                )}
                {this.customTableCell(
                  (this.props.games && this.props.games.shares? (this.props.games.shares / 10000) : '...'),
                  '80%',
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                <br />
                <br />
                <br />
                <br />
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
              <TableRow>
                {this.customTableCell(
                  'Your shares',
                  '50%',
                )}
                {this.customTableCell(
                  (this.props.playersAccount && this.props.playersAccount.shares? (this.props.playersAccount.shares / 10000) : '...'),
                  '80%',
                )}
              </TableRow>
              <TableRow>
                {this.customTableCell(
                  'Your rewards (est.)',
                  '50%',
                )}
                {this.customTableCell(
                  (this.props.games && this.props.playersAccount? this.getRewardString() : '...'),
                  '80%',
                )}
              </TableRow>
        </TableBody>
      </Table>
      </div>
                  <div
                    style={{
                      color: grey[500],
                      fontSize: '80%',
                      margin: '5% 10%',
                    }}
                  >
                    You will receive your rewards after the start of next round
                  </div>
{/*
            <div>
              {'Pot: ' + (this.props.games? this.props.games.pot : '...')}
              <br />
              {'Final Prize: ' + (this.props.games? (parseFloat(this.props.games.pot) * 0.05).toFixed(4) + ' ' + this.props.currency : '...')}
              <br />
              {'Time lasted: ' + this.getTimeLasted()}
              <br />
              {'Total shares: ' + (this.props.games? (this.props.games.shares / 10000) : '...')}
              <br />
              <br />
              {'Your shares: ' + (this.props.playersAccount? (this.props.playersAccount.shares / 10000) : '...')}
              <br />
              {this.roundIsActive()?
                <div>
                  {'Your rewards (est.): ' + (this.props.games && this.props.playersAccount?
                    this.getRewardString()
                  :
                    '...'
                  )}
                </div>
              :
                <div>
                  {'Your rewards (est.): ' + (this.props.games && this.props.playersAccount?
                    this.getRewardString()
                  :
                    '...'
                  )}
                  <div
                    style={{color: grey[500]}}
                  >
                    You will receive your rewards after the start of next round
                  </div>
                </div>
              }
            </div>
*/}
          </Paper>
          <br />
          <br />
</Grid>
<Grid
  item
  xs={12}
  lg={4}
>
        <div
          style={{
            textAlign: 'center',
            color: grey[600],
          }}
        >
        {this.renderTopCenter()}
          <MainButton
            onPress={this.handleMainButtonPress}
            currency={this.props.currency}
            countdown_cap={countdown_cap}
            remainingSeconds={this.getRemainingSeconds()}
          />
          <br />
        <div style={{height: '30px'}} />
        {this.renderBottomCenter()}
        <br />
        <br />
        <br />
{/*
          <span>
                    {"Price "}
          </span>
          <span
            style={{
              fontSize: '200%',
            }}
          >
                    {"18.6 "}
          </span>
          <span>
                    {this.props.currency + " / "}
          </span>
          <span
            style={{
              fontSize: '200%',
            }}
          >
                    {"12"}
          </span>
          <span>
                    {" Shares"}
          </span>
          <span
            style={{
              padding: '0px 0px 0px 20px',
            }}
          >
                    {"(1.04 " + this.props.currency + " / Share)"}
          </span>
        <div style={{height: '80px'}} />
        <div
          style={{
            color: grey[600],
          }}
        >
          Shares
        </div>
*/}
        </div>
</Grid>
<Grid
  item
  xs={12}
  lg={3}
>
</Grid>
</Grid>
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
      referrer: state.general.referrer,
      info: state.api.info,
    };
  },
  {
  }
)(ButtonPage);
