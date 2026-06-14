// Sidebar Menu Tree Renderer
const Sidebar = {
    currentActiveId: null,

    /**
     * Render tree menu dari data API
     * @param {Array} menuTree - Array hasil dari getMenuTree()
     */
    render(menuTree) {
        const container = document.getElementById('menuTree');
        if (!container) return;

        container.innerHTML = '';
        if (!menuTree || menuTree.length === 0) {
            container.innerHTML = '<div class="empty-state">Tidak ada menu</div>';
            return;
        }

        const ul = document.createElement('ul');
        menuTree.forEach(item => {
            this.buildMenuItem(item, ul);
        });
        container.appendChild(ul);
    },

    /**
     * Membuat elemen list item secara rekursif
     */
    buildMenuItem(node, parentElement, level = 0) {
        const li = document.createElement('li');
        li.dataset.id = node.id;
        li.dataset.level = level;

        const hasChildren = node.children && node.children.length > 0;
        const div = document.createElement('div');
        div.className = 'menu-item';
        if (hasChildren) div.classList.add('has-children');

        // Ikon berdasarkan ada child atau tidak
        const icon = document.createElement('i');
        icon.className = hasChildren ? 'fas fa-folder' : 'fas fa-file-alt';
        div.appendChild(icon);

        const label = document.createElement('span');
        label.textContent = node.nama;
        div.appendChild(label);

        // Tombol toggle jika punya child
        if (hasChildren) {
            const toggle = document.createElement('i');
            toggle.className = 'fas fa-chevron-down toggle-icon';
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const childrenUl = li.querySelector('ul');
                if (childrenUl) {
                    childrenUl.classList.toggle('open');
                    toggle.classList.toggle('fa-chevron-up');
                    toggle.classList.toggle('fa-chevron-down');
                }
            });
            div.appendChild(toggle);
        }

        // Event klik untuk memuat FAQ
        div.addEventListener('click', (e) => {
            // Jangan trigger jika klik pada toggle icon
            if (e.target.classList.contains('toggle-icon')) return;
            this.setActive(node.id);
            if (typeof window.loadFaqByMenu === 'function') {
                window.loadFaqByMenu(node.id);
            }
            // Update judul halaman
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) pageTitle.textContent = node.nama;
        });

        li.appendChild(div);

        // Children
        if (hasChildren) {
            const childUl = document.createElement('ul');
            childUl.className = 'children'; // default closed
            node.children.forEach(child => {
                this.buildMenuItem(child, childUl, level + 1);
            });
            li.appendChild(childUl);
        }

        parentElement.appendChild(li);
    },

    /**
     * Menandai menu yang aktif
     */
    setActive(id) {
        // Hapus class active dari semua menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        // Cari menu yang sesuai
        const targetLi = document.querySelector(`li[data-id="${id}"]`);
        if (targetLi) {
            const menuDiv = targetLi.querySelector('.menu-item');
            if (menuDiv) menuDiv.classList.add('active');
            this.currentActiveId = id;
        }
    }
};
