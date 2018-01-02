var logStatement = (function() {

  let loggerElement = document.querySelector('.logger-container .logger');

  let updateLogger = (dataString) => {
    let htmlString = '<b>' + new Date().toLocaleString() + '</b><span>' + dataString + '</span>';
    let childNode = document.createElement('div');
    childNode.addAtt
    childNode.innerHTML =  htmlString;
    loggerElement.appendChild(childNode);
  }

  let clearLogger = () => {
    loggerElement.innerHTML = "";
  }

  return {
    updateLogger: updateLogger,
    clearLogger: clearLogger
  }

})();
