// FAQ Renderer & Handler
const FaqManager = {
    container: null,

    init() {
        this.container = document.getElementById('faqContainer');
        if (CONFIG.DEBUG) console.log('✅ FaqManager initialized');
    },

    render(faqList) {
        if (!this.container) return;

        // VALIDASI: Pastikan faqList adalah array
        if (!faqList || !Array.isArray(faqList) || faqList.length === 0) {
            this.container.innerHTML = '<div class="empty-state">📋 Tidak ada FAQ untuk menu ini</div>';
            return;
        }

        this.container.innerHTML = '';
        
        faqList.forEach((faq, index) => {
            if (!faq || !faq.pertanyaan) return;
            
            const card = document.createElement('div');
            card.className = 'faq-card';
            card.dataset.id = faq.id || index;

            const questionDiv = document.createElement('div');
            questionDiv.className = 'faq-question';
            questionDiv.innerHTML = `
                <span>${this.escapeHtml(faq.pertanyaan)}</span>
                <i class="fas fa-chevron-down"></i>
            `;
            
            questionDiv.addEventListener('click', () => {
                const answerDiv = card.querySelector('.faq-answer');
                const icon = questionDiv.querySelector('i');
                if (answerDiv) {
                    answerDiv.classList.toggle('open');
                    if (icon) {
                        icon.classList.toggle('fa-chevron-up');
                        icon.classList.toggle('fa-chevron-down');
                    }
                }
            });

            const answerDiv = document.createElement('div');
            answerDiv.className = 'faq-answer';
            answerDiv.innerHTML = this.formatJawaban(faq.jawaban || 'Tidak ada jawaban');

            card.appendChild(questionDiv);
            card.appendChild(answerDiv);
            this.container.appendChild(card);
        });
        
        if (CONFIG.DEBUG) console.log(`📄 Rendered ${faqList.length} FAQs`);
    },

    renderSearchResults(faqList, keyword) {
        if (!this.container) return;
        
        if (!faqList || !Array.isArray(faqList) || faqList.length === 0) {
            this.container.innerHTML = `<div class="empty-state">🔍 Tidak ditemukan hasil untuk "${this.escapeHtml(keyword)}"</div>`;
            return;
        }

        this.container.innerHTML = '';
        const regex = new RegExp(`(${this.escapeRegex(keyword)})`, 'gi');

        faqList.forEach(faq => {
            if (!faq || !faq.pertanyaan) return;
            
            const card = document.createElement('div');
            card.className = 'faq-card';

            const highlightedQuestion = faq.pertanyaan.replace(regex, `<mark class="highlight">$1</mark>`);
            let highlightedAnswer = (faq.jawaban || '').replace(regex, `<mark class="highlight">$1</mark>`);
            highlightedAnswer = highlightedAnswer.replace(/\n/g, '<br>');

            const questionDiv = document.createElement('div');
            questionDiv.className = 'faq-question';
            questionDiv.innerHTML = `<span>${highlightedQuestion}</span><i class="fas fa-chevron-down"></i>`;
            
            const answerDiv = document.createElement('div');
            answerDiv.className = 'faq-answer';
            answerDiv.innerHTML = highlightedAnswer;

            questionDiv.addEventListener('click', () => {
                answerDiv.classList.toggle('open');
                const icon = questionDiv.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-chevron-up');
                    icon.classList.toggle('fa-chevron-down');
                }
            });

            card.appendChild(questionDiv);
            card.appendChild(answerDiv);
            this.container.appendChild(card);
        });
    },

    showLoading() {
        if (this.container) {
            this.container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Memuat FAQ...</div>';
        }
    },

    showError(message) {
        if (this.container) {
            this.container.innerHTML = `<div class="error">❌ Error: ${this.escapeHtml(message)}</div>`;
        }
    },

    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    escapeRegex(str) {
        return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    formatJawaban(text) {
        if (!text) return '';
        return String(text).replace(/\n/g, '<br>');
    }
};
