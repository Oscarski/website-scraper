document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const captureBtn = document.getElementById('captureBtn');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const fullPageCheckbox = document.getElementById('fullPage');
    const formatSelect = document.getElementById('format');
    const singleUrlBtn = document.getElementById('singleUrlBtn');
    const multipleUrlBtn = document.getElementById('multipleUrlBtn');
    const urlsTextarea = document.getElementById('urlsTextarea');
    const resultsSection = document.getElementById('resultsSection');
    const screenshotContainer = document.getElementById('screenshotContainer');
    const batchControls = document.getElementById('batchControls');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const errorSection = document.getElementById('errorSection');
    const errorMessage = document.getElementById('errorMessage');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');

    // Store multiple pages data
    let currentPages = [];
    let currentPageIndex = 0;

    // Handle Enter key in URL input
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            captureScreenshot();
        }
    });

    // Handle capture button click
    captureBtn.addEventListener('click', captureScreenshot);

    // Handle URL mode toggle
    singleUrlBtn.addEventListener('click', () => switchUrlMode('single'));
    multipleUrlBtn.addEventListener('click', () => switchUrlMode('multiple'));

    function switchUrlMode(mode) {
        if (mode === 'single') {
            singleUrlBtn.classList.add('active');
            multipleUrlBtn.classList.remove('active');
            urlInput.style.display = 'block';
            urlsTextarea.style.display = 'none';
            urlInput.focus();
        } else {
            singleUrlBtn.classList.remove('active');
            multipleUrlBtn.classList.add('active');
            urlInput.style.display = 'none';
            urlsTextarea.style.display = 'block';
            urlsTextarea.focus();
        }
    }

    function captureScreenshot() {
        const isMultipleMode = multipleUrlBtn.classList.contains('active');
        
        if (isMultipleMode) {
            captureMultipleScreenshots();
        } else {
            captureSingleScreenshot();
        }
    }

    function captureSingleScreenshot() {
        const url = urlInput.value.trim();
        
        if (!url) {
            showError('Please enter a valid URL');
            return;
        }

        if (!isValidUrl(url)) {
            showError('Please enter a valid URL (e.g., https://example.com)');
            return;
        }

        captureUrl(url);
    }

    function captureMultipleScreenshots() {
        const urlsText = urlsTextarea.value.trim();
        
        if (!urlsText) {
            showError('Please enter at least one URL');
            return;
        }

        const urls = urlsText.split('\n')
            .map(url => url.trim())
            .filter(url => url.length > 0);

        if (urls.length === 0) {
            showError('Please enter at least one valid URL');
            return;
        }

        // Validate all URLs
        const invalidUrls = urls.filter(url => !isValidUrl(url));
        if (invalidUrls.length > 0) {
            showError(`Invalid URLs: ${invalidUrls.join(', ')}`);
            return;
        }

        captureMultipleUrls(urls);
    }

    function captureUrl(url) {

        // Show loading state
        setLoadingState(true);
        hideError();
        hideResults();

        // Prepare request data
        const requestData = {
            url: url,
            width: parseInt(widthInput.value) || 1366,
            height: parseInt(heightInput.value) || 768,
            fullPage: fullPageCheckbox.checked,
            format: formatSelect.value
        };

        // Make API request
        fetch('/api/capture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                if (data.format === 'pdf') {
                    displayPDF(data.screenshotPath, url, data.filename);
                } else {
                    displayScreenshot(data.screenshotPath, url);
                }
            } else {
                throw new Error(data.error || 'Failed to capture screenshot');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError(`Failed to capture screenshot: ${error.message}`);
        })
        .finally(() => {
            setLoadingState(false);
        });
    }

    async function captureMultipleUrls(urls) {
        // Show loading state
        setLoadingState(true);
        hideError();
        hideResults();

        const pages = [];
        const format = formatSelect.value;
        const requestData = {
            width: parseInt(widthInput.value) || 1366,
            height: parseInt(heightInput.value) || 768,
            fullPage: fullPageCheckbox.checked,
            format: format
        };

        try {
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                console.log(`Capturing ${i + 1}/${urls.length}: ${url}`);

                const response = await fetch('/api/capture', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...requestData, url })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    pages.push({
                        url: url,
                        path: data.screenshotPath,
                        filename: data.filename,
                        format: data.format
                    });
                } else {
                    console.error(`Failed to capture ${url}: ${data.error}`);
                }
            }

            if (pages.length > 0) {
                setupPageNavigation(pages);
                showPage(0); // Show first page
            } else {
                showError('Failed to capture any screenshots');
            }

        } catch (error) {
            console.error('Error:', error);
            showError(`Failed to capture screenshots: ${error.message}`);
        } finally {
            setLoadingState(false);
        }
    }

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function setLoadingState(loading) {
        captureBtn.disabled = loading;
        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    }

    function displayScreenshot(screenshotPath, url) {
        const screenshotItem = document.createElement('div');
        screenshotItem.className = 'screenshot-item';
        
        const header = document.createElement('div');
        header.className = 'screenshot-header';
        
        const urlSpan = document.createElement('span');
        urlSpan.className = 'screenshot-url';
        urlSpan.textContent = url;
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'screenshot-download';
        downloadBtn.textContent = 'Download';
        downloadBtn.onclick = () => downloadScreenshot(screenshotPath, url);
        
        header.appendChild(urlSpan);
        header.appendChild(downloadBtn);
        
        const img = document.createElement('img');
        img.className = 'screenshot-image';
        img.src = screenshotPath;
        img.alt = `Screenshot of ${url}`;
        img.onload = () => {
            showResults();
        };
        img.onerror = () => {
            showError('Failed to load screenshot image');
        };
        
        screenshotItem.appendChild(header);
        screenshotItem.appendChild(img);
        
        // Clear previous results and add new one
        screenshotContainer.innerHTML = '';
        screenshotContainer.appendChild(screenshotItem);
    }

    function downloadScreenshot(screenshotPath, url, format = 'png') {
        const link = document.createElement('a');
        link.href = screenshotPath;
        link.download = generateFilename(url, format);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function generateFilename(url, format = 'png') {
        const baseName = url
            .replace(/(^\w+:|^)\/\//, '')
            .replace(/[^\w.-]+/g, '_')
            .replace(/(_$)/, '');
        return baseName + '.' + format;
    }

    function displayPDF(pdfPath, url, filename) {
        const pdfItem = document.createElement('div');
        pdfItem.className = 'screenshot-item';
        
        const header = document.createElement('div');
        header.className = 'screenshot-header';
        
        const urlSpan = document.createElement('span');
        urlSpan.className = 'screenshot-url';
        urlSpan.textContent = url;
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'screenshot-download';
        downloadBtn.textContent = 'Download PDF';
        downloadBtn.onclick = () => downloadScreenshot(pdfPath, url, 'pdf');
        
        header.appendChild(urlSpan);
        header.appendChild(downloadBtn);
        
        const pdfPreview = document.createElement('div');
        pdfPreview.className = 'pdf-preview';
        pdfPreview.innerHTML = `
            <div class="pdf-icon">📄</div>
            <div class="pdf-info">PDF generated successfully</div>
            <div style="color: #888; font-size: 12px;">${filename}</div>
        `;
        
        pdfItem.appendChild(header);
        pdfItem.appendChild(pdfPreview);
        
        // Clear previous results and add new one
        screenshotContainer.innerHTML = '';
        screenshotContainer.appendChild(pdfItem);
        showResults();
    }

    // Page navigation functions
    function setupPageNavigation(pages) {
        currentPages = pages;
        currentPageIndex = 0;
        
        if (pages.length > 1) {
            batchControls.style.display = 'flex';
            updatePageInfo();
            updateNavigationButtons();
        } else {
            batchControls.style.display = 'none';
        }
    }

    function updatePageInfo() {
        pageInfo.textContent = `Page ${currentPageIndex + 1} of ${currentPages.length}`;
    }

    function updateNavigationButtons() {
        prevPageBtn.disabled = currentPageIndex === 0;
        nextPageBtn.disabled = currentPageIndex === currentPages.length - 1;
    }

    function showPage(pageIndex) {
        if (pageIndex >= 0 && pageIndex < currentPages.length) {
            currentPageIndex = pageIndex;
            const page = currentPages[pageIndex];
            
            if (page.format === 'pdf') {
                displayPDF(page.path, page.url, page.filename);
            } else {
                displayScreenshot(page.path, page.url);
            }
            
            updatePageInfo();
            updateNavigationButtons();
        }
    }

    function showResults() {
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    function hideResults() {
        resultsSection.style.display = 'none';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorSection.style.display = 'block';
        errorSection.scrollIntoView({ behavior: 'smooth' });
    }

    function hideError() {
        errorSection.style.display = 'none';
    }

    // Page navigation event listeners
    prevPageBtn.addEventListener('click', () => {
        if (currentPageIndex > 0) {
            showPage(currentPageIndex - 1);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPageIndex < currentPages.length - 1) {
            showPage(currentPageIndex + 1);
        }
    });

    // Auto-focus URL input on page load
    urlInput.focus();
}); 