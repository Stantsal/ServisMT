// Translations data
const translations = {
    en: {
        nav: {
            home: "Home",
            products: "Products",
            services: "Services",
            about: "About",
            contact: "Contact"
        },
        hero: {
            title: "Welcome to ServisMT",
            subtitle: "Leading supplier of laser cutting equipment, spare parts and services in Georgia",
            cta: "Learn More"
        },
        about: {
            title: "About ServisMT"
        },
        products: {
            title: "Our Products"
        },
        services: {
            title: "Our Services"
        },
        contact: {
            title: "Contact Us",
            form: {
                name: "Name",
                email: "Email",
                phone: "Phone",
                message: "Message",
                submit: "Send Message"
            }
        }
    },
    ru: {
        nav: {
            home: "Главная",
            products: "Продукция",
            services: "Услуги",
            about: "О нас",
            contact: "Контакты"
        },
        hero: {
            title: "Добро пожаловать в ServisMT",
            subtitle: "Ведущий поставщик оборудования для лазерной резки, запчастей и услуг в Грузии",
            cta: "Узнать больше"
        },
        about: {
            title: "О компании ServisMT"
        },
        products: {
            title: "Наша продукция"
        },
        services: {
            title: "Наши услуги"
        },
        contact: {
            title: "Связаться с нами",
            form: {
                name: "Имя",
                email: "Email",
                phone: "Телефон",
                message: "Сообщение",
                submit: "Отправить"
            }
        }
    },
    ge: {
        nav: {
            home: "მთავარი",
            products: "პროდუქცია",
            services: "სერვისები",
            about: "ჩვენ შესახებ",
            contact: "კონტაქტი"
        },
        hero: {
            title: "მოგესალმებით ServisMT-ში",
            subtitle: "ლაზერული ჭრის აღჭურვილობის, სათადარიგო ნაწილებისა და სერვისების წამყვანი მომწოდებელი საქართველოში",
            cta: "გაიგე მეტი"
        },
        about: {
            title: "ServisMT-ის შესახებ"
        },
        products: {
            title: "ჩვენი პროდუქცია"
        },
        services: {
            title: "ჩვენი სერვისები"
        },
        contact: {
            title: "დაგვიკავშირდით",
            form: {
                name: "სახელი",
                email: "ელ. ფოსტა",
                phone: "ტელეფონი",
                message: "შეტყობინება",
                submit: "გაგზავნა"
            }
        }
    }
};

class ServisMTApp {
    constructor() {
        this.currentLanguage = 'en';
        this.activeProductCard = null;
        this.init();
    }

    init() {
        this.setupLanguageSwitching();
        this.setupNavigation();
        this.setupProductCards();
        this.setupContactForm();
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupIntersectionObserver();
        this.setupSmoothScrolling();
    }

    // Language switching functionality
    setupLanguageSwitching() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.switchLanguage(lang);
                
