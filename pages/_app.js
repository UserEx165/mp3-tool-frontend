import '@/styles/globals.css'
import Script from 'next/script'

// ⛔️ AdSense: Replace with your publisher ID after your site is approved.
// Keep this commented until approval to avoid policy issues.
// <Script
//   id="adsbygoogle-init"
//   async
//   strategy="afterInteractive"
//   src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
//   crossOrigin="anonymous"
// />

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
