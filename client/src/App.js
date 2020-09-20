import React, {useEffect, useState} from 'react'
import {Button, Dropdown, Spin, message, Empty} from "antd";
import {LoadingOutlined} from '@ant-design/icons';
import iconSet from "./icon/selection.json";
import IcomoonReact from "icomoon-react";

import Dropzone from "./components/dropzone/dropzone";
import WebcamComponent from "./components/webcam/webcam";
import ImageModal from "./components/imageModal/imageModal";
import './App.scss'

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

function App() {
  const [isMobile, setIsMobile] = useState()
  const [response, setResponse] = useState()
  const [filesToUpload, setFilesToUpload] = useState()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [emptyData, setEmptyData] = useState(false)
  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  const [selectedImg, setSelectedImg] = useState()

  const updateIsMobile = () => {
    const width = window.innerWidth;
    if (width < 768) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  };

  const uploadImage = () => {
    setIsLoading(true)
    const formData = new FormData();
    filesToUpload.map(file => formData.append('package', file, Date.now() + '!time!' + file.name))
    fetch("http://localhost:9000/img", {
      method: 'POST',
      body: formData
    })
      .then(response => response.text())
      .then(() => {
        setIsLoading(false)
        setFilesToUpload()
        getImages();
      })
      .catch((error) => {
        console.error('Error:', error)
        message.error('An error occured')
        setIsLoading(false)
      });
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
        setIsLoading(false)
      })
      .catch(() => {
        message.error('An error occured')
        setIsLoading(false)
      })
  }

  const showFiles = (e) => {
    let files = e.currentTarget.files;
    files = Array.from(files)
    setFilesToUpload(files)
  }

  const setImgSrc = (data) => {
    fetch(data)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], Date.now + '-screenshot', {type: "image/png"})
        setFilesToUpload([file])
      })
  }

  const uploadMenu = () => (
    <div className="upload-menu">
      <Button>
        <input id="fileupload" name="myfile" multiple type="file" onChange={showFiles} style={{display: 'none'}}/>
        <label htmlFor="fileupload" id="fileuploadlabel" className="custom-file-input">Upload Photo From Your
          Device</label>
      </Button>
      <div>
        <WebcamComponent setImgSrc={setImgSrc}/>
      </div>
    </div>
  )

  const onImgClick = (data) => {
    setIsImageModalVisible(true);
    setSelectedImg(data)
  }

  useEffect(() => {
    updateIsMobile()
    getImages()
    window.addEventListener('resize', updateIsMobile)
    return () => window.removeEventListener('resize', updateIsMobile)
  }, [])

  return (
    <div className="App">
      {isMobile && (
        <div className="upload-container">
          <Dropdown overlay={uploadMenu} trigger={['click']}>
            <button className="camera-button" onClick={() => setDropdownVisible(!dropdownVisible)}>
              <IcomoonReact className="camera-icon" iconSet={iconSet} color="#000" size={50}
                            icon="camera"/>
            </button>
          </Dropdown>
        </div>
      )}
      {!isMobile && <Dropzone setFilesToUpload={(files) => setFilesToUpload(files)} />}
      {!isLoading &&
      <>
        <div className="upload-img-container">
          {filesToUpload && (
            <>
              <div className="upload-img-list">
                {filesToUpload.map(file => (
                  <img src={URL.createObjectURL(file)} alt={file.name || 'screen shot'}/>
                ))}
              </div>
              <Button onClick={uploadImage}>Upload</Button>
            </>
          )}
        </div>
        {!emptyData && (
          <div className="gallery-container">
            {response && response.map(item => (
              <img key={item} className="gallery-item" onClick={() => onImgClick(item)}
                   src={'http://localhost:9000/images/' + item} alt={item}/>
            ))}
          </div>)}
      </>}
      {isLoading && <Spin indicator={antIcon}/>}
      {!isLoading && emptyData && (
        <div className="empty-container">
          <Empty/>
        </div>)}
      {isImageModalVisible && <ImageModal url={selectedImg} onClose={() => setIsImageModalVisible(false)}/>}
    </div>
  )
}

export default App
