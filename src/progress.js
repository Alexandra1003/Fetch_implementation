const request = new HttpRequest({ baseUrl: 'http://localhost:8000' });// eslint-disable-line
const uploadInput = document.querySelector('.uploadInput');
const downloadInput = document.querySelector('.downloadInput');
const uploadButton = document.querySelector('.uploadButton');
const downloadButton = document.querySelector('.downloadButton');
const filesList = document.querySelector('.list-group');
const uploadError = document.querySelector('.uploadError');
const downloadError = document.querySelector('.downloadError');

uploadInput.addEventListener('change', event => {
  const uploadInputLabel = document.querySelector('.custom-file-label');
  uploadButton.classList.remove('disabled');
  uploadInputLabel.innerText = uploadInput.files[0].name;
});

downloadInput.addEventListener('input', event => {
  if (downloadInput.value) {
    downloadButton.classList.remove('disabled');
  } else {
    downloadButton.classList.add('disabled');
  }
});

function isImage(type) {
  const allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];

  return allowedFileTypes.includes(type);
}

function downloadFile(url, fileName) {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
}

function onDownloadProgress(progressEvent) {
  if (progressEvent.lengthComputable) {
    const percentComplete = Math.round(progressEvent.loaded / progressEvent.total * 100);
    const progressBar = document.querySelector('.downloadBar');
    progressBar.style.width = `${percentComplete}%`;
    progressBar.parentElement.classList.remove('transparent');

    setTimeout(() => {
      progressBar.parentElement.classList.add('transparent');
      progressBar.style.width = '0%';
    }, 2000);
  }
}

function onListItemClick(event) {
  Array.from(filesList.children).forEach(item => {
    item.classList.remove('active');
  });
  event.target.classList.add('active');
  downloadInput.value = event.target.innerText;
  downloadButton.classList.remove('disabled');
}

function loadAvailableFiles() {
  request.get('/list')
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
      downloadError.classList.remove('hidden');
    });
}

function onUploadProgress(progressEvent) {
  if (progressEvent.lengthComputable) {
    const percentComplete = Math.round(progressEvent.loaded / progressEvent.total * 100);
    const progressBar = document.querySelector('.uploadBar');
    progressBar.style.width = `${percentComplete}%`;
    progressBar.innerText = `${percentComplete}%`;
    progressBar.parentElement.classList.remove('transparent');
    loadAvailableFiles();
    setTimeout(() => {
      progressBar.parentElement.classList.add('transparent');
      progressBar.style.width = '0%';
      progressBar.innerText = '0%';
    }, 2000);
  }
}

document.querySelector('.uploadForm').onsubmit = function(e) {
  e.preventDefault();

  if (uploadButton.classList.contains('disabled')) {
    return;
  }
  uploadError.classList.add('hidden');

  const form = new FormData();
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'multipart/form-data');
  form.append('sampleFile', e.target.sampleFile.files[0]);
  request.post('/upload', { data: form, onUploadProgress })
    .catch(err => {
      uploadError.innerText = `Error! ${err.status}: ${err.statusText}`;
      uploadError.classList.remove('hidden');
    });
};

document.querySelector('.downloadForm').onsubmit = function(e) {
  e.preventDefault();

  if (!downloadInput.value) {
    return;
  }
  downloadError.classList.add('hidden');
  request.get(`/files/${e.target[0].value}`, { responseType: 'blob', onDownloadProgress })
    .then(response => {
      const url = window.URL.createObjectURL(response);
      const img = document.querySelector('.image');

      if (isImage(response.type)) {
        img.src = url;
        img.parentElement.classList.remove('hidden');
      } else {
        const fileName = e.target[0].value;
        img.parentElement.classList.add('hidden');
        downloadFile(url, fileName);
      }
    })
    .catch(err => {
      downloadError.innerText = `Error! ${err.status}: ${err.statusText}`;
      downloadError.classList.remove('hidden');
    });
};