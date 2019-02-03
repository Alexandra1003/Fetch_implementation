/* global  isImage, enableButton, disableButton, onLoadStart, isDisabled,
hideElement, showElement, changeProgressBar, download, onDownloadProgress */

const downloadInput = document.querySelector('.downloadInput');
const downloadButton = document.querySelector('.downloadButton');
const downloadError = document.querySelector('.downloadError');
const downloadBar = document.querySelector('.downloadBar');

function onDownLoadedCallback() {
  enableButton(downloadButton);
}

function downloadFile(url, fileName) {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
}

downloadInput.addEventListener('input', event => {
  if (downloadInput.value) {
    enableButton(downloadButton);
  } else {
    disableButton(downloadButton);
  }
});

document.querySelector('.downloadForm').onsubmit = function(e) {
  e.preventDefault();

  if (isDisabled(downloadButton)) {
    return;
  }
  onLoadStart(downloadBar, downloadButton);
  hideElement(downloadError);

  const fileName = e.target[0].value;
  download(fileName, onDownloadProgress)
    .then(response => {
      const url = window.URL.createObjectURL(response);
      const img = document.querySelector('.image');

      if (isImage(response.type)) {
        img.src = url;
        showElement(img.parentElement);
      } else {
        hideElement(img.parentElement);
        downloadFile(url, fileName);
      }
    })
    .catch(err => {
      downloadError.innerText = `Error! ${err.status}: ${err.statusText}`;
      showElement(downloadError);
      enableButton(downloadButton);
    });
};

window.onDownloadProgress = event => changeProgressBar({
  nodeEl: downloadBar,
  event,
  onLoadedCallback: onDownLoadedCallback,
  titlePercentage: true
});