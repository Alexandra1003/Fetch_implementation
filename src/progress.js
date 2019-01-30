function onDownloadProgress(progressEvent) {
  if (progressEvent.lengthComputable) {
    const percentComplete = Math.round(progressEvent.loaded / progressEvent.total * 100);
    const progressBar = document.querySelector('.downloadBar');
    const title = document.querySelector('title');

    progressBar.style.width = `${percentComplete}%`;
    progressBar.parentElement.classList.remove('transparent');
    title.innerText = `Form ${percentComplete}%`;
    disableButton(downloadButton);// eslint-disable-line

    if (progressEvent.loaded === progressEvent.total) {
      enableButton(downloadButton);// eslint-disable-line
      setTimeout(() => {
        progressBar.parentElement.classList.add('transparent');
        progressBar.style.width = '0%';
        title.innerText = 'Form';
      }, 2000);
    }
  }
}

function onUploadProgress(progressEvent) {
  if (progressEvent.lengthComputable) {
    const percentComplete = Math.round(progressEvent.loaded / progressEvent.total * 100);
    const progressBar = document.querySelector('.uploadBar');

    progressBar.style.width = `${percentComplete}%`;
    progressBar.innerText = `${percentComplete}%`;
    progressBar.parentElement.classList.remove('transparent');
    disableButton(uploadButton);// eslint-disable-line

    if (progressEvent.loaded === progressEvent.total) {
      loadAvailableFiles(); // eslint-disable-line
      enableButton(uploadButton);// eslint-disable-line
      setTimeout(() => {
        progressBar.parentElement.classList.add('transparent');
        progressBar.style.width = '0%';
        progressBar.innerText = '0%';
      }, 2000);
    }
  }
}
