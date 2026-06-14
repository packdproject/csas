// Konfigurasi API
const CONFIG = {
    // Ganti dengan URL Apps Script Anda
    BASE_URL: "https://script.google.com/macros/s/AKfycbwKJUJieEWG91Bu_FQsgJxV4FSvUTJCFbbByfuTh0FQk12eRk2WqZH4wLLiqYsXWMPL/exec",
    TIMEOUT: 15000, // tambah timeout
    DEBUG: true // enable debug mode
};

// Helper untuk debug
if (CONFIG.DEBUG) {
    console.log('Config loaded with BASE_URL:', CONFIG.BASE_URL);
}
