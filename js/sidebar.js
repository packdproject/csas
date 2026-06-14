// Sidebar Menu Tree Renderer
const Sidebar = {
    currentActiveId: null,

    render(menuTree) {
        const container = document.getElementById('menuTree');
        if (!container) return;

        container.innerHTML = '';
        
        // VALIDASI: Pastikan menuTree adalah array
        if (!menuTree || !Array.isArray(menuTree) || menuTree.length === 0) {
            container.innerHTML = '<div class="empty-state">📂 Tidak ada menu</div>';
            return;
        }

        const ul = document.createElement('ul');
        menuTree.forEach(item => {
            if (item && item.id) {
                this.buildMenuItem(item, ul);
            }
        });
        container.appendChild(ul);
    },

    buildMenuItem(node, parentElement, level = 0) {
        // VALIDASI: Pastikan node valid
        if (!node || !node.id) return;
        
        const li = document.createElement('li');
        li.dataset.id = node.id;
        li.dataset.level = level;

        const hasChildren = node.children && Array.isArray(node.children) && node.children.length > 0;
        const div = document.createElement('div');
        div.className = 'menu-item';
        if (hasChildren) div.classList.add('has-children');

        const icon = document.createElement('i');
        icon.className = hasChildren ? 'fas fa-folder' : 'fas fa-file-alt';
        div.appendChild(icon);

        const label = document.createElement('span');
        label.textContent = node.nama || 'Tanpa Nama';
        div.appendChild(label);

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

        div.addEventListener('click', (e) => {
            if (e.target.classList.contains('toggle-icon')) return;
            this.setActive(node.id);
            
            if (typeof window.loadFaqByMenu === 'function') {
                window.loadFaqByMenu(node.id);
            } else {
                console.warn('⚠️ loadFaqByMenu not ready');
                setTimeout(() => {
                    if (typeof window.loadFaqByMenu === 'function') {
                        window.loadFaqByMenu(node.id);
                    }
                }, 100);
            }
            
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) pageTitle.textContent = node.nama || 'FAQ';
        });

        li.appendChild(div);

        if (hasChildren) {
            const childUl = document.createElement('ul');
            childUl.className = 'children';
            node.children.forEach(child => {
                this.buildMenuItem(child, childUl, level + 1);
            });
            li.appendChild(childUl);
        }

        parentElement.appendChild(li);
    },

    setActive(id) {
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        const targetLi = document.querySelector(`li[data-id="${id}"]`);
        if (targetLi) {
            const menuDiv = targetLi.querySelector('.menu-item');
            if (menuDiv) menuDiv.classList.add('active');
            this.currentActiveId = id;
        }
    }
};
