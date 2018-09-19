export function getScatterIdentitySucceeded(identity) {
  return {type: 'GET_SCATTER_IDENTITY_SUCCEEDED', identity};
}

export function getScatterIdentityFailed(error) {
  return {type: 'GET_SCATTER_IDENTITY_FAILED'};
}

export function forgetScatterIdentitySucceeded() {
  return {type: 'FORGET_SCATTER_IDENTITY_SUCCEEDED'};
}

export function forgetScatterIdentityFailed(error) {
  return {type: 'FORGET_SCATTER_IDENTITY_FAILED'};
}
