import React, {useEffect, useState} from 'react'
import './App.css'

function App () {
  const [ response, setResponse ] = useState()
  const [ fileToUpload, setFileToUpload ] = useState()
  const [ displayImg, setDisplayImg ] = useState()

  function uploadFile() {
    var formData = new FormData();
    formData.append('package', fileToUpload, fileToUpload.name);
    fetch("http://localhost:9000/img", {
      method: 'POST',
      body: formData
    })
      .then(response => response.text())
      .then(res => {
        console.log(res)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const showFiles = (e) => {
    setFileToUpload(e.target.files[0])
    setDisplayImg(URL.createObjectURL(e.target.files[0]))
  }

  const callAPI = () => {
    fetch("http://localhost:9000/img")
      .then(res => res.text())
      .then(res => setResponse(res));
  }

  useEffect(() => callAPI())

  return (
    <div className="App">
      <p className="App-intro">{response}</p>
      <div style={{textAlign: 'center', marginTop: '100px'}}>
        <input id="fileupload" name="myfile" type="file" onChange={showFiles} />
        <label htmlFor="fileupload" id="fileuploadlabel" className="custom-file-input" />
      </div>
      {displayImg &&
      <div><img width="200" height="200" src={displayImg} alt={fileToUpload.name}/>
      <button onClick={uploadFile}>Upload</button>
      </div>}
    </div>
  )
}

export default App
