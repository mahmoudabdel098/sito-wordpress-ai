import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Link2Digital | Web Agency Milano',
    short_name: 'Link2Digital',
    description: 'Elite Web Agency a Milano. Design cinematico e performance Next.js.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#CCFF00',
    icons: [
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}
