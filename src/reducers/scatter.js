const initialState = {
  identity: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'GET_SCATTER_IDENTITY_SUCCEEDED':
      return {
        ...state,
        identity: action.identity,
      };
    case 'GET_SCATTER_IDENTITY_FAILED':
      return {
        ...state,
        identity: {},
      };
    case 'FORGET_SCATTER_IDENTITY_SUCCEEDED':
      return {
        ...state,
        identity: {},
      };
    case 'FORGET_SCATTER_IDENTITY_FAILED':
      return {
        ...state,
        identity: {},
      };
    default:
      return state;
  }
}
