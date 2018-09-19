import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getAccounts,
  getStat,
  getEbtgames,
  getEosgames,
  getEbtplayersAccount,
  getEosplayersAccount,
  getSystemstates,
  getAccstatesAccount,
  getInfo,
} from '../../actions/api';
import { referrerDetected } from '../../actions/general';

class UpdateManager extends Component {
  componentDidMount() {
    this.intervalId = setInterval(() => {
      if (this.props.eos) {
        this.props.getEbtgames(this.props.eos);
        this.props.getEosgames(this.props.eos);
        this.props.getInfo(this.props.eos);
      }
    }, 1000);

    //Check referrer
    let urlRef = (new URLSearchParams(this.props.location.search)).get("ref");
    let lsReferrer = localStorage.getItem('referrer');

    let accountRegex = /^[a-z1-5.]{1,13}$/;

    if (lsReferrer && accountRegex.test(lsReferrer)) {
      this.props.referrerDetected(lsReferrer);
    } else {
      if (urlRef) {
        let urlReferrer = decodeURIComponent(atob(urlRef));
        if (accountRegex.test(urlReferrer)) {
          localStorage.setItem('referrer', urlReferrer);
          this.props.referrerDetected(urlReferrer);
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.account !== this.props.account) && nextProps.eos) {
      if (nextProps.account) {
        nextProps.getAccounts(nextProps.eos, nextProps.account.name);
        nextProps.getEbtplayersAccount(nextProps.eos, nextProps.account.name);
        nextProps.getEosplayersAccount(nextProps.eos, nextProps.account.name);
        nextProps.getAccstatesAccount(nextProps.eos, nextProps.account.name);
      }
    }

    /*
    if ((nextProps.eos !== this.props.eos) && nextProps.eos) {
      nextProps.getSystemstates(nextProps.eos);
    }
    */
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return null;
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
    };
  },
  {
    getAccounts,
    getStat,
    getEbtgames,
    getEosgames,
    getEbtplayersAccount,
    getEosplayersAccount,
    getSystemstates,
    getAccstatesAccount,
    getInfo,
    referrerDetected,
  }
)(UpdateManager);
