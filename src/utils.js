export const capFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const formatAMPM = (dateString) => {
  let date = new Date(dateString);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = (hours<10)? '0'+hours : hours;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;

  return strTime;
}

export const printDate = (dateString) => {
  let newsDate = new Date(dateString);
  let now = new Date();
  let res = "";
  if(newsDate.getDate()===now.getDate() &&
     newsDate.getMonth()===now.getMonth() &&
     newsDate.getFullYear()===now.getFullYear()
   ){
    res =  formatAMPM(dateString);
  }
  else{
    res = `${newsDate.getMonth()+1}/${newsDate.getDate()}/${newsDate.getFullYear()}`
  }

  return res;
}

export const printDateOnly = (dateString) => {
  let newsDate = new Date(dateString);

  return `${newsDate.getMonth()+1}/${newsDate.getDate()}/${newsDate.getFullYear()}`;
}


// a and b are string
export const dateDiffInDays = (a) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  let aDate = new Date(a);
  let bDate = new Date();
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(aDate.getFullYear(), aDate.getMonth(), aDate.getDate());
  var utc2 = Date.UTC(bDate.getFullYear(), bDate.getMonth(), bDate.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export const displayPercentage = (newString, oldString) => {
  let newNum = Number(newString);
  let oldNum = Number(oldString);
  let negPos = (newNum - oldNum > 0)? "+" : "";

  return  negPos + ((newNum - oldNum) / oldNum * 100).toFixed(2) + "%"
}

export const isLater = (newDateStr, oldDateStr) => {
    return new Date(newDateStr) > new Date(oldDateStr);
}

export const flow = (funcs) => {
  const length = funcs ? funcs.length : 0
  let index = length
  while (index--) {
    if (typeof funcs[index] !== 'function') {
      throw new TypeError('Expected a function')
    }
  }
  return function(...args) {
    let index = 0
    let result = length ? funcs[index].apply(this, args) : args[0]
    while (++index < length) {
      result = funcs[index].call(this, result)
    }
    return result
  }
}
