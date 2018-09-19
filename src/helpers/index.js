export function secondsToString(seconds) {
  let d = Math.floor(seconds / 86400);
  let h = Math.floor((seconds % 86400) / 3600);
  let m = Math.floor(((seconds % 86400) % 3600) / 60);
  let s = Math.floor(((seconds % 86400) % 3600) % 60);
  if (!seconds && seconds != 0) {
    return "...";
  } else if (d > 0) {
    return d + "d " + h + "h " + m + "m " + s + "s";
  } else if (h > 0 ) {
    return h + "h " + m + "m " + s + "s";
  } else if (seconds > 0) {
    return m + "m " + s + "s";
  } else {
    return '0m 0s';
  }
}

export function secondsToShortString(seconds) {
  let d = Math.floor(seconds / 86400);
  let h = Math.floor((seconds % 86400) / 3600);
  let m = Math.floor(((seconds % 86400) % 3600) / 60);
  let s = Math.floor(((seconds % 86400) % 3600) % 60);
  if (!seconds && seconds != 0) {
    return "...";
  } else if (d > 0) {
    return d + "d";
  } else if (h > 0 ) {
    return h + "h";
  } else if (m > 0 ) {
    return m + "m";
  } else if (seconds > 0) {
    return s + "s";
  } else {
    return '0s';
  }
}

export function secondsToMediumString(seconds) {
  let d = Math.floor(seconds / 86400);
  let h = Math.floor((seconds % 86400) / 3600);
  let m = Math.floor(((seconds % 86400) % 3600) / 60);
  let s = Math.floor(((seconds % 86400) % 3600) % 60);
  if (!seconds && seconds != 0) {
    return "...";
  } else if (d > 1) {
    return d + " days";
  } else if (d > 0) {
    return d + " day";
  } else if (h > 1 ) {
    return h + " hours";
  } else if (h > 0 ) {
    return h + " hour";
  } else if (m > 1 ) {
    return m + " months";
  } else if (m > 0 ) {
    return m + " month";
  } else if (seconds > 1) {
    return s + " seconds";
  } else if (seconds > 0) {
    return s + " second";
  } else {
    return '0 second';
  }
}
