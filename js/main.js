document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Manejo del Modal de Video de Cultos
    // ==========================================
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        const modalVideoPlayer = document.getElementById('modalVideoPlayer');
        const videoModalLabel = document.getElementById('videoModalLabel');
        const videoModalDate = document.getElementById('videoModalDate');
        const videoModalDesc = document.getElementById('videoModalDesc');

        videoModal.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget;
            if (!button) return;

            const videoSrc = button.getAttribute('data-video-src');
            const videoTitle = button.getAttribute('data-video-title');
            const videoDate = button.getAttribute('data-video-date');
            const videoDesc = button.getAttribute('data-video-desc');

            if (videoModalLabel) videoModalLabel.textContent = videoTitle || 'Culto Semanal';
            if (videoModalDate) videoModalDate.textContent = videoDate || '';
            if (videoModalDesc) {
                videoModalDesc.textContent = videoDesc || 'Mensaje de la congregación Sion.';
            }

            if (modalVideoPlayer) {
                modalVideoPlayer.src = videoSrc || '';
                modalVideoPlayer.play().catch(err => {
                    console.log('Autoplay prevent o pausado por navegador:', err);
                });
            }
        });

        videoModal.addEventListener('hide.bs.modal', () => {
            if (modalVideoPlayer) {
                modalVideoPlayer.pause();
                modalVideoPlayer.src = '';
            }
        });
    }

    // ==========================================
    // 2. Botón Flotante "Volver Arriba"
    // ==========================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 320) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 3. Validación y Envío del Formulario de Contacto
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
                setInvalid(nameInput, 'Por favor ingresa tu nombre completo (al menos 3 caracteres).');
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
                setInvalid(emailInput, 'Ingresa un correo electrónico válido (ej. nombre@correo.com).');
                return false;
            }
            setValid(emailInput);
            return true;
        };

        const validateMessage = () => {
            if (!messageInput) return false;
            const value = messageInput.value.trim();
            if (value.length < 8) {
                setInvalid(messageInput, 'Por favor escribe un mensaje o motivo con al menos 8 caracteres.');
                return false;
            }
            setValid(messageInput);
            return true;
        };

        // Validación en vivo
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
            alertBox.className = 'alert alert-success alert-dismissible fade show mt-3 border-0 shadow-sm rounded-4 p-3';
            alertBox.role = 'alert';
            alertBox.innerHTML = `
                <div class="d-flex align-items-center gap-2">
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="text-success flex-shrink-0"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                        <strong class="d-block text-dark">¡Mensaje recibido con éxito!</strong>
                        <span class="small text-muted">Dios te bendiga. Nos comunicaremos contigo a la mayor brevedad posible.</span>
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
});

