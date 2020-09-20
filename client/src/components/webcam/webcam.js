import React, {useRef, useState} from "react";
import Webcam from "react-webcam";
import {Modal, Button} from "antd";
import "./webcam.scss"

const WebcamComponent = ({setImgSrc}) => {
  const [modalVisibility, setModalVisibility] = useState(false)
  const webcamRef = useRef()

  const capture = React.useCallback(() => {
    setModalVisibility(false)
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  return (
    <>
      <Modal
        wrapClassName="webcam-modal"
        visible={modalVisibility}
        footer={null}
        centered
        siz
        onCancel={() => setModalVisibility(false)}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
        <Button onClick={capture}>Capture</Button>
      </Modal>
      <Button className="take-photo-button" onClick={() => setModalVisibility(true)}>Take a Photo</Button>
    </>
  );
};

export default WebcamComponent;
