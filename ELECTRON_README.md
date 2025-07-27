# 🖥️ Expense Tracker AI - Desktop Application

Your expense tracker has been successfully converted to a cross-platform desktop application using Electron!

## 🚀 Quick Start

### Development Mode
Run the app in development mode with hot reloading:
```bash
npm run electron-dev
```
This starts both the Next.js dev server and Electron app simultaneously.

### Production Build
Build the app for distribution:
```bash
# Build for current platform
npm run dist

# Build for specific platforms
npm run dist-mac     # macOS DMG
npm run dist-win     # Windows installer
npm run dist-linux  # Linux AppImage & DEB
```

## 📦 Available Scripts

- `npm run electron-dev` - Development mode with hot reload
- `npm run electron` - Run Electron with built files
- `npm run export` - Build static files for Electron
- `npm run dist` - Build installer for current platform
- `npm run dist-mac` - Build macOS DMG installer
- `npm run dist-win` - Build Windows NSIS installer
- `npm run dist-linux` - Build Linux AppImage and DEB

## 🎨 Desktop Features

### Native Menus
- **File Menu**: New Expense (Cmd/Ctrl+N), Exit
- **View Menu**: Navigate between pages with keyboard shortcuts
  - Dashboard (Cmd/Ctrl+1)
  - Expenses (Cmd/Ctrl+2)
  - Analytics (Cmd/Ctrl+3)
- **Window Menu**: Minimize, Close, Developer Tools
- **Help Menu**: About dialog

### Keyboard Shortcuts
- `Cmd/Ctrl+N` - New Expense
- `Cmd/Ctrl+1` - Dashboard
- `Cmd/Ctrl+2` - Expenses List
- `Cmd/Ctrl+3` - Analytics
- `Cmd/Ctrl+R` - Reload
- `Cmd/Ctrl+Shift+R` - Force Reload
- `Cmd/Ctrl+Alt+I` - Toggle Developer Tools

### Window Management
- **Responsive**: Minimum size 800x600, opens at 1200x800
- **Platform Native**: Proper title bars for each OS
- **External Links**: Opens in default browser
- **Security**: Sandboxed with context isolation

## 🔧 Configuration

### App Settings
The app configuration is in `package.json` under the `build` section:
- **App ID**: com.expensetracker.app
- **Product Name**: Expense Tracker AI
- **Output Directory**: dist/

### Platform-Specific Settings
- **macOS**: DMG installer, Finance category, Universal binary (x64 + arm64)
- **Windows**: NSIS installer with custom install directory
- **Linux**: AppImage and DEB packages

## 📁 File Structure
```
expense-tracker-ai/
├── electron/
│   └── main.js              # Electron main process
├── out/                     # Next.js static export
├── dist/                    # Built installers
├── public/
│   └── icon.png            # App icon (add your own)
└── package.json            # Electron config & scripts
```

## 🎯 Icon Setup

To add a custom app icon:

1. **Create Icons**:
   - `public/icon.png` (512x512 for Linux)
   - `public/icon.ico` (Windows, multiple sizes)
   - `public/icon.icns` (macOS, multiple sizes)

2. **Uncomment in main.js**:
   ```javascript
   icon: path.join(__dirname, '../public/icon.png'),
   ```

3. **Recommended Tools**:
   - [Iconify](https://iconify.design/) for icon creation
   - [CloudConvert](https://cloudconvert.com/) for format conversion

## 🛠️ Development Tips

### Hot Reload
In development mode, the app automatically reloads when you make changes to your React components.

### DevTools
- Press `Cmd/Ctrl+Alt+I` to open Developer Tools
- Or use the View menu → Toggle Developer Tools

### Debugging
- Check Electron logs in the terminal
- Use `console.log()` in your React components
- Main process debugging with `console.log()` in `electron/main.js`

## 📦 Distribution

### Before Building
1. Test thoroughly in development mode
2. Add your custom app icon
3. Update version in `package.json`
4. Consider code signing for production releases

### Building Installers
```bash
# Build for your current platform
npm run dist

# The installer will be in the dist/ folder
```

### File Sizes
- **macOS DMG**: ~150-200MB
- **Windows Installer**: ~120-150MB
- **Linux AppImage**: ~120-150MB

## 🔒 Security Features

- **Context Isolation**: Enabled for security
- **Node Integration**: Disabled in renderer
- **Sandboxed Environment**: Secure by default
- **External Link Handling**: Opens in default browser

## 🌟 Benefits of Desktop App

✅ **Offline Access**: Works without internet
✅ **Native Feel**: OS-specific menus and shortcuts
✅ **File System**: Could add file import/export features
✅ **Privacy**: Data stays on device
✅ **Performance**: No browser overhead
✅ **Auto-updater**: Can be added for seamless updates

## 🐛 Troubleshooting

### Common Issues

**App won't start**:
- Check if port 3000 is available
- Run `npm run export` first to build static files

**Build fails**:
- Ensure all dependencies are installed
- Check that `out/` directory exists after export

**Icon not showing**:
- Verify icon file exists and is proper format
- Uncomment icon line in `electron/main.js`

### Logs
- **Development**: Check terminal output
- **Production**: Check system console/logs

---

🎉 **Your expense tracker is now a full desktop application!**

The app maintains all the web features while adding native desktop functionality like menus, keyboard shortcuts, and installers for distribution.
