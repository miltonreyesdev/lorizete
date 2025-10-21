// === CONFIGURACIÓN GLOBAL ===
const CONFIG = {
    headerHeight: 80,
    mobileBreakpoint: 768,
    animationDuration: 300
};

// === MENU MOBILE ===
const initializeMobileMenu = () => {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navList = document.querySelector('nav ul');

    if (!mobileMenu || !navList) return;

    const toggleMenu = () => {
        const isActive = navList.classList.toggle('active');
        mobileMenu.textContent = isActive ? '✕' : '☰';

        // Prevenir scroll del body cuando el menú está abierto
        document.body.style.overflow = isActive ? 'hidden' : '';
        document.body.classList.toggle('menu-open', isActive);
    };

    // Cerrar menú al hacer clic en un enlace
    const closeMenuOnLinkClick = () => {
        navList.classList.remove('active');
        mobileMenu.textContent = '☰';
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
    };

    // Event listeners
    mobileMenu.addEventListener('click', toggleMenu);

    // Cerrar menú al hacer clic en enlaces
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', closeMenuOnLinkClick);
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!navList.contains(e.target) && !mobileMenu.contains(e.target) && navList.classList.contains('active')) {
            closeMenuOnLinkClick();
        }
    });

    // Cerrar menú al redimensionar la ventana si pasa el breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > CONFIG.mobileBreakpoint && navList.classList.contains('active')) {
            closeMenuOnLinkClick();
        }
    });
};

// === FORMULÁRIO DE CONTATO ===
const initializeContactForm = () => {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    // Validación básica
    const validateForm = () => {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        let isValid = true;

        // Resetear errores previos
        document.querySelectorAll('.error-message').forEach(error => error.remove());
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));

        // Validar nombre
        if (name.length < 2) {
            showError('name', 'Por favor, ingrese un nombre válido (mínimo 2 caracteres)');
            isValid = false;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email', 'Por favor, ingrese un email válido');
            isValid = false;
        }

        // Validar mensaje
        if (message.length < 10) {
            showError('message', 'Por favor, ingrese un mensaje más detallado (mínimo 10 caracteres)');
            isValid = false;
        }

        return isValid;
    };

    const showError = (fieldId, message) => {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');

        formGroup.classList.add('error');

        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = 'color: #e74c3c; font-size: 0.875rem; margin-top: 5px;';

        formGroup.appendChild(errorElement);
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Mostrar estado de carga
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        try {
            // Simular envío (reemplazar con tu endpoint real)
            await simulateFormSubmission();

            // Mensaje de éxito más elegante
            showSuccessMessage();

            // Limpiar formulario
            contactForm.reset();

        } catch (error) {
            // Mensaje de error
            alert('❌ Hubo un error al enviar el mensaje. Por favor, intente nuevamente o contácteme directamente por WhatsApp.');
            console.error('Error en el formulario:', error);
        } finally {
            // Restaurar botón
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });

    // Simulación de envío (reemplazar con tu API real)
    const simulateFormSubmission = () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 1500);
        });
    };

    const showSuccessMessage = () => {
        // Crear elemento de éxito
        const successElement = document.createElement('div');
        successElement.className = 'form-success-message';
        successElement.innerHTML = `
            ✅ <strong>¡Mensaje enviado con éxito!</strong><br>
            Le responderé en un plazo máximo de 24 horas.
        `;

        contactForm.parentNode.insertBefore(successElement, contactForm);

        // Remover después de 5 segundos
        setTimeout(() => {
            successElement.remove();
        }, 5000);
    };
};

// === ROLAGEM SUAVE PARA LINKS INTERNOS ===
const initializeSmoothScroll = () => {
    const calculateTargetOffset = (targetElement) => {
        const headerHeight = CONFIG.headerHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        return offsetPosition;
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');

            if (targetId === '#' || !targetId) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                const targetOffset = calculateTargetOffset(targetElement);

                window.scrollTo({
                    top: targetOffset,
                    behavior: 'smooth'
                });

                // Actualizar URL sin recargar la página
                history.pushState(null, null, targetId);
            }
        });
    });
};

// === OBSERVADOR DE INTERSECCIÓN PARA ANIMACIONES ===
const initializeIntersectionObserver = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    document.querySelectorAll('.servico-card, .passo, .depoimento, .pergunta').forEach(el => {
        observer.observe(el);
    });
};

// === BOTÓN WHATSAPP MEJORADO - SIEMPRE VISIBLE ===
const initializeWhatsAppButton = () => {
    const whatsappBtn = document.querySelector('.whatsapp-btn');

    if (!whatsappBtn) return;

    // ELIMINADO: Código que ocultaba el botón al hacer scroll
    // Ahora el botón siempre estará visible

    // Solo añadimos un efecto de pulso ocasional para llamar la atención
    setInterval(() => {
        whatsappBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            whatsappBtn.style.transform = 'scale(1)';
        }, 600);
    }, 10000); // Cada 10 segundos
};

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenu();
    initializeContactForm();
    initializeSmoothScroll();
    initializeIntersectionObserver();
    initializeWhatsAppButton();

    console.log('✅ Landing Page de Psicopedagoga inicializada correctamente');
});

// === MANEJO DE ERRORES GLOBAL ===
window.addEventListener('error', (e) => {
    console.error('Error en la aplicación:', e.error);
});