                // Update active state
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchLanguage(lang) {
        this.currentLanguage = lang;
        
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            const translation = this.getTranslation(key);
            if (translation) {
                element.placeholder = translation;
            }
        });
    }

    getTranslation(key) {
        const keys = key.split('.');
        let value = translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return value;
    }

    // Navigation functionality
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const scrollPos = window.scrollY + headerHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Product cards functionality
    setupProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach((card, index) => {
            const toggle = card.querySelector('.product-card__toggle');
            const subcategories = card.querySelector('.product-card__subcategories');
            
            toggle.addEventListener('click', () => {
                this.toggleProductCard(card, index);
            });
        });

        // Setup intersection observer for auto-closing
        this.setupProductCardObserver();
    }

    toggleProductCard(card, index) {
        const toggle = card.querySelector('.product-card__toggle');
        const subcategories = card.querySelector('.product-card__subcategories');
        const isExpanded = subcategories.classList.contains('expanded');

        // Close all other cards
        document.querySelectorAll('.product-card').forEach((otherCard, otherIndex) => {
            if (otherIndex !== index) {
                const otherToggle = otherCard.querySelector('.product-card__toggle');
                const otherSubcategories = otherCard.querySelector('.product-card__subcategories');
                
                otherToggle.classList.remove('expanded');
                otherSubcategories.classList.remove('expanded');
            }
        });

        // Toggle current card
        if (isExpanded) {
            toggle.classList.remove('expanded');
            subcategories.classList.remove('expanded');
            this.activeProductCard = null;
        } else {
            toggle.classList.add('expanded');
            subcategories.classList.add('expanded');
            this.activeProductCard = card;
        }
    }

    setupProductCardObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && this.activeProductCard === entry.target) {
                    // Close the card if it goes out of view
                    const toggle = entry.target.querySelector('.product-card__toggle');
                    const subcategories = entry.target.querySelector('.product-card__subcategories');
                    
                    toggle.classList.remove('expanded');
                    subcategories.classList.remove('expanded');
                    this.activeProductCard = null;
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px'
        });

        document.querySelectorAll('.product-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Contact form functionality
    setupContactForm() {
        const form = document.getElementById('contactForm');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
        };

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (!this.isValidEmail(data.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission with delay
        setTimeout(() => {
            this.showNotification('Message sent successfully! We will contact you soon.', 'success');
            form.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // In a real application, you would send this data to your server
            console.log('Form data:', data);
        }, 1500);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type) {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(notif => {
            notif.remove();
        });

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 18px;">
                    ${type === 'success' ? '✓' : '⚠'}
                </span>
                <span>${message}</span>
            </div>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '10px',
            color: '#ffffff',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#FF6B35' : '#dc3545',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            maxWidth: '350px',
            wordWrap: 'break-word'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Scroll effects
    setupScrollEffects() {
        let lastScrollTop = 0;
        const header = document.querySelector('.header');

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Header scroll effect
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollTop = scrollTop;
        });
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const nav = document.getElementById('nav');
        let isMenuOpen = false;

        mobileMenuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                this.openMobileMenu(nav, mobileMenuBtn);
            } else {
                this.closeMobileMenu(nav, mobileMenuBtn);
            }
        });

        // Close menu when clicking nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) {
                    this.closeMobileMenu(nav, mobileMenuBtn);
                    isMenuOpen = false;
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                this.closeMobileMenu(nav, mobileMenuBtn);
                isMenuOpen = false;
            }
        });
    }

    openMobileMenu(nav, btn) {
        nav.style.display = 'flex';
        nav.style.position = 'fixed';
        nav.style.top = '80px';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = 'rgba(10, 10, 10, 0.98)';
        nav.style.flexDirection = 'column';
        nav.style.padding = '2rem';
        nav.style.zIndex = '999';
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.borderTop = '1px solid #333';
        
        // Animate hamburger
        const spans = btn.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    }

    closeMobileMenu(nav, btn) {
        nav.style.display = '';
        nav.style.position = '';
        nav.style.top = '';
        nav.style.left = '';
        nav.style.right = '';
        nav.style.background = '';
        nav.style.flexDirection = '';
        nav.style.padding = '';
        nav.style.zIndex = '';
        nav.style.backdropFilter = '';
        nav.style.borderTop = '';
        
        // Reset hamburger
        const spans = btn.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for animation
        document.querySelectorAll('.service-card, .product-card, .about__content, .contact__content').forEach(el => {
            observer.observe(el);
        });
    }

    // Smooth scrolling for hero CTA
    setupSmoothScrolling() {
        const heroCta = document.querySelector('.hero__cta');
        
        heroCta.addEventListener('click', (e) => {
            e.preventDefault();
            const aboutSection = document.querySelector('#about');
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            window.scrollTo({
                top: aboutSection.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        });
    }
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat__number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isNumber = !isNaN(target.replace(/[^0-9]/g, ''));
        
        if (isNumber) {
            const finalNumber = parseInt(target.replace(/[^0-9]/g, ''));
            const suffix = target.replace(/[0-9]/g, '');
            let currentNumber = 0;
            const increment = finalNumber / 100;
            
            const updateCounter = () => {
                if (currentNumber < finalNumber) {
                    currentNumber += increment;
                    counter.textContent = Math.floor(currentNumber) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        }
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ServisMTApp();
    
    // Setup stats counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.about__stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const nav = document.getElementById('nav');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (nav && mobileMenuBtn) {
            nav.style.display = '';
            nav.style.position = '';
            nav.style.top = '';
            nav.style.left = '';
            nav.style.right = '';
            nav.style.background = '';
            nav.style.flexDirection = '';
            nav.style.padding = '';
            nav.style.zIndex = '';
            nav.style.backdropFilter = '';
            nav.style.borderTop = '';
            
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    }
});

// Preloader (optional)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// WhatsApp integration helper
function openWhatsApp(phone, message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}