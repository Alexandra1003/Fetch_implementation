const request = new HttpRequest({ baseUrl: 'http://localhost:8000' });// eslint-disable-line

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
  Array.from(filesList.children).forEach(item => { // eslint-disable-line
    item.classList.remove('active');
  });
  event.target.classList.add('active');
  downloadInput.value = event.target.innerText; // eslint-disable-line
  enableButton(downloadButton); // eslint-disable-line
}

function onUploadProgress(progressEvent) {
  if (progressEvent.lengthComputable) {
    const percentComplete = Math.round(progressEvent.loaded / progressEvent.total * 100);
    const progressBar = document.querySelector('.uploadBar');
    progressBar.style.width = `${percentComplete}%`;
    progressBar.innerText = `${percentComplete}%`;
    progressBar.parentElement.classList.remove('transparent');
    loadAvailableFiles(); // eslint-disable-line
    setTimeout(() => {
      progressBar.parentElement.classList.add('transparent');
      progressBar.style.width = '0%';
      progressBar.innerText = '0%';
    }, 2000);
  }
}