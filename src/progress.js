const title = document.querySelector('title');
const titleName = title.innerText;

function changeProgressBar(progressParams) {
  const { nodeEl, event, onLoadedCallback, titlePercentage } = progressParams;
  const percentComplete = Math.round(event.loaded / event.total * 100);

  if (titlePercentage) {
    title.innerText = `${titleName} ${percentComplete}%`;
  } else {
    nodeEl.innerText = `${percentComplete}%`;
  }

  nodeEl.style.width = `${percentComplete}%`;

  if (event.loaded === event.total) {
    setTimeout(() => {
      onLoadedCallback();

      if (titlePercentage) {
        title.innerText = titleName;
      } else {
        nodeEl.innerText = '0%';
      }
      nodeEl.parentElement.classList.add('transparent');
      nodeEl.style.width = '0%';
    }, 1500);
  }
}