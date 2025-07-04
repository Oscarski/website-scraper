const express = require('express');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for capturing screenshots
app.post('/api/capture', async (req, res) => {
    const { url, width = 1366, height = 768, fullPage = false, format = 'png' } = req.body;

    if (!url) {
        return res.status(400).json({
            success: false,
            error: 'URL is required'
        });
    }

    let browser;
    try {
        console.log(`Capturing screenshot of ${url}...`);

        // Launch browser
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewport({ width, height });

        // Navigate to URL
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // Generate filename
        const baseName = url
            .replace(/(^\w+:|^)\/\//, '')
            .replace(/[^\w.-]+/g, '_')
            .replace(/(_$)/, '');
        
        let filename, filePath, publicPath;

        if (format === 'pdf') {
            filename = baseName + '.pdf';
            filePath = path.join(screenshotsDir, filename);
            publicPath = `/screenshots/${filename}`;

            // Generate PDF
            await page.pdf({
                path: filePath,
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20px',
                    right: '20px',
                    bottom: '20px',
                    left: '20px'
                }
            });

            console.log(`✅ PDF saved: ${filePath}`);
        } else {
            filename = baseName + '.png';
            filePath = path.join(screenshotsDir, filename);
            publicPath = `/screenshots/${filename}`;

            // Take screenshot
            await page.screenshot({
                path: filePath,
                fullPage: fullPage
            });

            console.log(`✅ Screenshot saved: ${filePath}`);
        }

        res.json({
            success: true,
            screenshotPath: publicPath,
            filename: filename,
            format: format
        });

    } catch (error) {
        console.error(`❌ Error capturing ${url}:`, error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

// Serve screenshots directory
app.use('/screenshots', express.static(screenshotsDir));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Website Screenshot Generator running on http://localhost:${PORT}`);
    console.log(`📸 Screenshots will be saved to: ${screenshotsDir}`);
}); 