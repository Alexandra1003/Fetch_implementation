const uploadInput = document.querySelector('.uploadInput');
const downloadInput = document.querySelector('.downloadInput');
const uploadButton = document.querySelector('.uploadButton');
const downloadButton = document.querySelector('.downloadButton');
const uploadError = document.querySelector('.uploadError');
const downloadError = document.querySelector('.downloadError');
const filesList = document.querySelector('.list-group');

function isImage(type) {
  const allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];

  return allowedFileTypes.includes(type);
}

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

function downloadFile(url, fileName) {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
}

document.querySelector('.uploadForm').onsubmit = function(e) {
  e.preventDefault();

  if (uploadButton.classList.contains('disabled')) {
    return;
  }
  hideElement(uploadError);

  const form = new FormData();
  form.append('sampleFile', e.target.sampleFile.files[0]);

  upload(form, onUploadProgress) // eslint-disable-line
    .catch(err => {
      uploadError.innerText = `Error! ${err.status}: ${err.statusText}`;
      showElement(uploadError);
    });
};

document.querySelector('.downloadForm').onsubmit = function(e) {
  e.preventDefault();

  if (downloadButton.classList.contains('disabled')) {
    return;
  }
  hideElement(downloadError);
  const fileName = e.target[0].value;
  download(e.target[0].value, onDownloadProgress) // eslint-disable-line
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
    });
};

function onListItemClick(event) {
  Array.from(filesList.children).forEach(item => {
    item.classList.remove('active');
  });
  event.target.classList.add('active');
  downloadInput.value = event.target.innerText;
  enableButton(downloadButton);
}

function loadAvailableFiles() {
  loadFiles() // eslint-disable-line
    .then(response => {
      Array.from(filesList.children).forEach(item => {
        filesList.removeChild(item);
      });
      response.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerText = item;
        filesList.append(li);
        li.addEventListener('click', onListItemClick);
      });
    })
    .catch(err => {
      downloadError.innerText = `Error! ${err.status}: ${err.statusText}`;
      showElement(downloadError);
    });
}