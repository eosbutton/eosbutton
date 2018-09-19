import find from 'lodash/find';
const contract = 'theeosbutton';

export function pushEbtpress(eos, account, quantity, protection, referrer, auth, callback = () => {}) {
  return (dispatch) => eos.contract(contract).then(c => {
      c.ebtpress(account, quantity, protection, referrer, {authorization: [auth]}).then(r => {
        dispatch({ type: 'EBTPRESS_SUCCEEDED', r });
        dispatch(getAccounts(eos, account));
        dispatch(getEbtplayersAccount(eos, account, callback));
        dispatch(getAccstatesAccount(eos, account));
      }).catch(e => {
        dispatch({ type: 'EBTPRESS_FAILED', e });
        callback(e);
      });
  });
}

export function pushEospress(eos, account, quantity, protection, referrer, auth, callback = () => {}) {
  return (dispatch) => eos.contract(contract).then(c => {
      c.eospress(account, quantity, protection, referrer, {authorization: [auth]}).then(r => {
        dispatch({ type: 'EOSPRESS_SUCCEEDED', r });
        dispatch(getAccounts(eos, account));
        dispatch(getEosplayersAccount(eos, account, callback));
        dispatch(getAccstatesAccount(eos, account));
      }).catch(e => {
        dispatch({ type: 'EOSPRESS_FAILED', e });
        callback(e);
      });
  });
}

export function pushClaimad(eos, account, auth, callback = () => {}) {
  return (dispatch) => eos.contract(contract).then(c => {
      c.claimad(account, {authorization: [auth]}).then(r => {
        dispatch({ type: 'CLAIMAD_SUCCEEDED', r });
        dispatch(getAccounts(eos, account));
        dispatch(getAccstatesAccount(eos, account));
        callback(r);
      }).catch(e => {
        dispatch({ type: 'CLAIMAD_FAILED', e });
        callback(e);
      });
  });
}

export function pushWithdraw(eos, account, quantity, auth, callback = () => {}) {
  return (dispatch) => eos.contract(contract).then(c => {
      c.withdraw(account, quantity, {authorization: [auth]}).then(r => {
        dispatch({ type: 'WITHDRAW_SUCCEEDED', r });
        dispatch(getAccstatesAccount(eos, account, callback));
      }).catch(e => {
        dispatch({ type: 'WITHDRAW_FAILED', e });
        callback(e);
      });
  });
}

export function getAccounts(eos, account) {
  return (dispatch) => eos.getTableRows({
    code: contract,
    scope: account,
    table: 'accounts',
    limit: 100000,
    json: true,
  }).then(r => {
    let res = find(r.rows, (o) => {
      if (o.balance.substring(o.balance.indexOf(' ') + 1) === 'EBT') {
        return true;
      } else {
        return false;
      }
    });
    dispatch({
      type: 'GET_ACCOUNTS_SUCCEEDED',
      res,
    });
  }).catch(e => {
    dispatch({ type: 'GET_ACCOUNTS_FAILED', e });
  });
}

export function getStat(eos) {
  return (dispatch) => eos.getTableRows({
    code: contract,
    scope: 'EBT',
    table: 'stat',
    limit: 100000,
    json: true,
  }).then(r => {
    let res = find(r.rows, (o) => {
      if (o.supply.substring(o.supply.indexOf(' ') + 1) === 'EBT') {
        return true;
      } else {
        return false;
      }
    });
    dispatch({
      type: 'GET_STAT_SUCCEEDED',
      res,
    });
  }).catch(e => {
    dispatch({ type: 'GET_STAT_FAILED', e });
  });
}

let getEbtgamesRunning = false;
export function getEbtgames(eos) {
  return (dispatch) => {
    if (!getEbtgamesRunning) {
      getEbtgamesRunning = true;
      eos.getTableRows({
        code: contract,
        scope: contract,
        table: 'ebtgames',
        limit: 100000,
        json: true,
      }).then(r => {
        dispatch({
          type: 'GET_EBTGAMES_SUCCEEDED',
          res: r.rows[0],
        });
        getEbtgamesRunning = false;
      }).catch(e => {
        dispatch({ type: 'GET_EBTGAMES_FAILED', e });
        getEbtgamesRunning = false;
      });
    } else {
      dispatch({ type: 'GET_EBTGAMES_TOO_FREQUENT' });
    }
  }
}

