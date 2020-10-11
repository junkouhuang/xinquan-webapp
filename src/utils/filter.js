//时间倒计时
const timeDown = unixtime => {
  // 小时
  var hr = Math.floor(unixtime / 3600 % 24);
  // 分钟
  var min = Math.floor(unixtime / 60 % 60);
  // 秒
  var sec = Math.floor(unixtime % 60);
  return  hr + "小时" + min + "分钟" + sec + "秒";

}


module.exports = {

  timeDown

}
