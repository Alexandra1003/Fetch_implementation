/* global downloadInput, enableButton, downloadButton, apiLoadFiles, downloadError, showElement */

const filesList = document.querySelector('.list-group');
let cb = null;
let filesArray = [];

// (function initFilesList() {
//   filesList.addEventListener('click', onListItemClick);
// })();

(function initFilesList() {
  button.addEventListener('click', processFileList)
  filesList.addEventListener('click', (e) => {
    cb(e);
  })
  //1) creates wrapper for filesList 
  //2) adds eventListener on click
  //3) renders wrapper
})();

function processFileList() {
  loadFiles()
    .then(() => {
      renderFiles(filesList);
    });
}

function loadFiles() {
  return serviceFunc()
    .then((response) => {
      filesArray = Array.from(response);
      res(filesArray);
    })
}

function renderFiles(wrapper) {
  filesArray.forEach(item => {
    wrapper.innerHTML += `<li class="list-group-item">${item}</li>`;
  });
}




function onListItemClick(event) {
  Array.from(filesList.children).forEach(item => {
    item.classList.remove('active');
  });
  event.target.classList.add('active');
  downloadInput.value = event.target.innerText;
  enableButton(downloadButton);
}

function loadAvailableFiles() {
  apiLoadFiles()
    .then(response => {
      Array.from(filesList.children).forEach(item => {
        filesList.removeChild(item);
      });
      response.forEach((item, index) => {
        filesList.innerHTML += `<li class="list-group-item">${item}</li>`;
      });
      // filesList.addEventListener('click', onListItemClick);
    })
    .catch(err => {
      downloadError.innerText = `Error! ${err.status}: ${err.statusText}`;
      showElement(downloadError);
    });
}