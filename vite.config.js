import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pricingFilePath = path.resolve(__dirname, 'src/data/livePricing.json')
const bookingsFilePath = path.resolve(__dirname, 'src/data/customerBookings.json')

function pricingServerPlugin() {
  return {
    name: 'pricing-server-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Live Pricing Endpoint
        if (req.url === '/api/pricing') {
          if (req.method === 'GET') {
            try {
              if (fs.existsSync(pricingFilePath)) {
                const content = fs.readFileSync(pricingFilePath, 'utf-8')
                res.setHeader('Content-Type', 'application/json')
                res.setHeader('Cache-Control', 'no-cache')
                return res.end(content)
              }
            } catch (err) {
              console.error('Error reading livePricing.json', err)
            }
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify(null))
          } else if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                const dir = path.dirname(pricingFilePath)
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
                fs.writeFileSync(pricingFilePath, body, 'utf-8')
                res.setHeader('Content-Type', 'application/json')
                return res.end(JSON.stringify({ success: true }))
              } catch (e) {
                res.statusCode = 500
                return res.end(JSON.stringify({ error: e.message }))
              }
            })
            return
          }
        }

        // Live Bookings Endpoint
        if (req.url === '/api/bookings') {
          if (req.method === 'GET') {
            try {
              if (fs.existsSync(bookingsFilePath)) {
                const content = fs.readFileSync(bookingsFilePath, 'utf-8')
                res.setHeader('Content-Type', 'application/json')
                res.setHeader('Cache-Control', 'no-cache')
                return res.end(content)
              }
            } catch (err) {
              console.error('Error reading customerBookings.json', err)
            }
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify([]))
          } else if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                const newBooking = JSON.parse(body)
                let existing = []
                if (fs.existsSync(bookingsFilePath)) {
                  try {
                    existing = JSON.parse(fs.readFileSync(bookingsFilePath, 'utf-8')) || []
                  } catch {}
                }
                const idx = existing.findIndex(b => b.id === newBooking.id)
                if (idx >= 0) {
                  existing[idx] = { ...existing[idx], ...newBooking }
                } else {
                  existing.unshift(newBooking)
                }
                fs.writeFileSync(bookingsFilePath, JSON.stringify(existing, null, 2), 'utf-8')
                res.setHeader('Content-Type', 'application/json')
                return res.end(JSON.stringify({ success: true, booking: newBooking }))
              } catch (e) {
                res.statusCode = 500
                return res.end(JSON.stringify({ error: e.message }))
              }
            })
            return
          }
        }
        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), pricingServerPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true
  }
})
