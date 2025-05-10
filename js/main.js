// Configuración de la API y constantes
const API_URL = 'https://api.frankfurter.app/latest?from=USD';
const HISTORICAL_API = 'https://api.frankfurter.app/2023-01-01..?from=USD&to=MXN,EUR,GBP,JPY,BRL';
const REFRESH_INTERVAL = 300000; // 5 minutos
const CURRENCIES = [
    { code: 'MXN', name: 'USD/MXN' },
    { code: 'EUR', name: 'USD/EUR' },
    { code: 'GBP', name: 'USD/GBP' },
    { code: 'JPY', name: 'USD/JPY' },
    { code: 'BRL', name: 'USD/BRL' }
];

// Elementos del DOM
const elements = {
    ticker: document.querySelector('.ticker'),
    hero: document.querySelector('.hero'),
    logoContainer: document.querySelector('.logo-container'),
    // Actualizados según tu HTML actual
    imagesColumn: document.querySelector('.images-column'),
    textsColumn: document.querySelector('.texts-column')
};

// Obtener datos del mercado
async function fetchMarketData() {
    try {
        const [currentResponse, historicalResponse] = await Promise.all([
            fetch(API_URL),
            fetch(HISTORICAL_API)
        ]);
        
        const [currentData, historicalData] = await Promise.all([
            currentResponse.json(),
            historicalResponse.json()
        ]);

        updateTicker(currentData, historicalData);
    } catch (error) {
        console.error("Error al obtener datos:", error);
        showFallbackData();
    }
}

function updateTicker(currentData, historicalData) {
    elements.ticker.innerHTML = '';
    
    CURRENCIES.forEach(currency => {
        const rate = currentData.rates[currency.code];
        const historicalRates = Object.values(historicalData.rates)
            .map(day => day[currency.code])
            .filter(Boolean);
        
        const previousRate = historicalRates[historicalRates.length - 2];
        const change = previousRate ? ((rate - previousRate) / previousRate) * 100 : 0;
        
        const tickerItem = createTickerItem(currency.name, rate, change);
        
        elements.ticker.appendChild(tickerItem);
        elements.ticker.appendChild(tickerItem.cloneNode(true));
    });
}

function createTickerItem(currencyName, rate, change) {
    const tickerItem = document.createElement('div');
    tickerItem.className = 'ticker-item';
    tickerItem.innerHTML = `
        <span class="currency">${currencyName}</span>
        <span class="price">${rate.toFixed(4)}</span>
        <span class="change ${change >= 0 ? 'positive' : 'negative'}">
            ${change >= 0 ? '+' : ''}${change.toFixed(2)}%
        </span>
    `;
    return tickerItem;
}

function showFallbackData() {
    elements.ticker.innerHTML = `
        <div class="ticker-item">
            <span class="currency">USD/MXN</span>
            <span class="price">19.5973</span>
            <span class="change negative">-0.08%</span>
        </div>
        <div class="ticker-item">
            <span class="currency">USD/EUR</span>
            <span class="price">0.8923</span>
            <span class="change positive">+0.12%</span>
        </div>
    `;
}

// Animaciones para las secciones
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('text-block')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                if (entry.target.classList.contains('forest-image')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                }
            }
        });
    }, { threshold: 0.1 });

    // Observar elementos
    document.querySelectorAll('.text-block, .forest-image, .product-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transition = 'all 0.6s ease-out';
        if (el.classList.contains('text-block')) {
            el.style.transform = 'translateY(20px)';
        } else if (el.classList.contains('forest-image')) {
            el.style.transform = 'scale(0.95)';
        } else {
            el.style.transform = 'translateY(20px)';
        }
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const textContainer = document.querySelector('.text-split-container');
    
    function checkScroll() {
        const containerPosition = textContainer.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.5;
        
        if (containerPosition < screenPosition) {
            textContainer.classList.add('scrolled');
        } else {
            textContainer.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Verificar al cargar la página
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Agregamos los elementos al objeto elements
    elements.leftText = document.querySelector('.left-text');
    elements.rightText = document.querySelector('.right-text');
    elements.greenLine = document.querySelector('.green-line');
    
    fetchMarketData();
    setInterval(fetchMarketData, REFRESH_INTERVAL);
    window.addEventListener('scroll', handleScroll);
});

window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
        hero.classList.add('scrolled');
    } else {
        hero.classList.remove('scrolled');
    }
});

