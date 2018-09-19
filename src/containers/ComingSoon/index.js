import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { secondsToString } from '../../helpers';
import MainButton from '../MainButton';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';
import ButterToast, { CinnamonSugar } from 'butter-toast';

class ComingSoon extends Component {
  handleMainButtonPress = () => {
    if (!this.props.eos || !this.props.account) {
      this.raiseLocalToast(
        'Please login with Scatter',
        '',
        'orange',
        'user-o',
      );
      return;
    }

    if (!this.props.ebtHasLaunched) {
      this.raiseLocalToast(
        'Not launched yet',
        '',
        'orange',
        'spinner',
      );
      return;
    }
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

  renderTopCenter = () => { 
    if (!this.props.ebtHasLaunched && this.props.eos) {
      return (
        <div>
          <div>
            {"Launch on July 21 at 10:00 AM UTC"}
          </div>
          <br />
          <div
            style={{
              fontSize: '400%',
            }}
          >
          {secondsToString(this.props.ebtRemainingTimeToLaunch/1000)}
          </div>
          <br />
        </div>
      );
    } else {
      return (
        <div>
          {"Launch on July 21 at 10:00 AM UTC"}
          <br />
          <br />
        </div>
      );
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
            currency={'EBT'}
            countdown={120}
            remainingSeconds={0}
          />
          <br />
        <div style={{height: '30px'}} />
                <Button
                  component={Link}
                  to={process.env.PUBLIC_URL + '/about'}
                  variant="contained"
                  color="primary"
                  style={{
                    textTransform: "none",
                  }}
                >
                  How to play
                </Button>
          <br />
          <br />
          <div>
            {this.props.account?
              <div>
                {"Your referral link: "}
                <br />
                {"https://eosbutton.io/?ref=" + encodeURIComponent(btoa(this.props.account.name))}
              </div>
            :
              "Login with Scatter to get your referral link."
            }
          </div>
          <br />
          <div
            style={{
              fontSize: '80%',
            }}
          >
            {'Every time your referee presses the button, BOTH the referrer and referee will get 5% extra shares.'}
          </div>
        </div>
</Grid>
</Grid>
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
      launchTime: state.general.launchTime,
      ebtRemainingTimeToLaunch: state.general.ebtRemainingTimeToLaunch,
      ebtHasLaunched: state.general.ebtHasLaunched,
    };
  },
  {
  }
)(ComingSoon);
