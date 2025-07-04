# 📸 Website Screenshot Generator

A powerful Node.js tool that captures high-quality screenshots and PDFs of websites using headless Chrome (Puppeteer). Features both a modern web interface and command-line interface.

![Website Screenshot Generator](https://img.shields.io/badge/Node.js-18+-green)
![Puppeteer](https://img.shields.io/badge/Puppeteer-21+-blue)
![Express](https://img.shields.io/badge/Express-4.18+-orange)

## ✨ Features

### 🎨 **Web Interface**
- **Modern ChatGPT-like design** with responsive layout
- **Real-time screenshot capture** with instant preview
- **Multiple URL support** with page navigation
- **PDF export** with professional formatting
- **Customizable viewport dimensions**
- **Full-page screenshot option**
- **Error handling** with user-friendly messages

### 🖥️ **Command Line Interface**
- **Batch processing** of multiple URLs
- **Custom output directory**
- **Viewport customization**
- **Full-page capture option**
- **URL validation and error handling**

### 📱 **Advanced Capabilities**
- **Device emulation** (responsive design testing)
- **Multiple format support** (PNG, PDF)
- **Batch processing** with progress tracking
- **Custom headers and authentication**
- **Timeout and retry mechanisms**

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **npm** or **yarn**
- **Chrome/Chromium** browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Oscarski/website-scraper.git
   cd website-scraper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the web interface**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to: **http://localhost:3000**

## 📖 Usage

### 🌐 Web Interface

#### Single URL Capture
1. Enter a URL in the input field
2. Adjust settings (width, height, format)
3. Click "Capture Screenshot"
4. Download your result

#### Multiple URLs
1. Click "Multiple URLs" toggle
2. Enter URLs (one per line):
   ```
   https://example.com
   https://openai.com
   https://github.com
   ```
3. Click "Capture Screenshot"
4. Use navigation buttons to browse results

#### PDF Export
1. Select "PDF" from the format dropdown
2. Enter URL and capture
3. Download the generated PDF

### 💻 Command Line Interface

#### Basic Usage
```bash
# Single URL
npm run cli https://example.com

# Multiple URLs
npm run cli https://example.com https://openai.com https://github.com
```

#### Advanced Options
```bash
# Custom dimensions and full-page
npm run cli -w 1920 -h 1080 -f https://www.github.com

# Custom output directory
npm run cli -o my_screenshots https://example.com

# Combine all options
npm run cli -o shots -w 1920 -h 1080 -f https://www.facebook.com
```

#### Command Line Options
| Option | Description | Default |
|--------|-------------|---------|
| `-o <dir>` | Output directory | `screenshots` |
| `-w <px>` | Viewport width | `1366` |
| `-h <px>` | Viewport height | `768` |
| `-f` | Full-page screenshot | `false` |

## 🛠️ API Reference

### Web API Endpoint

**POST** `/api/capture`

**Request Body:**
```json
{
  "url": "https://example.com",
  "width": 1366,
  "height": 768,
  "fullPage": false,
  "format": "png"
}
```

**Response:**
```json
{
  "success": true,
  "screenshotPath": "/screenshots/example_com.png",
  "filename": "example_com.png",
  "format": "png"
}
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |

## 📁 Project Structure

```
website-scraper/
├── index.html          # Web interface
├── styles.css          # UI styling
├── script.js           # Frontend logic
├── server.js           # Express server
├── screenshooter.js    # CLI tool
├── package.json        # Dependencies
├── README.md           # Documentation
├── .gitignore          # Git exclusions
└── screenshots/        # Generated files
```

## 🔧 Configuration

### Custom Viewport Sizes

Common device dimensions:
```javascript
// Desktop
width: 1920, height: 1080  // Full HD
width: 1366, height: 768   // Standard

// Tablet
width: 768, height: 1024   // iPad
width: 1024, height: 768   // iPad Landscape

// Mobile
width: 375, height: 667    // iPhone
width: 414, height: 896    // iPhone Plus
```

### PDF Settings

The PDF generation uses these default settings:
```javascript
{
  format: 'A4',
  printBackground: true,
  margin: {
    top: '20px',
    right: '20px',
    bottom: '20px',
    left: '20px'
  }
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Chrome Not Found
```bash
# Ubuntu/Debian
sudo apt-get install -y chromium-browser

# macOS
brew install chromium

# Windows
# Download from https://www.chromium.org/
```

#### 2. Permission Errors
```bash
# Run with sudo (if needed)
sudo npm start

# Or check file permissions
chmod +x start-ui.sh
```

#### 3. Port Already in Use
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

#### 4. Puppeteer Dependencies (Linux)
```bash
sudo apt-get install -y \
    gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
    libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 \
    libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 \
    libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation \
    libappindicator1 libnss3 lsb-release xdg-utils wget
```

### Debug Mode

Enable debug logging:
```bash
DEBUG=puppeteer:* npm start
```

## 🔒 Security Considerations

- **Headless Mode**: Chrome runs in headless mode for security
- **Sandbox**: Consider removing `--no-sandbox` for production
- **Timeouts**: Default 60-second timeout prevents hanging
- **File Permissions**: Screenshots saved with appropriate permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Puppeteer** - Chrome automation
- **Express.js** - Web framework
- **Chrome DevTools Protocol** - Browser automation

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Oscarski/website-scraper/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Oscarski/website-scraper/discussions)

---

**Made with ❤️ by [Oscarski](https://github.com/Oscarski)** 