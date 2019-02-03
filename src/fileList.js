/* global downloadInput, enableButton, downloadButton, loadFiles, downloadError, showElement */

const filesList = document.querySelector('.list-group');

function onListItemClick(event) {
  Array.from(filesList.children).forEach(item => {
    item.classList.remove('active');
  });
  event.target.classList.add('active');
  downloadInput.value = event.target.innerText;
  enableButton(downloadButton);
}

function loadAvailableFiles() {
  loadFiles()
    .then(response => {
      Array.from(filesList.children).forEach(item => {
        filesList.removeChild(item);
      });
      response.forEach((item, index) => {
        filesList.innerHTML += `<li class="list-group-item">${item}</li>`;
      });
      filesList.addEventListener('click', onListItemClick);
    })
    .catch(err => {
      downloadError.innerText = `Error! ${err.status}: ${err.statusText}`;
      showElement(downloadError);
    });
}