// PRODUCTOS 
document.addEventListener('DOMContentLoaded', function() {
    const products = [
        {
            title: "FX Direct",
            image: "img/fx_direct.png",
            description: "Diseñado para empresas que buscan operar con mayor flexibilidad y seguridad sus transacciones internacionales."
        },
        {
            title: "FX Plus",
            image: "img/fxplus.png",
            description: "Soluciones avanzadas para comercio exterior con tasas preferenciales y seguimiento en tiempo real."
        },
        {
            title: "Int Factoring",
            image: "img/factoring.png",
            description: "Anticipa tus facturas internacionales y mejora tu flujo de efectivo inmediatamente."
        },
        {
            title: "FX Derivates",
            image: "img/fx_derivates.png",
            description: "Protege tu empresa contra la volatilidad cambiaria con nuestros instrumentos financieros."
        }
    ];

    const section = document.getElementById('products-scroll');
    const titles = document.querySelectorAll('.product-title');
    const productImage = document.getElementById('product-image');
    const productDescription = document.getElementById('product-description');
    const scrollSpace = document.querySelector('.scroll-space');
    
    // Configuración inicial
    let currentIndex = 0;
    let isAnimating = false;
    
    // Ajustar el espacio de scroll según la cantidad de productos
    scrollSpace.style.height = `${(products.length - 1) * 100}vh`;
    
    function updateProduct(index) {
        if (isAnimating || index === currentIndex) return;
        
        isAnimating = true;
        currentIndex = index;
        
        // Actualizar clases activas
        titles.forEach((title, i) => {
            title.classList.toggle('active', i === index);
        });
        
        // Animación de cambio
        productImage.classList.remove('active');
        productDescription.classList.remove('active');
        
        setTimeout(() => {
            productImage.src = products[index].image;
            productDescription.innerHTML = `<p>${products[index].description}</p><div class="description-line"></div>`;
            
            productImage.classList.add('active');
            productDescription.classList.add('active');
            
            isAnimating = false;
        }, 300); // Tiempo igual a la duración de la transición CSS
    }
    
    function handleScroll() {
        const scrollY = window.scrollY;
        const sectionOffset = section.offsetTop;
        const windowHeight = window.innerHeight;
        
        // Solo actuar cuando estemos dentro de la sección
        if (scrollY < sectionOffset || scrollY > sectionOffset + (products.length * windowHeight)) {
            return;
        }
        
        const progress = (scrollY - sectionOffset) / windowHeight;
        const newIndex = Math.min(Math.floor(progress), products.length - 1);
        
        if (newIndex !== currentIndex) {
            updateProduct(newIndex);
        }
    }
    
    // Inicializar primer producto
    updateProduct(0);
    
    // Evento de scroll optimizado
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        lastScroll = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Click en títulos
    titles.forEach(title => {
        title.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const targetScroll = section.offsetTop + (index * window.innerHeight);
            
            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        });
    });
});

// seccion coming-song

  // Animación al hacer scroll
    document.addEventListener('DOMContentLoaded', function() {
        const section = document.querySelector('.coming-soon-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('scrolled');
                    }, 500);
                } else {
                    entry.target.classList.remove('scrolled');
                }
            });
        }, {threshold: 0.3});
        
        observer.observe(section);
        
        // Selección de botones
        const buttons = document.querySelectorAll('.product-button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                buttons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });

    //propuestas de valor 
     document.addEventListener('DOMContentLoaded', function() {
        // Reiniciar animaciones cuando el elemento es visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'none';
                    setTimeout(() => {
                        entry.target.style.animation = '';
                    }, 10);
                }
            });
        }, {threshold: 0.1});
        
        document.querySelectorAll('.value-propositions-box, .animate-title, .animate-item, .animate-list-item').forEach(el => {
            observer.observe(el);
        });
    });

    // seccion cominidad y preguntas frecuentes

     document.addEventListener('DOMContentLoaded', function() {
        // Animación de scroll
        const section = document.querySelector('.community-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('scrolled');
                    }, 500);
                }
            });
        }, {threshold: 0.2});
        
        observer.observe(section);
        
        // Carrusel automático
        let currentTestimonial = 0;
        const testimonials = document.querySelectorAll('.testimonial');
        
        function rotateTestimonials() {
            testimonials.forEach(t => t.classList.remove('active'));
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            testimonials[currentTestimonial].classList.add('active');
        }
        
        // Cambiar cada 5 segundos
        setInterval(rotateTestimonials, 5000);
        
        // FAQs interactivos
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
    });