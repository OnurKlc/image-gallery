import React, {useEffect, useState} from 'react'
import {Button, Dropdown, Spin, message, Empty} from "antd";
import {LoadingOutlined} from '@ant-design/icons';
import iconSet from "./icon/selection.json";
import IcomoonReact from "icomoon-react";
import WebcamComponent from "./components/webcam/webcam";
import './App.scss'

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

function App() {
  const [response, setResponse] = useState()
  const [fileToUpload, setFileToUpload] = useState()
  const [displayImg, setDisplayImg] = useState()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [loader, setLoader] = useState(true)
  const [emptyData, setEmptyData] = useState(false)

  function uploadFile() {
    setLoader(true)
    const formData = new FormData();
    formData.append('package', fileToUpload, Date.now() + '!time!' + fileToUpload.name);
    fetch("http://localhost:9000/img", {
      method: 'POST',
      body: formData
    })
      .then(response => response.text())
      .then(() => {
        setLoader(false)
        setDisplayImg()
        getImages();
      })
      .catch((error) => {
        console.error('Error:', error)
        message.error('An error occured')
        setLoader(false)
      });
  }

  const showFiles = (e) => {
    console.log(e.target.files[0])
    setFileToUpload(e.target.files[0])
    setDisplayImg(URL.createObjectURL(e.target.files[0]))
  }

  const getImages = () => {
    fetch("http://localhost:9000/img")
      .then(res => res.text())
      .then(res => JSON.parse(res))
      .then(res => {
        if (res.length === 0) {
          setEmptyData(true)
        } else {
          setEmptyData(false)
          setResponse(res)
        }
        setLoader(false)
      })
      .catch(() => {
        message.error('An error occured')
        setLoader(false)
      })
  }

  const setImgSrc = (data) => {
    fetch(data)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], Date.now + '-screenshot',{ type: "image/png" })
        setFileToUpload(file)
      })
    setDisplayImg(data)
  }

  const uploadMenu = () => (
    <div className="upload-menu">
      <Button>
        <input id="fileupload" name="myfile" type="file" onChange={showFiles} style={{display: 'none'}}/>
        <label htmlFor="fileupload" id="fileuploadlabel" className="custom-file-input">Upload Photo From Your
          Device</label>
      </Button>
      <div>
        <WebcamComponent setImgSrc={setImgSrc}/>
      </div>
    </div>
  )

  useEffect(() => getImages(), [])

  return (
    <div className="App">
      <div className="upload-container">
        <Dropdown overlay={uploadMenu}>
          <button className="camera-button" onClick={() => setDropdownVisible(!dropdownVisible)}>
            <IcomoonReact className="camera-icon" iconSet={iconSet} color="#000" size={50}
                          icon="camera"/>
          </button>
        </Dropdown>
      </div>
      {!loader &&
      <>
        <div className="upload-img-container">
          {displayImg && (
            <>
              <div style={{height: 'calc(100% - 32px)'}}>
                <img src={displayImg} alt={fileToUpload?.name || 'screen shot'}/>
              </div>
              <Button onClick={uploadFile}>Upload</Button>
            </>
          )}
        </div>
        {!emptyData && (
          <div className="gallery-container">
            {response && response.map(item => (
              <img key={item} className="gallery-item" src={'http://localhost:9000/images/' + item} alt={item}/>
            ))}
          </div>)}
      </>}
      {loader && <Spin indicator={antIcon}/>}
      {!loader && emptyData && (
        <div className="empty-container">
          <Empty/>
        </div>)}
    </div>
  )
}

export default App
