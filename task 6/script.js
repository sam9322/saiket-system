// AuraCloud AI Landing Page Interactivity
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Hamburger Menu Controller
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('open');
        });

        // Close mobile menu when clicking nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // 2. Interactive Theme Customizer Controller
    const themeButtons = document.querySelectorAll('.theme-btn');
    const previewCard = document.getElementById('preview-card');
    const previewThemeTitle = document.getElementById('preview-theme-title');

    const themeTitles = {
        indigo: 'Current Theme: Midnight Indigo',
        purple: 'Current Theme: Cyber Purple',
        cyan: 'Current Theme: Electric Cyan'
    };

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const theme = btn.dataset.theme;

            // Update preview card theme class
            previewCard.className = `preview-card theme-${theme}`;
            if (previewThemeTitle) {
                previewThemeTitle.textContent = themeTitles[theme] || 'Current Theme';
            }

            showToast(`Applied ${btn.textContent.trim()} Theme!`);
        });
    });

    // 3. Dynamic Pricing Calculator Controller (Monthly vs Annual Toggle)
    const billingToggle = document.getElementById('billing-toggle');
    const priceStarter = document.getElementById('price-starter');
    const pricePro = document.getElementById('price-pro');
    const periodStarter = document.getElementById('period-starter');
    const periodPro = document.getElementById('period-pro');

    const prices = {
        monthly: { starter: 19, pro: 49, period: '/mo' },
        annual: { starter: 15, pro: 39, period: '/mo (billed annually)' }
    };

    if (billingToggle) {
        billingToggle.addEventListener('change', () => {
            const isAnnual = billingToggle.checked;
            const currentPrices = isAnnual ? prices.annual : prices.monthly;

            priceStarter.textContent = currentPrices.starter;
            pricePro.textContent = currentPrices.pro;
            periodStarter.textContent = currentPrices.period;
            periodPro.textContent = currentPrices.period;

            showToast(isAnnual ? 'Switched to Annual Billing (20% Savings Applied)' : 'Switched to Monthly Billing');
        });
    }

    // 4. Hero Email Lead Form Submission
    const heroEmailForm = document.getElementById('hero-email-form');
    if (heroEmailForm) {
        heroEmailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('hero-email');
            const email = emailInput ? emailInput.value.trim() : '';

            if (email) {
                showToast(`🚀 Early access claimed for ${email}! Check your inbox soon.`);
                heroEmailForm.reset();
            }
        });
    }

    // 5. Newsletter & Contact Form Submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('contact-name');
            const name = nameInput ? nameInput.value.trim() : 'Subscriber';

            showToast(`🎉 Thanks ${name}! You have been subscribed to AuraCloud updates.`);
            newsletterForm.reset();
        });
    }

    // 6. Modal Form Submission
    const modalForm = document.getElementById('modal-form');
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('🎉 Free Trial Activated! Redirecting to workspace dashboard...');
            modalForm.reset();
            closeModal();
        });
    }

});

/**
 * Toast Notification System
 */
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

/**
 * Global Modal Dialog Controls
 */
function openModal() {
    const modal = document.getElementById('modal-backdrop');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    const modal = document.getElementById('modal-backdrop');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Bind to window scope
window.openModal = openModal;
window.closeModal = closeModal;
