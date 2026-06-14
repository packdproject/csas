// API Wrapper
const API = {
    /**
     * Fungsi umum fetch dengan timeout
     */
    async fetchJSON(endpoint, params = {}) {
        const url = new URL(CONFIG.BASE_URL);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
        
        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                signal: controller.signal,
                mode: 'cors' // penting untuk akses ke Apps Script
            });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (!data.success) throw new Error(data.message || 'Unknown error');
            return data.data;
        } catch (err) {
            if (err.name === 'AbortError') throw new Error('Request timeout');
            throw err;
        }
    },

    /**
     * Ambil seluruh menu tree
     */
    async getMenuTree() {
        return this.fetchJSON('', { action: 'menu' });
    },

    /**
     * Ambil FAQ berdasarkan menuId
     */
    async getFaqByMenu(menuId) {
        return this.fetchJSON('', { action: 'faq', menuId: menuId });
    },

    /**
     * Pencarian FAQ
     */
    async searchFaq(keyword) {
        if (!keyword.trim()) return [];
        return this.fetchJSON('', { action: 'search', q: keyword });
    }
};
