// API Wrapper
const API = {
    async fetchJSON(endpoint, params = {}) {
        const url = new URL(CONFIG.BASE_URL);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        
        if (CONFIG.DEBUG) {
            console.log('📡 Fetching:', url.toString());
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
        
        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                signal: controller.signal,
                mode: 'cors'
            });
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            
            if (CONFIG.DEBUG) {
                console.log('📦 Response:', data);
            }
            
            if (!data.success) throw new Error(data.message || 'Unknown error');
            
            // Pastikan data.data adalah array
            if (!data.data) return [];
            if (Array.isArray(data.data)) return data.data;
            return [];
            
        } catch (err) {
            if (CONFIG.DEBUG) console.error('❌ API Error:', err);
            if (err.name === 'AbortError') throw new Error('Request timeout - Cek koneksi internet');
            throw err;
        }
    },

    async getMenuTree() {
        const result = await this.fetchJSON('', { action: 'menu' });
        // Pastikan result adalah array
        return Array.isArray(result) ? result : [];
    },

    async getFaqByMenu(menuId) {
        const result = await this.fetchJSON('', { action: 'faq', menuId: menuId });
        return Array.isArray(result) ? result : [];
    },

    async searchFaq(keyword) {
        if (!keyword || !keyword.trim()) return [];
        const result = await this.fetchJSON('', { action: 'search', q: keyword });
        return Array.isArray(result) ? result : [];
    }
};
