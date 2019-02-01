/* global uploadBar, downloadBar, loadAvailableFiles, enableButton, changeProgressBar, uploadButton, downloadButton */

function onDownLoadedCallback() {
  enableButton(downloadButton);
}

function onUpLoadedCallback() {
  loadAvailableFiles();
  enableButton(uploadButton);
}

window.onUploadProgress = event => changeProgressBar({
  nodeEl: uploadBar,
  event,
  onLoadedCallback: onUpLoadedCallback
});
window.onDownloadProgress = event => changeProgressBar({
  nodeEl: downloadBar,
  event,
  onLoadedCallback: onDownLoadedCallback,
  titlePercentage: true
});