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

// Animación al hacer scroll
function handleScroll() {
    const scrollPosition = window.scrollY;
    const { hero } = elements;
    
    // Controlamos la cantidad de scroll para el efecto (0 a 300px)
    const scrollEffect = Math.min(scrollPosition, 300) / 300;
    
    // Aplicamos transformaciones basadas en el scroll
    if (elements.leftText && elements.rightText && elements.greenLine) {
        // Movemos los textos (55% -> 52% cuando scroll completo)
        elements.leftText.style.right = `${55 - (scrollEffect * 3)}%`;
        elements.rightText.style.left = `${55 - (scrollEffect * 3)}%`;
        
        // Reducimos la línea (30% -> 15% cuando scroll completo)
        elements.greenLine.style.width = `${30 - (scrollEffect * 15)}%`;
        elements.greenLine.style.opacity = `${1 - (scrollEffect * 0.2)}`;
    }
    
    // Efecto general del hero
    if (scrollPosition > 50) {
        hero.classList.add('scrolled');
    } else {
        hero.classList.remove('scrolled');
    }
}

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