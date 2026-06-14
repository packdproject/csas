// Main App Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Inisialisasi komponen
    FaqManager.init();
    SearchHandler.init();

    // DEFINE FUNGSI GLOBAL SEBELUM DIGUNAKAN
    window.loadFaqByMenu = async (menuId) => {
        console.log('Loading FAQ for menu:', menuId);
        // Bersihkan search box
        if (SearchHandler.clearSearch) {
            SearchHandler.clearSearch();
        }
        FaqManager.showLoading();
        try {
            const faqData = await API.getFaqByMenu(menuId);
            FaqManager.render(faqData);
        } catch (err) {
            console.error('Error loading FAQ:', err);
            FaqManager.showError('Gagal memuat FAQ: ' + err.message);
        }
    };

    // Load Menu Tree
    const menuContainer = document.getElementById('menuTree');
    if (menuContainer) {
        menuContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Memuat menu...</div>';
    }

    try {
        const menuTree = await API.getMenuTree();
        console.log('Menu tree loaded:', menuTree);
        Sidebar.render(menuTree);
        
        // Jika ada menu pertama, pilih secara otomatis
        if (menuTree && menuTree.length > 0) {
            const firstMenuId = menuTree[0].id;
            Sidebar.setActive(firstMenuId);
            await window.loadFaqByMenu(firstMenuId);
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) pageTitle.textContent = menuTree[0].nama;
        } else {
            FaqManager.render([]);
        }
    } catch (err) {
        console.error('Error loading menu:', err);
        if (menuContainer) {
            menuContainer.innerHTML = `<div class="error">❌ Gagal memuat menu: ${err.message}<br><br>
            <small>Pastikan:<br>
            1. URL API benar di config.js<br>
            2. Apps Script sudah di-deploy<br>
            3. Koneksi internet aktif</small></div>`;
        }
        FaqManager.showError('Tidak dapat memuat data menu. ' + err.message);
    }
});
