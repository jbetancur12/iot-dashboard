import axios from 'axios'
import React, { ChangeEvent, FormEvent, useState } from 'react'

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      axios
        .post(process.env.REACT_APP_BASE_URL + '/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((response) => {
          console.log('Archivo cargado con éxito')
        })
        .catch((error) => {
          console.error('Error al cargar el archivo', error)
        })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Cargar archivo</button>
    </form>
  )
}

export default FileUploader
