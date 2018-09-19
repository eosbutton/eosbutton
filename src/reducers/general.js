const initialState = {
  referrer: null,
  ebtLaunchTime: new Date('2018-07-21T10:00:00Z'),
  ebtHasLaunched: false,
  ebtRemainingTimeToLaunch: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'REFERRER_DETECTED':
      return {
        ...state,
        referrer: action.referrer,
      };
    case 'GET_INFO_SUCCEEDED':
      return {
        ...state,
        ebtHasLaunched: hasLaunched(getRemainingTimeToLaunch(state.ebtLaunchTime, action.res.head_block_time)),
        ebtRemainingTimeToLaunch: getRemainingTimeToLaunch(state.ebtLaunchTime, action.res.head_block_time),
      };
    default:
      return state;
  }
}

function hasLaunched(remainingTimeToLaunch) {
    if (remainingTimeToLaunch > 0) {
      return false;
    } else {
      return true;
    }
  }

function getRemainingTimeToLaunch(launchTime, headBlockTime) {
    if (launchTime - (new Date(headBlockTime + 'Z')) > 0) {
      return launchTime - (new Date(headBlockTime + 'Z'));
    } else {
      return 0;
    }
  }
