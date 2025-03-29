document.addEventListener("DOMContentLoaded", function () {
    const checkButton = document.getElementById("checkButton");
    const urlInput = document.getElementById("urlInput");
    const result = document.getElementById("result");

    if (!checkButton || !urlInput || !result) {
        console.error("Error: One or more elements not found. Check popup.html.");
        return;
    }

    checkButton.addEventListener("click", async function () {
        let url = urlInput.value.trim();

        if (url === "") {
            result.textContent = "⚠️ Please enter a URL.";
            result.style.color = "black";
            return;
        }

        if (!isValidURL(url)) {
            result.textContent = "❌ Invalid URL format.";
            result.style.color = "red";
            return;
        }

        // Check with PhishTank API
        let isUnsafe = await checkWithPhishTank(url);

        if (isUnsafe) {
            result.textContent = "🚨 WARNING: This URL is flagged as dangerous!";
            result.style.color = "red";
            return;
        }

        // Second, check our own phishing detection logic
        if (isPhishingURL(url)) {
            result.textContent = "⚠️ This URL looks suspicious!";
            result.style.color = "orange";
        } else {
            result.textContent = "✅ This URL looks safe.";
            result.style.color = "green";
        }
    });

    function isValidURL(url) {
        try {
            let parsedUrl = new URL(url);

            // Extract domain part
            let hostname = parsedUrl.hostname;

            // Check for consecutive dots in domain (e.g., "google...com")
            if (/\.\./.test(hostname)) {
                return false;
            }

            return true;
        } catch (_) {
            return false;
        }
    }

    function isPhishingURL(url) {
        const phishingKeywords = [
            "login", "verify", "update", "free", "win", "prize", "banking",
            "secure", "account", "paypal", "crypto", "confirm", "click", "ebay",
            "password", "credit", "reset", "support", "secure", "limited"
        ];
        return phishingKeywords.some(keyword => url.toLowerCase().includes(keyword));
    }

    async function checkWithPhishTank(url) {
        const API_URL = "https://data.phishtank.com/data/online-valid.json"; // PhishTank's free API

        try {
            let response = await fetch(API_URL);
            let data = await response.json();

            return data.some(entry => entry.url === url); // Check if URL is in PhishTank database
        } catch (error) {
            console.error("PhishTank API error:", error);
            return false;
        }
    }
});


