// FAQ Renderer & Handler
const FaqManager = {
    container: null,

    init() {
        this.container = document.getElementById('faqContainer');
    },

    /**
     * Menampilkan daftar FAQ
     */
    render(faqList) {
        if (!this.container) return;

        if (!faqList || faqList.length === 0) {
            this.container.innerHTML = '<div class="empty-state">Tidak ada FAQ untuk menu ini</div>';
            return;
        }

        this.container.innerHTML = '';
        faqList.forEach((faq, index) => {
            const card = document.createElement('div');
            card.className = 'faq-card';
            card.dataset.id = faq.id;

            // Header Pertanyaan
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
                    icon.classList.toggle('fa-chevron-up');
                    icon.classList.toggle('fa-chevron-down');
                }
            });

            // Body Jawaban
            const answerDiv = document.createElement('div');
            answerDiv.className = 'faq-answer';
            answerDiv.innerHTML = this.formatJawaban(faq.jawaban);

            card.appendChild(questionDiv);
            card.appendChild(answerDiv);
            this.container.appendChild(card);
        });
    },

    /**
     * Menampilkan hasil pencarian dengan highlight keyword
     */
    renderSearchResults(faqList, keyword) {
        if (!this.container) return;
        if (!faqList || faqList.length === 0) {
            this.container.innerHTML = '<div class="empty-state">Tidak ditemukan hasil untuk "' + this.escapeHtml(keyword) + '"</div>';
            return;
        }

        this.container.innerHTML = '';
        const regex = new RegExp(`(${this.escapeRegex(keyword)})`, 'gi');

        faqList.forEach(faq => {
            const card = document.createElement('div');
            card.className = 'faq-card';

            const highlightedQuestion = faq.pertanyaan.replace(regex, `<mark class="highlight">$1</mark>`);
            let highlightedAnswer = faq.jawaban.replace(regex, `<mark class="highlight">$1</mark>`);
            // Konversi newline ke <br>
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
                icon.classList.toggle('fa-chevron-up');
                icon.classList.toggle('fa-chevron-down');
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
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
            return c;
        });
    },

    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    formatJawaban(text) {
        if (!text) return '';
        // Ganti newline dengan <br>
        return text.replace(/\n/g, '<br>');
    }
};
