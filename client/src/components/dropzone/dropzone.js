import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { DownloadOutlined } from '@ant-design/icons'

import './dropzone.scss'

function Dropzone ({ setFilesToUpload }) {
  const onDrop = useCallback(acceptedFiles => {
    setFilesToUpload(acceptedFiles)
  }, [setFilesToUpload])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      {
        isDragActive
          ? <p>Drop the files here ...</p>
          : <div style={{ display: 'flex', flexDirection: 'column' }}>
            <DownloadOutlined style={{ fontSize: '36px' }} />
            <p>Drag &#39;n&#39; drop some files here, or select from folder.</p>
          </div>
      }
    </div>
  )
}

export default Dropzone
