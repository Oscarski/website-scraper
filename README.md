# Website Screenshot Generator 📸

A simple Node.js CLI tool that captures PNG screenshots of any list of URLs using headless Chrome (Puppeteer).

## Features

- 🚀 Fast screenshot capture using headless Chrome
- 📱 Customizable viewport dimensions
- 📄 Full-page screenshot support
- 🎯 Multiple URL support in a single command
- 📁 Custom output directory
- 🔒 Safe URL-to-filename conversion

## Requirements

- Node.js ≥ 18
- npm or yarn

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Basic Usage

```bash
# Capture a single website
node screenshooter.js https://example.com

# Capture multiple websites
node screenshooter.js https://example.com https://openai.com https://github.com
```

### Command Line Options

- `-o <dir>` - Output directory (default: `screenshots`)
- `-w <px>` - Viewport width in pixels (default: `1366`)
- `-h <px>` - Viewport height in pixels (default: `768`)
- `-f` - Capture full-page screenshot instead of just the viewport

### Examples

```bash
# Capture with custom dimensions
node screenshooter.js -w 1920 -h 1080 https://www.facebook.com

# Capture full-page screenshot
node screenshooter.js -f https://www.github.com

# Custom output directory
node screenshooter.js -o my_screenshots https://example.com

# Combine all options
node screenshooter.js -o shots -w 1920 -h 1080 -f https://www.facebook.com
```

## Output

Screenshots are saved as PNG files in the specified output directory (default: `screenshots/`). Filenames are automatically generated from the URLs with special characters replaced by underscores.

Example output:
```
screenshots/
├── example_com.png
├── openai_com.png
└── github_com.png
```

## Security Note

The script launches Chrome in headless mode with the `--no-sandbox` flag for ease of use. Remove this flag or run inside a container if you need stricter isolation.

## Troubleshooting

### Common Issues

1. **Chrome not found**: Make sure you have Chrome/Chromium installed
2. **Permission errors**: Try running with `sudo` or check file permissions
3. **Timeout errors**: Some websites may take longer to load, consider increasing the timeout

### Dependencies

If you encounter issues with Puppeteer, you may need to install additional system dependencies:

**Ubuntu/Debian:**
```bash
sudo apt-get install -y \
    gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
    libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 \
    libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 \
    libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation \
    libappindicator1 libnss3 lsb-release xdg-utils wget
```

**macOS:**
```bash
# Usually no additional dependencies needed
```

## License

MIT License - feel free to use this project for any purpose. 