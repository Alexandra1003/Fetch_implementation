function hideElement(elem) {
  elem.classList.add('hidden');
}

function showElement(elem) {
  elem.classList.remove('hidden');
}

function disableButton(elem) {
  elem.classList.add('disabled');
}

function enableButton(elem) {
  elem.classList.remove('disabled');
}

function isDisabled(elem) {
  return elem.classList.contains('disabled');
}

function onLoadStart(nodeEl, nodeButton) {
  nodeEl.parentElement.classList.remove('transparent');
  disableButton(nodeButton);
}

function isImage(type) {
  const allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];

  return allowedFileTypes.includes(type);
}