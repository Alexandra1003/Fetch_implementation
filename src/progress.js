const request = new HttpRequest({ baseUrl: 'http://localhost:8000' }); // eslint-disable-line

document.getElementById('uploadForm').onsubmit = function (e) { // eslint-disable-line
  e.preventDefault();
  const form = new FormData();
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'multipart/form-data');
  form.append('sampleFile', e.target.sampleFile.files[0]);
  request.post('/upload', { data: form }).then(data => {
    console.log(data); // eslint-disable-line
  })
    .catch(err => {
      console.log(err); // eslint-disable-line
    });
};


// document.getElementById('downloadForm').onsubmit = function(e) {
//   debugger
//   e.preventDefault();
//   const form = new FormData();
//   const myHeaders = new Headers();
//   myHeaders.append('Content-Type', 'multipart/form-data');
//   /* form.append('sampleFile', e.target.sampleFile.files[0]); */

//   request.get('/files/styles.css', { headers, params: {id: 1234}, responseType: "text" })
//   .then(response => {
//     console.log('response', response);
//   })
//   .catch(e => {
//     console.log('error', e);
//   });