let getEosgamesRunning = false;
export function getEosgames(eos) {
  return (dispatch) => {
    if (!getEosgamesRunning) {
      getEosgamesRunning = true;
      eos.getTableRows({
        code: contract,
        scope: contract,
        table: 'eosgames',
        limit: 100000,
        json: true,
      }).then(r => {
        dispatch({
          type: 'GET_EOSGAMES_SUCCEEDED',
          res: r.rows[0],
        });
        getEosgamesRunning = false;
      }).catch(e => {
        dispatch({ type: 'GET_EOSGAMES_FAILED', e });
        getEosgamesRunning = false;
      });
    } else {
      dispatch({ type: 'GET_EOSGAMES_TOO_FREQUENT' });
    }
  }
}

export function getEbtplayersAccount(eos, account, callback = () => {}) {
  return (dispatch) => eos.getTableRows({
    code: contract,
    scope: contract,
    table: 'ebtplayers',
    lower_bound: account,
    limit: 1,
    json: true,
  }).then(r => {
    let res = find(r.rows, ['account', account]);
    dispatch({
      type: 'GET_EBTPLAYERS_ACCOUNT_SUCCEEDED',
      res,
    });
    callback(res);
  }).catch(e => {
    dispatch({ type: 'GET_EBTPLAYERS_ACCOUNT_FAILED', e });
    callback(e);
  });
}

export function getEosplayersAccount(eos, account, callback = () => {}) {
  return (dispatch) => eos.getTableRows({
    code: contract,
    scope: contract,
    table: 'eosplayers',
    lower_bound: account,
    limit: 1,
    json: true,
  }).then(r => {
    let res = find(r.rows, ['account', account]);
    dispatch({
      type: 'GET_EOSPLAYERS_ACCOUNT_SUCCEEDED',
      res,
    });
    callback(res);
  }).catch(e => {
    dispatch({ type: 'GET_EOSPLAYERS_ACCOUNT_FAILED', e });
    callback(e);
  });
}

export function getSystemstates(eos) {
  return (dispatch) => eos.getTableRows({
    code: contract,
    scope: contract,
    table: 'systemstates',
    limit: 100000,
    json: true,
  }).then(r => {
    dispatch({
      type: 'GET_SYSTEMSTATES_SUCCEEDED',
      res: r.rows[0],
    });
  }).catch(e => {
    dispatch({ type: 'GET_SYSTEMSTATES_FAILED', e });
  });
}

export function getAccstatesAccount(eos, account, callback = () => {}) {
  return (dispatch) => eos.getTableRows({
    code: contract,
    scope: contract,
    table: 'accstates',
    lower_bound: account,
    limit: 1,
    json: true,
  }).then(r => {
    dispatch({
      type: 'GET_ACCSTATES_ACCOUNT_SUCCEEDED',
      res: find(r.rows, ['account', account]),
    });
    callback(r);
  }).catch(e => {
    dispatch({ type: 'GET_ACCSTATES_ACCOUNT_FAILED', e });
    callback(e);
  });
}

let getInfoRunning = false;
export function getInfo(eos) {
  return (dispatch) => {
    if (!getInfoRunning) {
      getInfoRunning = true;
      eos.getInfo({}).then(r => {
        dispatch({
          type: 'GET_INFO_SUCCEEDED',
          res: r,
        });
        getInfoRunning = false;
      }).catch(e => {
        dispatch({ type: 'GET_INFO_FAILED', e });
        getInfoRunning = false;
      });
    } else {
      dispatch({ type: 'GET_INFO_TOO_FREQUENT' });
    }
  }
}

export function pushEosTransfer(eos, from, quantity, auth, callback = () => {}) {
  return (dispatch) => eos.contract('eosio.token').then(c => {
      c.transfer(from, contract, quantity, 'deposit', {authorization: [auth]}).then(r => {
        dispatch({ type: 'EOS_TRANSFER_SUCCEEDED', r });
        dispatch(getAccstatesAccount(eos, from, callback));
      }).catch(e => {
        dispatch({ type: 'EOS_TRANSFER_FAILED', e });
        callback(e);
      });
  });
}
