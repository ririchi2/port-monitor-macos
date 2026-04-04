const { app, BrowserWindow, Tray, nativeImage } = require('electron')
const path = require('path')
const { execSync } = require('child_process')

let tray = null
let win = null

app.whenReady().then(() => {
  // Ocultar del Dock
  app.dock.hide()

  // Crear icono en la barra de menús
  const icon = nativeImage.createFromPath(path.join(__dirname, 'assets/network-5.png'))
  icon.setTemplateImage(true)
  tray = new Tray(icon)
  tray.setToolTip('Puertos en uso')

  // Crear ventana popup (oculta inicialmente)
  win = new BrowserWindow({
    width: 320,
    height: 420,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  // Toggle al hacer click en el icono
  tray.on('click', (event, bounds) => {
    if (win.isVisible()) {
      win.hide()
    } else {
      // Posicionar justo debajo del icono
      win.setPosition(
        Math.round(bounds.x - 160 + bounds.width / 2),
        Math.round(bounds.y + bounds.height)
      )
      win.show()
      win.webContents.send('refresh-ports')
    }
  })

  // Cerrar al perder foco
  win.on('blur', () => win.hide())
})

// Función para obtener puertos (llamada desde preload)
function getPorts() {
  try {
    const output = execSync('lsof -iTCP -sTCP:LISTEN -P -n', {
      encoding: 'utf8'
    })
    return parsePorts(output)
  } catch (e) {
    return []
  }
}

function parsePorts(output) {
  return output
    .split('\n')
    .slice(1) // skip header
    .filter(Boolean)
    .map(line => {
      const parts = line.trim().split(/\s+/)
      const address = parts[8] || ''
      const port = address.split(':').pop()
      return { process: parts[0], port: `:${port}`, pid: parts[1] }
    })
    .filter(p => p.port !== ':')
}

// Exponer al renderer via IPC
const { ipcMain } = require('electron')
ipcMain.handle('get-ports', () => getPorts())
