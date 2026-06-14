// Main App Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Inisialisasi komponen
    FaqManager.init();
    SearchHandler.init();

    // Load Menu Tree
    const menuContainer = document.getElementById('menuTree');
    if (menuContainer) {
        menuContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Memuat menu...</div>';
    }

    try {
        const menuTree = await API.getMenuTree();
        Sidebar.render(menuTree);
        
        // Jika ada menu pertama, pilih secara otomatis? misal menu id 1
        if (menuTree && menuTree.length > 0) {
            const firstMenuId = menuTree[0].id;
            Sidebar.setActive(firstMenuId);
            await loadFaqByMenu(firstMenuId);
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) pageTitle.textContent = menuTree[0].nama;
        } else {
            FaqManager.render([]);
        }
    } catch (err) {
        console.error(err);
        if (menuContainer) {
            menuContainer.innerHTML = `<div class="error">Gagal memuat menu: ${err.message}</div>`;
        }
        FaqManager.showError('Tidak dapat memuat data menu.');
    }

    // Expose function global untuk dipanggil dari sidebar
    window.loadFaqByMenu = async (menuId) => {
        // Bersihkan search box
        SearchHandler.clearSearch();
        FaqManager.showLoading();
        try {
            const faqData = await API.getFaqByMenu(menuId);
            FaqManager.render(faqData);
        } catch (err) {
            console.error(err);
            FaqManager.showError('Gagal memuat FAQ: ' + err.message);
        }
    };
});
