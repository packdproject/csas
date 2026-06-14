// Konfigurasi API
const CONFIG = {
    // Ganti dengan URL Apps Script Anda
    BASE_URL: "https://script.google.com/macros/s/AKfycbwKJUJieEWG91Bu_FQsgJxV4FSvUTJCFbbByfuTh0FQk12eRk2WqZH4wLLiqYsXWMPL/exec",
    TIMEOUT: 15000, // 15 detik
    DEBUG: true, // Set ke false untuk production
    APP_NAME: "CS Dashboard",
    VERSION: "1.0.0"
};

// Debug logging
if (CONFIG.DEBUG) {
    console.log(`✅ ${CONFIG.APP_NAME} v${CONFIG.VERSION} loaded`);
    console.log('📍 API Endpoint:', CONFIG.BASE_URL);
}
