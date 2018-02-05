let loggerElement = document.querySelector('.logger-container .logger');

export let updateLogger = (dataString) => {
  let htmlString = '<b>' + new Date().toLocaleString() + '</b><span>' + dataString + '</span>';
  let childNode = document.createElement('div');
  childNode.addAtt
  childNode.innerHTML =  htmlString;
  loggerElement.appendChild(childNode);
}

export let bookObjectLogger = (bookObject) => {
  updateLogger("Name of the book: " + result.value.title);
  updateLogger("author of the book: " + result.value.author);
  updateLogger("type of the book: " + result.value.type);
};

export let clearLogger = () => {
  loggerElement.innerHTML = "";
}
