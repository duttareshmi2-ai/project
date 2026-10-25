const { app, BrowserWindow } = require('electron');
const path = require('path');
let win;
const send = (ch, p) => { if (win && !win.isDestroyed()) win.webContents.send(ch, p); };

function startBle() {
  let noble;
  try { noble = require('@stoprocent/noble'); }
  catch (e) { return send('ble-state', { state: 'error', msg: e.message }); }
  noble.on('stateChange', async (s) => {
    send('ble-state', { state: s });
    if (s === 'poweredOn') {
      try { await noble.startScanningAsync([], true); }
      catch (e) { send('ble-state', { state: 'error', msg: e.message }); }
    } else { try { noble.stopScanning(); } catch {} }
  });
  noble.on('discover', (p) => {
    const a = p.advertisement || {};
    const m = a.manufacturerData;
    send('ble-device', {
      id: p.id || p.address, address: p.address || '', name: a.localName || '',
      rssi: p.rssi, connectable: !!p.connectable,
      mfr: m && m.length >= 2 ? m.readUInt16LE(0) : null,
      services: (a.serviceUuids || []).length
    });
  });
}

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 1180, height: 760, minWidth: 900, minHeight: 600,
    backgroundColor: '#05080d', autoHideMenuBar: true,
    title: "Adwaita's Bluetooth Radar", icon: path.join(__dirname, 'renderer', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true }
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.webContents.once('did-finish-load', startBle);
});
app.on('window-all-closed', () => app.quit());
