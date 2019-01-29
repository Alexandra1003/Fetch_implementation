const uploadInput = document.querySelector('.uploadInput');
const downloadInput = document.querySelector('.downloadInput');
const uploadButton = document.querySelector('.uploadButton');
const downloadButton = document.querySelector('.downloadButton');

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

uploadInput.addEventListener('change', event => {
  const uploadInputLabel = document.querySelector('.custom-file-label');
  enableButton(uploadButton);

  if (uploadInput.files[0] !== undefined) {
    uploadInputLabel.innerText = uploadInput.files[0].name;
  }
});

downloadInput.addEventListener('input', event => {
  if (downloadInput.value) {
    enableButton(downloadButton);
  } else {
    disableButton(downloadButton);
  }
});