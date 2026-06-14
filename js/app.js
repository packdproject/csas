// Main App Initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 App starting...');
    
    // Inisialisasi komponen
    FaqManager.init();
    SearchHandler.init();

    // DEFINE GLOBAL FUNCTION
    window.loadFaqByMenu = async (menuId) => {
        console.log('📂 Loading FAQ for menu:', menuId);
        
        if (!menuId) {
            console.warn('No menuId provided');
            return;
        }
        
        // Clear search
        if (SearchHandler.clearSearch) {
            SearchHandler.clearSearch();
        }
        
        FaqManager.showLoading();
        
        try {
            const faqData = await API.getFaqByMenu(menuId);
            console.log(`📋 Received ${faqData.length} FAQs`);
            FaqManager.render(faqData);
        } catch (err) {
            console.error('❌ Error loading FAQ:', err);
            FaqManager.showError('Gagal memuat FAQ: ' + err.message);
        }
    };

    // Load Menu Tree
    const menuContainer = document.getElementById('menuTree');
    if (menuContainer) {
        menuContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Memuat menu...</div>';
    }

    try {
        console.log('📡 Fetching menu tree...');
        const menuTree = await API.getMenuTree();
        console.log('🌲 Menu tree received:', menuTree);
        
        Sidebar.render(menuTree);
        
        // Auto-select first menu
        if (menuTree && Array.isArray(menuTree) && menuTree.length > 0) {
            const firstMenu = menuTree[0];
            const firstMenuId = firstMenu.id;
            console.log('🎯 Auto-selecting menu:', firstMenuId);
            
            Sidebar.setActive(firstMenuId);
            await window.loadFaqByMenu(firstMenuId);
            
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) pageTitle.textContent = firstMenu.nama || 'FAQ Seller';
        } else {
            console.warn('No menu items found');
            FaqManager.render([]);
        }
        
        console.log('✅ App ready!');
        
    } catch (err) {
        console.error('❌ Fatal error:', err);
        if (menuContainer) {
            menuContainer.innerHTML = `<div class="error">
                <strong>❌ Gagal memuat menu</strong><br>
                ${err.message}<br><br>
                <small>💡 Tips:<br>
                - Cek koneksi internet<br>
                - Pastikan URL API benar di config.js<br>
                - Buka console (F12) untuk detail<br>
                - Refresh halaman (Ctrl+F5)</small>
            </div>`;
        }
        FaqManager.showError('Tidak dapat memuat data. ' + err.message);
    }
});
