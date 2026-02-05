console.log("LightFrame website loaded");

function escapeHtml(s){
    return String(s||'').replace(/[&<>"']/g, function(m){
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m];
    });
}

function applySiteConfig(){
    try{
        const cfg = JSON.parse(localStorage.getItem('siteConfig')||'null');
        if(!cfg) return;
        if(cfg.siteTitle){ document.title = cfg.siteTitle; const logo = document.querySelector('.logo'); if(logo) logo.textContent = cfg.siteTitle; }
        if(cfg.aboutTitle){ const at = document.querySelector('.about-title'); if(at) at.textContent = cfg.aboutTitle; }
        if(cfg.aboutSubtitle){ const as = document.querySelector('.about-subtitle'); if(as) as.textContent = cfg.aboutSubtitle; }
        if(cfg.contacts){
            const contactItems = document.querySelectorAll('.contact-item');
            if(contactItems.length >= 3){
                const c0 = contactItems[0]; if(c0.querySelector('.contact-value')) c0.querySelector('.contact-value').textContent = cfg.contacts.phone || c0.querySelector('.contact-value').textContent;
                if(c0.querySelector('.copy-btn')) c0.querySelector('.copy-btn').setAttribute('data-copy', cfg.contacts.phone || '');
                const c1 = contactItems[1]; if(c1 && c1.querySelector('.contact-value')) c1.querySelector('.contact-value').textContent = cfg.contacts.email || c1.querySelector('.contact-value').textContent;
                if(c1 && c1.querySelector('.copy-btn')) c1.querySelector('.copy-btn').setAttribute('data-copy', cfg.contacts.email || '');
                const c2 = contactItems[2]; if(c2 && c2.querySelector('.contact-value')) c2.querySelector('.contact-value').textContent = cfg.contacts.address || c2.querySelector('.contact-value').textContent;
                if(c2 && c2.querySelector('.copy-btn')) c2.querySelector('.copy-btn').setAttribute('data-copy', cfg.contacts.address || '');
            }
            // footer quick replace (best-effort)
            const footerPs = document.querySelectorAll('.footer-section p');
            footerPs.forEach(p=>{
                if(p.textContent.includes('8 (800)')) p.textContent = cfg.contacts.phone || p.textContent;
                if(p.textContent.includes('info@')) p.textContent = cfg.contacts.email || p.textContent;
            });
        }
        if(Array.isArray(cfg.cards) && cfg.cards.length){
            const cardsWrap = document.querySelector('.cards');
            if(cardsWrap){
                // Merge: update existing cards by data-service, add new ones, keep originals not present in config
                const existing = Array.from(cardsWrap.querySelectorAll('.card'));
                cfg.cards.forEach(c => {
                    const serviceKey = c.service || '';
                    let found = existing.find(el => el.getAttribute('data-service') === serviceKey);
                    if(found){
                        // update attributes and content
                        if(c.price) found.setAttribute('data-price', c.price);
                        if(c.photographer) found.setAttribute('data-photographer', c.photographer);
                        const img = found.querySelector('img'); if(img && c.image) img.src = c.image;
                        const h3 = found.querySelector('h3'); if(h3 && c.title) h3.textContent = c.title;
                        const p = found.querySelector('p'); if(p && c.description) p.textContent = c.description;
                    } else {
                        // create new card element and append
                        const div = document.createElement('div');
                        div.className = 'card';
                        if(c.service) div.setAttribute('data-service', c.service);
                        if(c.price) div.setAttribute('data-price', c.price);
                        if(c.photographer) div.setAttribute('data-photographer', c.photographer);
                        div.innerHTML = `
                            <div class="card-image-wrapper">
                                <img src="${escapeHtml(c.image)}" alt="${escapeHtml(c.title)}">
                                <div class="card-overlay"><span class="overlay-icon">📸</span></div>
                            </div>
                            <h3>${escapeHtml(c.title)}</h3>
                            <p>${escapeHtml(c.description)}</p>
                            <div class="card-info">Нажмите для деталей</div>`;
                        cardsWrap.appendChild(div);
                    }
                });
            }
        }
    }catch(e){ console.warn('applySiteConfig error', e); }
}

// Service modal functionality
document.addEventListener('DOMContentLoaded', function() {
    applySiteConfig();
    const serviceModal = document.getElementById('serviceModal');
    const contactModal = document.getElementById('contactModal');
    const cards = document.querySelectorAll('.card');
    const closeButtons = document.querySelectorAll('.modal-close');
    const orderButton = document.getElementById('orderButton');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const orderForm = document.getElementById('orderForm');

    // Open service modal when card is clicked
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;

            const serviceName = this.querySelector('h3').textContent;
            const price = this.getAttribute('data-price');
            const photographer = this.getAttribute('data-photographer');

            const formattedPrice = parseInt(price).toLocaleString('ru-RU') + ' ₸';

            document.getElementById('modalServiceName').textContent = serviceName;
            document.getElementById('modalPrice').textContent = formattedPrice;
            document.getElementById('modalPhotographer').textContent = photographer;

            serviceModal.classList.add('show');
        });

        const cardInfo = card.querySelector('.card-info');
        if (cardInfo) {
            cardInfo.addEventListener('click', function(e) {
                e.stopPropagation();
                card.click();
            });
        }
    });

    // Open contact modal when "Order" button is clicked
    orderButton.addEventListener('click', function() {
        serviceModal.classList.remove('show');
        contactModal.classList.add('show');
    });

    // Close modals when X is clicked
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            serviceModal.classList.remove('show');
            contactModal.classList.remove('show');
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === serviceModal) {
            serviceModal.classList.remove('show');
        }
        if (e.target === contactModal) {
            contactModal.classList.remove('show');
        }
    });

    // Copy to clipboard functionality
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const textToCopy = this.getAttribute('data-copy');
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.textContent;
                this.textContent = '✓ Скопировано';
                this.classList.add('copied');
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copied');
                }, 2000);
            });
        });
    });

    // Form submission
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[type="text"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;

        // Show success message
        alert(`Спасибо, ${name}! Мы получили ваш заказ. Мы свяжемся с вами в ближайшее время!`);
        
        // Reset form
        this.reset();
        
        // Close modal
        contactModal.classList.remove('show');
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            serviceModal.classList.remove('show');
            contactModal.classList.remove('show');
        }
    });
});

    // FAQ accordion
    document.addEventListener('DOMContentLoaded', function() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            btn.addEventListener('click', function() {
                const isOpen = item.classList.contains('open');
                // close all
                faqItems.forEach(i => {
                    i.classList.remove('open');
                    const a = i.querySelector('.faq-answer');
                    if (a) a.style.maxHeight = null;
                });
                if (!isOpen) {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
            // allow keyboard toggle
            btn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    });