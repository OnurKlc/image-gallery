import React, {useCallback, useState} from 'react'
import {Modal, Slider, Button} from 'antd'
import Cropper from 'react-easy-crop'
import IcomoonReact from "icomoon-react";

import './imageModal.scss'
import getCroppedImg from './cropImage'
import iconSet from "../../icon/selection.json";
import * as Constants from "../../constants/constants"


function ImageModal({onClose, src, type, uploadEditedImage}) {
  const [crop, setCrop] = useState({x: 0, y: 0})
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [edit, setEdit] = useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)

  const img = type === Constants.IMAGE_MODAL_VIEW_TYPE ? 'http://localhost:9000/images/' + src : src;

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        img,
        croppedAreaPixels,
        rotation
      )
      console.log('donee', {croppedImage})
      setCroppedImage(croppedImage)
      setEdit(false)
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, rotation, img])

  const onUploadClick = () => {
    uploadEditedImage(croppedImage)
    onClose()
  }

  const footer = () => (
    <>
      <div className="zoom-slider">
        <div>Zoom</div>
        <Slider
          min={1}
          max={4}
          step={0.1}
          onChange={(zoom) => setZoom(zoom)}
          defaultValue={1}/>
      </div>
      <div className="rotate-slider">
        <div>Rotate</div>
        <Slider
          min={1}
          max={360}
          step={1}
          onChange={(val) => setRotation(val)}
          defaultValue={0}/>
      </div>
    </>
  )

  return (
    <Modal
      visible
      centered
      onCancel={onClose}
      footer={edit ? footer() : null}
      wrapClassName="image-modal"
    >
      {edit && !croppedImage &&
      <>
        <Cropper
          image={img}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={4 / 3}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
        <Button onClick={showCroppedImage} style={{marginRight: '10px'}}>Save Edit</Button>
        <Button onClick={() => setEdit(false)}>Quit Edit</Button>
      </>
      }
      <span onClick={() => setEdit(!edit)}>
        <IcomoonReact
          className="crop-icon"
          iconSet={iconSet}
          color="#000"
          size={25}
          icon="crop"/>
      </span>
      {!edit && !croppedImage && <img src={img} alt=""/>}
      {croppedImage && (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Button onClick={onUploadClick}>Upload</Button>
          <img src={croppedImage} alt=""/>
        </div>
      )}
    </Modal>
  )
}

export default ImageModal
