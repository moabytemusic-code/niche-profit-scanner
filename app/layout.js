
import './globals.css';
export const metadata = {
    title: 'Affiliate Niche Profit Scanner™',
    description: 'AI-powered niche analysis for affiliate marketers.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
                <script src="https://cdn.tailwindcss.com"></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                      tailwind.config = {
                        theme: {
                          extend: {
                            colors: {
                              primary: '#6366f1',
                              accent: '#f59e0b',
                            }
                          }
                        }
                      }
                    `
                    }}
                />
            </head>
            <body className="antialiased bg-slate-900 text-slate-100">{children}</body>
        </html>
    )
}
