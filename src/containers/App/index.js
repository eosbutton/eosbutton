import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Eos from 'eosjs';
import ReactGA from 'react-ga';
import debounce from 'lodash/debounce';
import UpdateManager from '../UpdateManager';
import NavBar from '../NavBar';
import Home from '../Home';
import ComingSoon from '../ComingSoon';
import ButtonPage from '../ButtonPage';
import AirdropPage from '../AirdropPage';
import About from '../About';
import AccountPage from '../AccountPage';
import {
  pushEbtpress,
  pushEospress
} from '../../actions/api';
import {
  getScatterIdentitySucceeded,
  getScatterIdentityFailed,
  forgetScatterIdentitySucceeded,
  forgetScatterIdentityFailed
} from '../../actions/scatter';

ReactGA.initialize('UA-108802756-7', {
  debug: true,
});

const logDebouncedPageView = debounce(() => {
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
}, 1000);

class logPageView extends Component {
  componentDidMount() {
    logDebouncedPageView();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      logDebouncedPageView();
    }
  }

  render() {
    return null;
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eos: null,
    };

  }

  componentDidMount = () => {
    document.addEventListener('scatterLoaded', scatterExtension => {
      console.log("scatterLoaded");
      this.scatter = window.scatter;
      window.scatter = null;
      this.scatter.requireVersion(3.0);

      this.getScatterIdentity();
    });
  }

  getScatterIdentity = () => {
/*
        //Mainnet
        const network = {
            protocol: 'https', // Defaults to https
            blockchain: 'eos',
            host: 'api.cypherglass.com', // ( or null if endorsed chainId )
            port: 443, // ( or null if defaulting to 80 )
            chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        }
*/
/*
        //Mainnet
        const network = {
            protocol: 'http', // Defaults to https
            blockchain: 'eos',
            host: 'api.eosnewyork.io', // ( or null if endorsed chainId )
            port: 80, // ( or null if defaulting to 80 )
            chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        }
*/
        //Mainnet
        const network = {
            protocol: 'https', // Defaults to https
            blockchain: 'eos',
            host: 'nodes.get-scatter.com', // ( or null if endorsed chainId )
            port: 443, // ( or null if defaulting to 80 )
            chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        }

/*
        //Jungle testnet
        const network = {
            protocol: 'http', // Defaults to https
            blockchain: 'eos',
            host: '193.93.219.219', // ( or null if endorsed chainId )
            port: 8888, // ( or null if defaulting to 80 )
            chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
        }
*/

/*
        //Jungle testnet
        const network = {
            protocol: 'https', // Defaults to https
            blockchain: 'eos',
            host: 'jungle.eosio.cr', // ( or null if endorsed chainId )
            port: 443, // ( or null if defaulting to 80 )
            chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
        }
*/

/*
        //Local testnet
        const network = {
            protocol: 'http', // Defaults to https
            blockchain: 'eos',
            host: '192.168.99.100', // ( or null if endorsed chainId )
            port: 8888, // ( or null if defaulting to 80 )
            chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
        }
*/

        this.scatter.getIdentity({accounts:[network]}).then(identity => {

            // Set up any extra options you want to use eosjs with. 
            const eosOptions = {
                chainId: network.chainId,
            };
 
            // Get a reference to an 'Eosjs' instance with a Scatter signature provider.
            this.setState({eos: this.scatter.eos( network, Eos, eosOptions, network.protocol )});

            this.props.getScatterIdentitySucceeded(identity);

        }).catch(error => {
            this.setState({eos: null});
            this.props.getScatterIdentityFailed(error);
        });
  }

  forgetScatterIdentity = () => {
    this.scatter.forgetIdentity().then(() => {
      this.props.forgetScatterIdentitySucceeded();
    }).catch(error => {
      this.props.forgetScatterIdentityFailed(error);
    });
  }

  render() {
    return (
      <Router>
        <div>
          {/*Wrap the UpdateManager with Route, so that it has access to location.*/}
          <Route path={process.env.PUBLIC_URL + '/'} component={logPageView} />
          <Route render={(props) => { return (
            <UpdateManager
              {...props}
              eos={this.state.eos}
            />
          )}} />
          <NavBar
            eos={this.state.eos}
            onScatterLogin={this.getScatterIdentity}
            onScatterLogout={this.forgetScatterIdentity}
          />

          <Switch>
            <Route exact path={process.env.PUBLIC_URL + '/'} render={(props) => { return (
              <Home
                {...props}
                eos={this.state.eos}
              />
            )}} />
            <Route path={process.env.PUBLIC_URL + '/eos-game'} render={(props) => { return (
              <ButtonPage
                {...props}
                eos={this.state.eos}
                currency="EOS"
                games={this.props.eosgames}
                playersAccount={this.props.eosplayersAccount}
                press={this.props.pushEospress}
              />
            )}} />
            <Route path={process.env.PUBLIC_URL + '/ebt-game'} render={(props) => { return (
              <ButtonPage
                {...props}
                eos={this.state.eos}
                currency="EBT"
                games={this.props.ebtgames}
                playersAccount={this.props.ebtplayersAccount}
                press={this.props.pushEbtpress}
              />
            )}} />
            <Route path={process.env.PUBLIC_URL + '/airdrop'} render={(props) => { return (
              <AirdropPage
                {...props}
                eos={this.state.eos}
                onScatterLogin={this.getScatterIdentity}
              />
            )}} />
            <Route path={process.env.PUBLIC_URL + '/about'} render={(props) => { return (
              <About
                {...props}
              />
            )}} />
            <Route path={process.env.PUBLIC_URL + '/account'} render={(props) => { return (
              <AccountPage
                {...props}
                eos={this.state.eos}
                onScatterLogin={this.getScatterIdentity}
                onScatterLogout={this.forgetScatterIdentity}
              />
            )}} />
          </Switch>

        </div>
      </Router>
    );
  }
}

export default connect(
  state => ({
    ebtgames: state.api.ebtgames,
    eosgames: state.api.eosgames,
    ebtplayersAccount: state.api.ebtplayersAccount,
    eosplayersAccount: state.api.eosplayersAccount,
    ebtHasLaunched: state.general.ebtHasLaunched,
  }),
  {
    getScatterIdentitySucceeded,
    getScatterIdentityFailed,
    forgetScatterIdentitySucceeded,
    forgetScatterIdentityFailed,
    pushEbtpress,
    pushEospress,
  }
)(App);
