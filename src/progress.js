const title = document.querySelector('title');

function changeProgressBar(progressParams) {
  const { nodeEl, event, onLoadedCallback, titlePercentage } = progressParams;
  const percentComplete = Math.round(event.loaded / event.total * 100);

  if (titlePercentage) {
    title.innerText = `Form ${percentComplete}%`;
  } else {
    nodeEl.innerText = `${percentComplete}%`;
  }

  nodeEl.style.width = `${percentComplete}%`;

  if (event.loaded === event.total) {
    setTimeout(() => {
      onLoadedCallback();

      if (titlePercentage) {
        title.innerText = 'Form';
      } else {
        nodeEl.innerText = '0%';
      }
      nodeEl.parentElement.classList.add('transparent');
      nodeEl.style.width = '0%';
    }, 1500);
  }
}