import { useEffect, useRef, useState } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

export default function Home() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [ready, setReady] = useState(false)
  const ffmpegRef = useRef(new FFmpeg())

  useEffect(() => {
    const load = async () => {
      try {
        const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd'
        const ffmpeg = ffmpegRef.current
        ffmpeg.on('progress', ({ progress }) => {
          if (typeof progress === 'number') setProgress(Math.round(progress * 100))
        })
        // toBlobURL helps avoid CORS issues when loading core
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        })
        setReady(true)
      } catch (e) {
        alert('Failed to load FFmpeg core. Please refresh and try again.')
        console.error(e)
      }
    }
    load()
  }, [])

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null)
    setDownloadUrl(null)
  }

  const handleConvert = async () => {
    if (!file) return alert('Select a file first')
    if (!ready) return alert('FFmpeg is still loading, please wait a moment.')
    setLoading(true)
    setProgress(0)
    setDownloadUrl(null)

    try {
      const ffmpeg = ffmpegRef.current
      await ffmpeg.writeFile('input', await fetchFile(file))
      // -q:a 2 is high quality VBR. Customize as needed.
      await ffmpeg.exec(['-i', 'input', '-vn', '-codec:a', 'libmp3lame', '-q:a', '2', 'output.mp3'])
      const data = await ffmpeg.readFile('output.mp3')
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg' }))
      setDownloadUrl(url)
    } catch (err) {
      console.error(err)
      alert('Conversion failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>MP3 Converter (100% In‑Browser)</h1>
      <p className="muted">
        Your files never leave your device. Conversion runs in your browser via WebAssembly.
      </p>

      <input type="file" accept="audio/*,video/*" onChange={handleFileChange} />

      <button disabled={loading || !ready || !file} onClick={handleConvert}>
        {loading ? `Processing… ${progress}%` : 'Convert to MP3'}
      </button>

      {downloadUrl && (
        <div className="result">
          <audio controls src={downloadUrl} />
          <div className="actions">
            <a href={downloadUrl} download={(file?.name?.split('.').slice(0,-1).join('.') || 'converted') + '.mp3'}>
              Download MP3
            </a>
          </div>
        </div>
      )}

      <hr />
      <p>
        Need server-side conversion (e.g., low-powered devices)? Try the{' '}
        <a href="/server" style={{ textDecoration: 'underline' }}>server-based page</a>.
      </p>

      <div className="adslot">
        {/* Example AdSense unit (add after approval)
        <ins className="adsbygoogle"
             style={{display:'block'}}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="YYYYYYYYYY"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <Script id="adsbygoogle-push" strategy="afterInteractive">
          {(\`(adsbygoogle = window.adsbygoogle || []).push({});\`)}
        </Script>
        */}
      </div>
    </div>
  )
}
