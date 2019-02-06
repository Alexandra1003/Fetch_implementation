/* global  loadAvailableFiles, processFileList, enableButton, onLoadStart, hideElement,
showElement, changeProgressBar, apiUploadFile, onUploadProgress, isDisabled */

const uploadInput = document.querySelector('.uploadInput');
const uploadButton = document.querySelector('.uploadButton');
const uploadError = document.querySelector('.uploadError');
const uploadBar = document.querySelector('.uploadBar');

function onUpLoadedCallback() {
  processFileList();
  //loadAvailableFiles();
  enableButton(uploadButton);
}

uploadInput.addEventListener('change', event => {
  const uploadInputLabel = document.querySelector('.custom-file-label');
  enableButton(uploadButton);

  if (uploadInput.files[0] !== undefined) {
    uploadInputLabel.innerText = uploadInput.files[0].name;
  }
});

document.querySelector('.uploadForm').onsubmit = function(e) {
  e.preventDefault();

  if (isDisabled(uploadButton)) {
    return;
  }

  onLoadStart(uploadBar, uploadButton);
  hideElement(uploadError);

  const form = new FormData();
  form.append('sampleFile', e.target.sampleFile.files[0]);

  apiUploadFile(form, onUploadProgress)
    .catch(err => {
      uploadError.innerText = `Error! ${err.status}: ${err.statusText}`;
      showElement(uploadError);
      enableButton(uploadButton);
    });
};

window.onUploadProgress = event => changeProgressBar({
  nodeEl: uploadBar,
  event,
  onLoadedCallback: onUpLoadedCallback
});