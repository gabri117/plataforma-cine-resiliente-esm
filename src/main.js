import { state } from './state.js';
import { i18n } from './i18n/i18n.js';
import { fetchMovies, searchMoviesFromOMDb, fetchMoviesByGenreSimulado } from './services/catalogService.js';
import { fetchReviews } from './services/reviewsService.js';
import { fetchAds } from './services/adsService.js';
import { crearFiltroPeliculas } from './cache/movieCache.js';
import {
    renderGrid,
    updateHeroBanner,
    showToast,
    closeModal,
    openDetailModalById,
    openTicketModalById,
    toggleFavorite,
    filterAndRenderMovies,
    showAdsBanner,
    updateHeroReviews
} from './ui/render.js';

/*
 * El HTML usa handlers inline como onclick="openDetailModalById(...)"
 * que requieren acceso al scope global. Como los módulos ESM no exponen
 * funciones a window automáticamente, las asignamos explícitamente para
 * mantener compatibilidad sin modificar el HTML.
 */
window.openDetailModalById = openDetailModalById;
window.openTicketModalById = openTicketModalById;
window.toggleFavorite = toggleFavorite;

const filtroCache = crearFiltroPeliculas(fetchMoviesByGenreSimulado);

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[state.language][key]) {
            el.textContent = i18n[state.language][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[state.language][key]) {
            el.placeholder = i18n[state.language][key];
        }
    });

    document.getElementById('langBtn').textContent = state.language === 'es' ? 'EN' : 'ES';

    if (state.movies.length > 0) {
        updateHeroBanner(state.movies[0]);
        renderGrid();
    }
}

let searchDebounceTimer;

function handleSearchInput(query) {
    state.searchQuery = query.trim();
    clearTimeout(searchDebounceTimer);

    const searchIcon = document.getElementById('searchIcon');
    const searchSpinner = document.getElementById('searchSpinner');

    if (state.searchQuery.length >= 3) {
        searchIcon.classList.add('opacity-0');
        searchSpinner.classList.remove('opacity-0');

        searchDebounceTimer = setTimeout(() => {
            searchMoviesFromOMDb(state.searchQuery).finally(() => {
                searchIcon.classList.remove('opacity-0');
                searchSpinner.classList.add('opacity-0');
            });
        }, 600);
    } else {
        searchIcon.classList.remove('opacity-0');
        searchSpinner.classList.add('opacity-0');
        filterAndRenderMovies();
    }
}

function cargarPlataforma() {
    /*
     * PROMISE.ALL VS PROMISE.ALLSETTLED — DIFERENCIA PRÁCTICA:
     *
     * Promise.all rechaza INMEDIATAMENTE si cualquiera de las promesas
     * falla. Si fetchAds falla (40% de probabilidad), el .then() nunca
     * se ejecuta y PERDEMOS los datos del catálogo aunque fetchMovies
     * haya tenido éxito. Todo el grupo se cancela por una sola falla.
     *
     * Promise.allSettled NUNCA rechaza. Espera a que TODAS las promesas
     * terminen — éxito o fallo — y nos entrega el resultado individual
     * de cada una. Así podemos decidir por separado:
     *   - Catálogo: crítico, se renderiza siempre (fetchMovies ya lo hizo
     *     internamente antes de que allSettled termine)
     *   - Reseñas: opcional, si falla solo mostramos un warning
     *   - Anuncios: opcional, si falla solo mostramos un warning
     *
     * En producción usarías esto para servicios third-party no críticos
     * (analytics, recomendaciones, ads) que no deben bloquear la
     * experiencia principal del usuario.
     */
    Promise.allSettled([fetchMovies(), fetchReviews(), fetchAds()])
        .then(([catalogResult, reviewsResult, adsResult]) => {
            if (reviewsResult.status === 'fulfilled') {
                updateHeroReviews(reviewsResult.value.length);
            } else {
                console.warn('Reseñas no disponibles:', reviewsResult.reason.message);
            }

            if (adsResult.status === 'fulfilled') {
                showAdsBanner(adsResult.value);
            } else {
                console.warn('Anuncios no disponibles:', adsResult.reason.message);
            }
        });
}

function setupEventListeners() {
    const handleSearch = e => handleSearchInput(e.target.value);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('searchInputMobile').addEventListener('input', handleSearch);

    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-tab').forEach(t => {
                t.classList.remove('bg-brand-red', 'text-white', 'active');
                t.classList.add('bg-slate-900', 'text-slate-400');
            });
            e.target.classList.remove('bg-slate-900', 'text-slate-400');
            e.target.classList.add('bg-brand-red', 'text-white', 'active');

            document.getElementById('searchInput').value = '';
            document.getElementById('searchInputMobile').value = '';
            state.searchQuery = '';

            const genero = e.target.dataset.filter;
            state.activeFilter = genero;
            filtroCache.filtrarPorGenero(genero).then(movies => {
                state.filteredMovies = movies;
                renderGrid();
            });
        });
    });

    document.getElementById('langBtn').addEventListener('click', () => {
        state.language = state.language === 'es' ? 'en' : 'es';
        applyTranslations();
    });

    document.getElementById('refreshBtn').addEventListener('click', () => {
        cargarPlataforma();
        showToast(state.language === 'es' ? 'Cartelera actualizada' : 'Catalog updated', 'fa-arrows-rotate', 'text-sky-400');
    });

    document.getElementById('closeDetailModal').addEventListener('click', () => closeModal('detailModal'));
    document.getElementById('closeTicketModal').addEventListener('click', () => closeModal('ticketModal'));

    document.getElementById('confirmBookingBtn').addEventListener('click', () => {
        const count = state.selectedSeats.size;
        closeModal('ticketModal');
        showToast(
            state.language === 'es' ? `¡Reserva de ${count} entrada(s) confirmada!` : `Booking of ${count} ticket(s) confirmed!`,
            'fa-circle-check', 'text-emerald-400'
        );
    });

    [document.getElementById('detailModal'), document.getElementById('ticketModal')].forEach(modal => {
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal.id); });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    cargarPlataforma();
    setupEventListeners();
});
