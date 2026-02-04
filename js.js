console.log("LightFrame website loaded");

// Service modal functionality
document.addEventListener('DOMContentLoaded', function() {
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