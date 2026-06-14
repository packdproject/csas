// Search Handler
const SearchHandler = {
    inputElement: null,
    debounceTimer: null,
    currentKeyword: '',

    init() {
        this.inputElement = document.getElementById('searchInput');
        if (!this.inputElement) {
            console.warn('⚠️ Search input not found');
            return;
        }

        this.inputElement.addEventListener('input', (e) => {
            const keyword = e.target.value.trim();
            this.currentKeyword = keyword;

            clearTimeout(this.debounceTimer);
            if (keyword.length === 0) {
                const activeId = Sidebar.currentActiveId;
                if (activeId && typeof window.loadFaqByMenu === 'function') {
                    window.loadFaqByMenu(activeId);
                }
                return;
            }
            this.debounceTimer = setTimeout(() => {
                this.performSearch(keyword);
            }, 500);
        });
        
        if (CONFIG.DEBUG) console.log('✅ SearchHandler initialized');
    },

    async performSearch(keyword) {
        if (!keyword || !keyword.trim()) return;
        
        FaqManager.showLoading();
        try {
            const results = await API.searchFaq(keyword);
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) pageTitle.textContent = `🔍 Hasil: "${keyword}"`;
            FaqManager.renderSearchResults(results, keyword);
        } catch (err) {
            console.error('Search error:', err);
            FaqManager.showError('Pencarian gagal: ' + err.message);
        }
    },

    clearSearch() {
        if (this.inputElement) {
            this.inputElement.value = '';
            this.currentKeyword = '';
        }
    }
};
