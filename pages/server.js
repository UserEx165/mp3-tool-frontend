import { useState } from 'react'

export default function ServerMode() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState(null)

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || '' // e.g. https://your-backend.onrender.com

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null)
    setDownloadUrl(null)
  }

  const handleProcess = async () => {
    if (!file) return alert('Select a file first')
    if (!backend) return alert('Backend URL is not set. Define NEXT_PUBLIC_BACKEND_URL in Vercel environment variables.')
    setLoading(true)

    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${backend.replace(/\/$/,'')}/convert`, { method: 'POST', body: form })
      const data = await res.json()
      if (data?.success && data?.downloadUrl) {
        setDownloadUrl(data.downloadUrl)
      } else {
        throw new Error(data?.error || 'Unknown server error')
      }
    } catch (e) {
      alert('Server error: ' + e.message)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>MP3 Converter (Server‑Side)</h1>
      <p className="muted">
        This page sends your file to a backend (Render free tier) for conversion.
      </p>

      <div className="notice">
        <strong>Backend URL:</strong> <code>{backend || '(not set)'}</code><br />
        Set <code>NEXT_PUBLIC_BACKEND_URL</code> in your Vercel project → Settings → Environment Variables.
      </div>

      <input type="file" accept="audio/*,video/*" onChange={handleFileChange} />
      <button onClick={handleProcess} disabled={loading || !file}>
        {loading ? 'Processing…' : 'Upload & Convert'}
      </button>

      {downloadUrl && (
        <div className="result">
          <a href={downloadUrl} target="_blank" rel="noreferrer">Download MP3</a>
        </div>
      )}

      <p style={{marginTop: 24}}><a href="/">← Back to In‑Browser version</a></p>
    </div>
  )
}
