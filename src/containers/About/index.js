import React, { Component } from 'react';
import { connect } from 'react-redux';
import { secondsToMediumString } from '../../helpers';
import { pushEosTransfer, pushWithdraw } from '../../actions/api';
import grey from '@material-ui/core/colors/grey';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import eosButtonIcon from '../../images/eos-button-icon.png';
import finalPrizeImage from '../../images/final-prize.png';
import countdownImage from '../../images/countdown.png';

class About extends Component {

  render() {
    return (
      <div>
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
                  margin: '10% 0%',
                }}
              >
                {'EOS Button'}
              </div>
              <div
                style={{
                  fontSize: '100%',
                  lineHeight: '200%',
                }}
              >
                  {'This game is about pressing the EOS Button at the best moments.'}
                  <br />
                  <br />
                  <img
                    src={countdownImage}
                    style={{
                      height: '25vh',
                      margin: '30px',
                      float: 'right',
                      boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                    }}
                  />
                  {'The EOS Button has a 2-minute countdown. '} <b>Whenever someone presses the button, the countdown will be reset back to 2-minute and the round will continue.</b>{' A round ends when the countdown reaches zero. That means a round will continue as long as there is someone to press the button before the countdown reaches zero.'}
                  <br />
                  <br />
                  {'When you press the button, you will receive shares of that round, which will bring you rewards at the end of that round. The interesting part of this game is that the number of shares you get is dynamic. There are 3 factors that affect the number of shares you get for each press.'}
                    <ul>
                      <li>
                        {'The number of tokens attached to the press action: The more tokens you attach, the more shares you will get.'}
                      </li>
                      <li>
                        {'Remaining time of the countdown: '}<b>This is the most interesting part.</b>{' The lesser the remaining time, the more shares you will get.'}
                      </li>
                      <li>
                        {'How long the round has lasted for: The longer the round has lasted for, the lesser shares you will get.'}
                      </li>
                    </ul>
                  {'The tokens attached in the press actions are accumulated to a pot, which will get distributed back to all players as rewards after the end of the round. The distrinution is primarily based on the number of shares each player has.'}
                  <br />
                  <br />
                  <img
                    src={finalPrizeImage}
                    style={{
                      height: '25vh',
                      margin: '30px',
                      float: 'left',
                      boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                    }}
                  />
                  {'Additionally, to make the game more interesting, there is an attractive '}<b>Final Prize (5% of the total pot)</b>{' that will be awarded to the last player of the round.'}
                  <br />
                  <br />
                  {'Note that if a press is less than 1 share, it will not reset the countdown and it will not be considered for the Final Prize.'}
                  <br />
                  <br />
                  {'The general goal of a player should be to press the button when the remaining time of the countdown is relatively low, so that a player can make a profit.'}
                  <br />
                  <br />
                  {'It is recommended to press the button earlier in a round, because a player can get more shares. (A later press will still be profitable if it is pressed when the remaining time of the countdown is relatively low.)'}
                  <br />
                  <br />
                  {'As the pot size increases, the Final Prize can become very attractive, it may worth a player to try to become the last player and get the prize.'}
                  <br />
                  <br />
                  {'This game is inspired by '}
                  <a
                    href='https://en.wikipedia.org/wiki/The_Button_(Reddit)'
                    rel='nofollow'
                    target='_blank'
                    style={{
                      color: grey[600],
                    }}
                  >
                    The Button (Reddit)
                  </a>
                  {' and '}
                  <a
                    href='https://fomo3d.hostedwiki.co'
                    rel='nofollow'
                    target='_blank'
                    style={{
                      color: grey[600],
                    }}
                  >
                    FOMO3D
                  </a>
                  {'. You may have a look at them to understand the incentive of pressing the button.'}
                  <br />
                  <br />
                  {'There are '}<b>two versions</b>{' of EOS Button:'}
                    <ul>
                      <li>
                        {'EOS version: You play the game and receive your rewards both in EOS. More information can be found in the next section.'}
                      </li>
                      <li>
                        {'EBT version: You play the game and receive your rewards both in EBT.'}
                      </li>
                    </ul>
                  <br />
                  {'Since the timing of a press has critical effect to the result, this game can only be handled by a fast blockchain like EOS. EOS Button is the first game that actually takes advantage of the high transaction speed of EOS in a meaningful way.'}
                  <br />
                  <br />
              </div>
              <div
                style={{
                  fontSize: '400%',
                  textAlign: 'center',
                  margin: '10% 0%',
                }}
              >
                {'About the EOS version'}
              </div>
              <div
                style={{
                  fontSize: '100%',
                  lineHeight: '200%',
                }}
              >
                  <b>{'When will it launch?'}</b>
                  <br />
                  <br />
                  {'There will be a public test on Jungle Testnet before the launch, this will happen in early August. If the result of the public test is good, the actual game will be launched in around 2 days after the test.'}
                  <br />
                  <br />
                  <b>{'Will the EOS version be different from the current EBT version?'}</b>
                  <br />
                  <br />
                  {'Yes, multiple changes will be made. The changes include but not limited to:'}
                    <ul>
                      <li>
                        {'The timer will be changed from 2 minutes to 24 hours. (So that the pot can get larger. This game is for the long term.)'}
                      </li>
                      <li>
                        {'Each share will increase 30 seconds to the timer instead of resetting the whole timer.'}
                      </li>
                      <li>
                        {'Players will be able to withdraw their rewards during the round.'}
                      </li>
                      <li>
                        {'Share price will be caluclated differently (early players will have more advantage).'}
                      </li>
                      <li>
                        {'It will still be rewarding to press the button when the remaining time of the countdown is low, but the mechanics will be different.'}
                      </li>
                    </ul>
                  <br />
                  <b>{'How do I know the game is safe?'}</b>
                  <br />
                  <br />
                  {'The safety of this game is ensured by:'}
                    <ul>
                      <li>
                        {'Ricardian Contracts (That\'s the beauty of the EOS network - The \"Intent of Code\" is Law)'}
                      </li>
                      <li>
                        {'Public test'}
                      </li>
                      <li>
                        {'Open source contract'}
                      </li>
                      <li>
                        {'Safety measures in the contract code (e.g. Safe Math)'}
                      </li>
                    </ul>
                  <br />
              </div>
              <div
                style={{
                  fontSize: '400%',
                  textAlign: 'center',
                  margin: '10% 0%',
                }}
              >
                {'Token (EBT)'}
              </div>
              <div
                style={{
                  fontSize: '100%',
                  lineHeight: '200%',
                }}
              >
                  <img
                    src={eosButtonIcon}
                    style={{
                      height: '20vh',
                      margin: '30px',
                      float: 'right',
                    }}
                  />
                  {'At the current stage, the purpose of EBT is for everyone to try out the game for free before the release of the EOS version.'}
                  <br />
                  <br />
                  {'At a later stage, more content will be added to this game, including some items that can be purchased with EBT. Also, more games that use EBT will be developed in the near future. (Subject to change. An innovative idea is being worked on.)'}
                  <br />
                  <br />
                  {'Note: The transferability of EBT is temporarily disabled due to the high RAM price. It will be enabled once the RAM price is lower and then it will not be disabled anymore.'}
                  <br />
                  <br />
              </div>
              <br />
              <div
                style={{
                  fontSize: '400%',
                  textAlign: 'center',
                  margin: '10% 0%',
                }}
              >
                {'Donations'}
              </div>
              <div
                style={{
                  fontSize: '100%',
                  lineHeight: '200%',
                }}
              >
                  {'Your simple donation can make a huge difference to this project!'}
                  <br />
                  <br />
                  {'If you want to support this project, you can either:'}
                    <ul>
                      <li>
                        {'Buy RAM for this account: theeosbutton'}
                      </li>
                      <li>
                        {'Or, send EOS to this account: eosbuttonebt'}
                      </li>
                    </ul>
                  <br />
                  {'Your donation will be greatly appreciated!'}
              </div>
              <br />
              <br />
              <div
                style={{
                  fontSize: '400%',
                  textAlign: 'center',
                  margin: '10% 0%',
                }}
              >
                {'Latest information'}
              </div>
              <Paper
                style={{
                  padding: '10%',
                  color: grey[600],
                  background: grey[300],
                }}
              >
                {'The latest information about the games is always in the Discord channel.'}
              </Paper>
              <br />
              <br />
            </Paper>
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
    return {
      ebtRemainingTimeToLaunch: state.general.ebtRemainingTimeToLaunch,
    };
  },
  {
  }
)(About);
