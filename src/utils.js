export const capFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const formatAMPM = (date) => {
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
    res =  formatAMPM(newsDate);
  }
  else{
    res = `${newsDate.getMonth()+1}/${newsDate.getDate()}/${newsDate.getFullYear()}`
  }
  
  return res;
}
