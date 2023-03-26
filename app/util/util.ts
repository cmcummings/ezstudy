
const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;
const SECONDS_PER_DAY = SECONDS_PER_HOUR * 24;
const SECONDS_PER_WEEK = SECONDS_PER_DAY * 7;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Converts a date string into a string describing the time from now.
 */
export function dateStringToRelativeTimeString(dateString: string) {
  const date = new Date(dateString);
  const secondsPast = Math.floor((Date.now() - date.valueOf())/MS_PER_SECOND);

  if (secondsPast < SECONDS_PER_MINUTE) {
    return `${secondsPast} sec ago`
  }

  if (secondsPast < SECONDS_PER_HOUR) {
    return `${Math.floor(secondsPast / SECONDS_PER_MINUTE)} min ago`;
  }

  if (secondsPast < SECONDS_PER_DAY) {
    return `${Math.floor(secondsPast / SECONDS_PER_HOUR)} hr ago`;
  }

  if (secondsPast < SECONDS_PER_WEEK) {
    const days = Math.floor(secondsPast / SECONDS_PER_DAY);
    return `${days} day${days > 1 ? "s" : ""} ago`
  }

  const day = DAYS[date.getDay()];
  const month = MONTHS[date.getMonth()];

  return `at ${date.getHours()}:${date.getMinutes()} on ${day}, ${month} ${date.getDate()}, ${date.getFullYear()}`;
}


export function shuffleArray<T>(arr: Array<T>) {
  let n = arr.length;
  let i, t;

  while (n > 0) {
    i = Math.floor(Math.random() * n);
    n--;
    t = arr[n];
    arr[n] = arr[i];
    arr[i] = t;
  }

  return arr;
}
