/**
 * SION - Iglesia Evangélica Independiente de México A.R.
 * Scripts Principales: Modales, Filtros de Doctrinas, Formulario y Navegación
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Modal Reutilizable de Video (Google Drive)
    // ==========================================
    const videoModal = document.getElementById('videoModal');
    const modalIframe = document.getElementById('modalVideoIframe');
    const modalTitle = document.getElementById('videoModalLabel');
    const modalDate = document.getElementById('videoModalDate');
    const modalDesc = document.getElementById('videoModalDesc');

    if (videoModal && modalIframe) {
        // Al abrir el modal, inyecta la URL de preview con autoplay
        videoModal.addEventListener('show.bs.modal', (event) => {
            const triggerEl = event.relatedTarget;
            if (!triggerEl) return;

            const videoSrc = triggerEl.getAttribute('data-video-src');
            const videoTitle = triggerEl.getAttribute('data-video-title');
            const videoDate = triggerEl.getAttribute('data-video-date');
            const videoDesc = triggerEl.getAttribute('data-video-desc');

            if (modalTitle) modalTitle.textContent = videoTitle || 'Culto Semanal';
            if (modalDate) modalDate.textContent = videoDate || '';
            if (modalDesc) modalDesc.textContent = videoDesc || 'Mensaje bíblico de la congregación Sion.';

            if (videoSrc) {
                const separator = videoSrc.includes('?') ? '&' : '?';
                modalIframe.src = `${videoSrc}${separator}autoplay=1`;
            }
        });

        // Al cerrar el modal, vacía el iframe para detener el video/audio inmediatamente
        videoModal.addEventListener('hide.bs.modal', () => {
            modalIframe.src = '';
        });
    }

    // ==========================================
    // 2. Filtro Interactivo de Doctrinas / Creencias
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const creenciaItems = document.querySelectorAll('.creencia-item');

    if (filterButtons.length > 0 && creenciaItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const selectedCategory = btn.getAttribute('data-filter');

                creenciaItems.forEach(item => {
                    const itemCat = item.getAttribute('data-category');
                    if (selectedCategory === 'all' || itemCat === selectedCategory) {
                        item.classList.remove('d-none');
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.96)';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.classList.add('d-none');
                    }
                });
            });
        });
    }

    // ==========================================
    // 3. Botón Flotante "Volver Arriba"
    // ==========================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        let isTicking = false;
        window.addEventListener('scroll', () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 350) {
                        scrollTopBtn.classList.add('show');
                    } else {
                        scrollTopBtn.classList.remove('show');
                    }
                    isTicking = false;
                });
                isTicking = true;
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 4. Formulario de Contacto & Validación en Vivo
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const validateName = () => {
            if (!nameInput) return false;
            const value = nameInput.value.trim();
            if (value.length < 3) {
                setInvalid(nameInput, 'Por favor ingresa tu nombre completo (mínimo 3 caracteres).');
                return false;
            }
            setValid(nameInput);
            return true;
        };

        const validateEmail = () => {
            if (!emailInput) return false;
            const value = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setInvalid(emailInput, 'Ingresa un correo electrónico válido (ej. tu_nombre@correo.com).');
                return false;
            }
            setValid(emailInput);
            return true;
        };

        const validateMessage = () => {
            if (!messageInput) return false;
            const value = messageInput.value.trim();
            if (value.length < 8) {
                setInvalid(messageInput, 'Por favor escribe un mensaje o petición con al menos 8 caracteres.');
                return false;
            }
            setValid(messageInput);
            return true;
        };

        if (nameInput) nameInput.addEventListener('input', validateName);
        if (emailInput) emailInput.addEventListener('input', validateEmail);
        if (messageInput) messageInput.addEventListener('input', validateMessage);

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isMessageValid = validateMessage();

            if (isNameValid && isEmailValid && isMessageValid) {
                showFormSuccess(contactForm);
                contactForm.reset();
                resetValidations([nameInput, emailInput, messageInput]);
            }
        });
    }

    function setInvalid(input, message) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        
        let feedback = input.parentNode.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            input.parentNode.appendChild(feedback);
        }
        feedback.textContent = message;
    }

    function setValid(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        const feedback = input.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = '';
        }
    }

    function resetValidations(inputs) {
        inputs.forEach(input => {
            if (input) {
                input.classList.remove('is-valid', 'is-invalid');
                const feedback = input.parentNode.querySelector('.invalid-feedback');
                if (feedback) feedback.textContent = '';
            }
        });
    }

    function showFormSuccess(form) {
        let alertBox = document.getElementById('contactSuccessAlert');
        if (!alertBox) {
            alertBox = document.createElement('div');
            alertBox.id = 'contactSuccessAlert';
            alertBox.className = 'alert alert-success alert-dismissible fade show mt-3 border-0 shadow-sm rounded-3 p-3';
            alertBox.role = 'alert';
            alertBox.innerHTML = `
                <div class="d-flex align-items-center gap-2">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="text-success flex-shrink-0"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                        <strong class="d-block text-dark">¡Mensaje enviado con éxito!</strong>
                        <span class="small text-muted">Dios te bendiga. Nos pondremos en contacto contigo lo antes posible.</span>
                    </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
            `;
            form.appendChild(alertBox);
        } else {
            alertBox.classList.remove('d-none');
        }

        setTimeout(() => {
            if (alertBox && alertBox.parentNode) {
                alertBox.remove();
            }
        }, 6000);
    }

    // Cerrar menú móvil al hacer clic en un enlace de navegación
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            });
        });
    }
});
