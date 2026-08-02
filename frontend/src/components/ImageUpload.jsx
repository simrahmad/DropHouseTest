import { useState, useRef } from 'react'
import { useAuth } from '@clerk/clerk-react'  // ✅ ADD THIS
import axios from 'axios'

// drop an image onto the box or click to pick a file
// calls onUpload(url) when done
export default function ImageUpload({ onUpload, label = 'Upload image', currentUrl = '' }) {
  const { getToken } = useAuth()  // ✅ ADD THIS
  const [preview, setPreview] = useState(currentUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()

  async function handleFile(file) {
    if (!file) return
    setError('')
    setUploading(true)

    const formData = new FormData()
    formData.append('image', file)

    try {
      // ✅ GET THE AUTH TOKEN
      const token = await getToken()

      // ✅ SEND IT IN THE HEADERS
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`  // ✅ ADD THIS
        }
      })
      
      const url = 'http://localhost:5000' + res.data.imageUrl
      setPreview(url)
      onUpload(url)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={e => e.preventDefault()}
      onClick={() => inputRef.current.click()}
      style={{
        border: '2px dashed #f9a8d4',
        borderRadius: 12,
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        background: preview ? 'none' : '#fff5f9',
        position: 'relative',
        minHeight: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 8
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
      />

      {preview ? (
        <img
          src={preview}
          alt="preview"
          style={{
            width: '100%',
            maxHeight: 180,
            objectFit: 'cover',
            borderRadius: 8
          }}
        />
      ) : (
        <>
          <div style={{ fontSize: 32 }}>🖼️</div>
          <p style={{ color: '#be185d', fontSize: 14, margin: 0 }}>
            {uploading ? 'Uploading...' : label}
          </p>
          <p style={{ color: '#f9a8d4', fontSize: 12, margin: 0 }}>
            drag & drop or click to browse
          </p>
        </>
      )}

      {uploading && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,245,249,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 12, fontSize: 14, color: '#be185d'
        }}>
          Uploading...
        </div>
      )}

      {error && (
        <p style={{ color: '#e11d48', fontSize: 13, margin: '4px 0 0' }}>{error}</p>
      )}
    </div>
  )
}