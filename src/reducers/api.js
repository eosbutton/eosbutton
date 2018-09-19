const initialState = {
  accounts: {},
  stat: {},
  ebtgames: {},
  eosgames: {},
  ebtplayersAccount: {},
  eosplayersAccount: {},
  systemstates: {
    airdrop_available: null,
    airdrop_claim_quantity: '50000.0000 EBT',
    airdrop_claim_interval: 86400,
    airdrop_start_time: 1531908000,
    airdrop_end_time: 1533117600,
  },
  accstatesAccount: {},
  info: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'GET_ACCOUNTS_SUCCEEDED':
      return {
        ...state,
        accounts: action.res,
      };
    case 'GET_STAT_SUCCEEDED':
      return {
        ...state,
        stat: action.res,
      };
    case 'GET_EBTPLAYERS_ACCOUNT_SUCCEEDED':
      return {
        ...state,
        ebtplayersAccount: action.res,
      };
    case 'GET_EOSPLAYERS_ACCOUNT_SUCCEEDED':
      return {
        ...state,
        eosplayersAccount: action.res,
      };
    case 'GET_EBTGAMES_SUCCEEDED':
      return {
        ...state,
        ebtgames: action.res,
      };
    case 'GET_EOSGAMES_SUCCEEDED':
      return {
        ...state,
        eosgames: action.res,
      };
    case 'GET_SYSTEMSTATES_SUCCEEDED':
      return {
        ...state,
        systemstates: action.res,
      };
    case 'GET_ACCSTATES_ACCOUNT_SUCCEEDED':
      return {
        ...state,
        accstatesAccount: action.res,
      };
    case 'GET_INFO_SUCCEEDED':
      return {
        ...state,
        info: action.res,
      };
    //Scatter's actions
    case 'GET_SCATTER_IDENTITY_FAILED':
    case 'FORGET_SCATTER_IDENTITY_SUCCEEDED':
      return {
        ...state,
        accounts: {},
        ebtplayersAccount: {},
        eosplayersAccount: {},
        accstatesAccount: {},
      };
    default:
      return state;
  }
}
