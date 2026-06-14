// Search Handler
const SearchHandler = {
    inputElement: null,
    debounceTimer: null,
    currentKeyword: '',

    init() {
        this.inputElement = document.getElementById('searchInput');
        if (!this.inputElement) return;

        this.inputElement.addEventListener('input', (e) => {
            const keyword = e.target.value.trim();
            this.currentKeyword = keyword;

            // Debounce untuk performa
            clearTimeout(this.debounceTimer);
            if (keyword.length === 0) {
                // Jika kosong, reload FAQ dari menu aktif
                const activeId = Sidebar.currentActiveId;
                if (activeId) {
                    window.loadFaqByMenu(activeId);
                } else {
                    FaqManager.render([]);
                }
                return;
            }
            this.debounceTimer = setTimeout(() => {
                this.performSearch(keyword);
            }, 400);
        });
    },

    async performSearch(keyword) {
        if (!keyword.trim()) return;
        
        FaqManager.showLoading();
        try {
            const results = await API.searchFaq(keyword);
            // Update judul halaman
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) pageTitle.textContent = `Hasil pencarian: "${keyword}"`;
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
