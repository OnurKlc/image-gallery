import React from 'react'
import {Modal} from "antd";
import './imageModal.scss'

function ImageModal({onClose, url}) {

  return (
    <Modal
      visible
      centered
      onCancel={onClose}
      footer={null}
      wrapClassName="image-modal"
    >
      <img src={'http://localhost:9000/images/' + url} alt={url} />
    </Modal>
  )
}

export default ImageModal
