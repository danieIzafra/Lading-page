document.addEventListener('DOMContentLoaded', () => {
    // --- Efeito de Scroll Reveal (Copiado do script.js) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));
    // --- 7. Floating Buy Button (Mobile UX) ---
    const floatingBuy = document.getElementById('mobile-floating-buy');
    const mainPurchaseActions = document.querySelector('.purchase-actions');
    const floatingAddBtn = document.getElementById('floating-add-btn');

    if (floatingBuy && mainPurchaseActions) {
        // Usa o IntersectionObserver para checar se as ações originais estão na tela
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Se o botão original sair da tela E for mobile, mostra o flutuante
                if (!entry.isIntersecting && window.innerWidth <= 1024) {
                    floatingBuy.classList.add('visible');
                } else {
                    floatingBuy.classList.remove('visible');
                }
            });
        }, { threshold: 0 }); // Dispara assim que o elemento sai 100%
        
        observer.observe(mainPurchaseActions);
    }

    // Faz o botão flutuante acionar a lógica de compra principal
    if(floatingAddBtn) {
        floatingAddBtn.addEventListener('click', () => {
            document.getElementById('add-product-btn').click();
        });
    }

    // --- 0. Sincronização de Tema e Menu Mobile (Herdado) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        themeIcon.classList.replace(isLight ? 'fa-moon' : 'fa-sun', isLight ? 'fa-sun' : 'fa-moon');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    mobileMenuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));

    // --- 1. Lógica do Carrinho com LocalStorage ---
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

    function toggleCart() {
        cartDrawer.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }

    document.getElementById('open-cart-btn').addEventListener('click', toggleCart);
    document.getElementById('close-cart-btn').addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    const formatCurrency = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    function updateCartUI() {
        const container = document.getElementById('cart-items');
        container.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            container.innerHTML = '<p class="empty-cart">Sua sacola está vazia.</p>';
        } else {
            cart.forEach((item, index) => {
                total += (item.price * item.qty);
                const sizeTag = item.size ? ` - ${item.size}` : '';
                container.innerHTML += `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}">
                        <div class="cart-item-info">
                            <h4>${item.name}${sizeTag}</h4>
                            <span class="cart-price">${item.qty}x ${formatCurrency(item.price)}</span>
                            <button class="remove-item" data-index="${index}">Remover</button>
                        </div>
                    </div>
                `;
            });
        }
        document.getElementById('cart-count').innerText = cart.reduce((acc, item) => acc + item.qty, 0);
        document.getElementById('cart-total-price').innerText = formatCurrency(total);
        localStorage.setItem('aura_cart', JSON.stringify(cart));

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cart.splice(e.target.getAttribute('data-index'), 1);
                updateCartUI();
            });
        });
    }
    updateCartUI();

    // --- 2. Galeria Dinâmica & Zoom de Imagem ---
    const mainImg = document.getElementById('current-image');
    const zoomContainer = document.getElementById('zoom-container');

    document.querySelectorAll('.thumb').forEach(thumb => {
        thumb.addEventListener('click', function() {
            document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            mainImg.style.opacity = 0;
            setTimeout(() => {
                // Truque para pegar a imagem HD na troca (removendo os parâmetros do unsplash e colocando HD)
                let highResSrc = this.src.replace('&w=200', '&w=1000');
                mainImg.src = highResSrc;
                mainImg.style.opacity = 1;
            }, 150);
        });
    });

    // Efeito de Zoom Magnético no Desktop
    zoomContainer.addEventListener('mousemove', (e) => {
        if(window.innerWidth > 1024) {
            const { left, top, width, height } = zoomContainer.getBoundingClientRect();
            const x = (e.clientX - left) / width * 100;
            const y = (e.clientY - top) / height * 100;
            mainImg.style.transformOrigin = `${x}% ${y}%`;
            mainImg.style.transform = 'scale(1.8)';
        }
    });
    zoomContainer.addEventListener('mouseleave', () => {
        mainImg.style.transformOrigin = 'center center';
        mainImg.style.transform = 'scale(1)';
    });

    // --- 3. UI da Página de Produto (Tamanho, Qtd, Favoritar) ---
    let selectedSize = 'M';
    document.querySelectorAll('.size-btn:not(.out-of-stock)').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedSize = this.innerText;
        });
    });

    const qtyInput = document.getElementById('qty-input');
    document.querySelector('.qty-btn.plus').addEventListener('click', () => {
        if(qtyInput.value < 5) qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    document.querySelector('.qty-btn.minus').addEventListener('click', () => {
        if(qtyInput.value > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
    });

    const favBtn = document.querySelector('.favorite-btn');
    favBtn.addEventListener('click', () => {
        favBtn.classList.toggle('active');
        const icon = favBtn.querySelector('i');
        icon.classList.toggle('far');
        icon.classList.toggle('fas');
    });

    // --- 4. Accordions de Informação ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // --- 5. Modal Guia de Medidas ---
    const sizeModal = document.getElementById('size-modal');
    document.getElementById('open-size-guide').addEventListener('click', (e) => {
        e.preventDefault();
        sizeModal.classList.add('active');
    });
    document.querySelector('.close-modal').addEventListener('click', () => sizeModal.classList.remove('active'));
    sizeModal.addEventListener('click', (e) => {
        if(e.target === sizeModal) sizeModal.classList.remove('active');
    });

    // --- 6. Adicionar à Sacola ---
    const addProductBtn = document.getElementById('add-product-btn');
    addProductBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));
        const img = this.getAttribute('data-img');
        const qty = parseInt(qtyInput.value) || 1;

        // Verifica se item já existe com o mesmo tamanho
        const existingItemIndex = cart.findIndex(item => item.name === name && item.size === selectedSize);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].qty += qty;
        } else {
            cart.push({ name, price, img, size: selectedSize, qty });
        }
        
        updateCartUI();

        // Micro-interação de Sucesso
        const originalText = this.innerText;
        this.innerHTML = '<i class="fas fa-check"></i> Adicionado';
        this.classList.add('success');
        
        // --- 9. Nova Lógica de Resposta (Desktop Drawer vs Mobile Toast) ---
        if (!cartDrawer.classList.contains('active') && window.innerWidth > 1024) {
            toggleCart(); // Desktop: abre o drawer
        } else if (window.innerWidth <= 1024) {
            // Mobile: Mostra o Toast
            const toast = document.getElementById('toast-notification');
            if (toast) {
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            }
        }

        setTimeout(() => {
            this.innerText = originalText;
            this.classList.remove('success');
        }, 2000);
    });

    // --- 8. Skeleton Loading para Imagens ---
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.classList.add('loading');
        // Aplica o skeleton no container pai
        if(img.parentElement) {
            img.parentElement.classList.add('skeleton');
        }
        
        if (img.complete) {
            removeSkeleton(img);
        } else {
            img.addEventListener('load', () => removeSkeleton(img));
        }
    });

    function removeSkeleton(img) {
        img.classList.remove('loading');
        img.classList.add('loaded');
        if(img.parentElement) {
            img.parentElement.classList.remove('skeleton');
        }
    }
});