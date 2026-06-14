// Main App Initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 CS Dashboard starting...');
    
    // Tampilkan toast notifikasi
    if (typeof showToast === 'function') {
        showToast('Dashboard siap digunakan', 'success');
    }
    
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
            
            // Tampilkan notifikasi jika FAQ kosong
            if (faqData.length === 0 && typeof showToast === 'function') {
                showToast('Tidak ada FAQ untuk menu ini', 'info');
            }
        } catch (err) {
            console.error('❌ Error loading FAQ:', err);
            FaqManager.showError('Gagal memuat FAQ: ' + err.message);
            if (typeof showToast === 'function') {
                showToast('Gagal memuat FAQ: ' + err.message, 'error');
            }
        }
    };

    // Load Menu Tree
    const menuContainer = document.getElementById('menuTree');
    if (menuContainer) {
        menuContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Memuat menu...</div>';
    }

    try {
        console.log('📡 Fetching menu tree from API...');
        const menuTree = await API.getMenuTree();
        console.log('🌲 Menu tree received:', menuTree);
        
        // Validasi menuTree
        if (!menuTree || !Array.isArray(menuTree)) {
            throw new Error('Data menu tidak valid (bukan array)');
        }
        
        if (menuTree.length === 0) {
            throw new Error('Tidak ada data menu');
        }
        
        Sidebar.render(menuTree);
        
        // Auto-select first menu
        if (menuTree.length > 0) {
            const firstMenu = menuTree[0];
            const firstMenuId = firstMenu.id;
            const firstMenuName = firstMenu.nama || 'Menu Utama';
            console.log('🎯 Auto-selecting menu:', firstMenuId, firstMenuName);
            
            Sidebar.setActive(firstMenuId);
            await window.loadFaqByMenu(firstMenuId);
            
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) pageTitle.textContent = firstMenuName;
        }
        
        console.log('✅ Dashboard ready!');
        
        // Sembunyikan loading indicator
        if (typeof showToast === 'function') {
            showToast(`Memuat ${menuTree.length} menu`, 'success');
        }
        
    } catch (err) {
        console.error('❌ Fatal error:', err);
        
        // Tampilkan error yang lebih informatif di sidebar
        if (menuContainer) {
            menuContainer.innerHTML = `
                <div class="error" style="margin: 16px;">
                    <strong><i class="fas fa-exclamation-triangle"></i> Gagal memuat menu</strong>
                    <p>${err.message}</p>
                    <small>
                        💡 Solusi:<br>
                        • Periksa koneksi internet<br>
                        • Pastikan URL API benar di <strong>js/config.js</strong><br>
                        • Buka Console (F12) untuk detail error<br>
                        • Refresh halaman (Ctrl+F5)<br>
                        • Coba buka di Incognito Mode
                    </small>
                    <button onclick="location.reload()" style="margin-top: 12px; padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-sync-alt"></i> Refresh Halaman
                    </button>
                </div>
            `;
        }
        
        FaqManager.showError('Tidak dapat memuat data. ' + err.message);
        
        if (typeof showToast === 'function') {
            showToast('Gagal memuat dashboard: ' + err.message, 'error');
        }
    }
});

// Tambahan: Handle offline mode
window.addEventListener('load', () => {
    if (!navigator.onLine) {
        const faqContainer = document.getElementById('faqContainer');
        if (faqContainer) {
            faqContainer.innerHTML = `
                <div class="error">
                    <strong><i class="fas fa-wifi"></i> Tidak ada koneksi internet</strong>
                    <p>Periksa kembali koneksi internet Anda dan refresh halaman.</p>
                </div>
            `;
        }
        if (typeof showToast === 'function') {
            showToast('Tidak ada koneksi internet', 'error');
        }
    }
});
