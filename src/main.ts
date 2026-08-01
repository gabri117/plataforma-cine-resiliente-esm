import type { MovieRawDTO } from './dtos/movies.dto.js';
import type { Movie } from './entities/movies.entity.js';
import type { Review } from './entities/reviews.entity.js';
import type { Ad } from './entities/ads.entity.js';
import { state } from './state.js';
import { i18n } from './i18n/i18n.js';
import { getMovies, searchMovies, getMoviesByGenre } from './services/catalog.service.js';
import { getReviews } from './services/reviews.service.js';
import { getAds } from './services/ads.service.js';
import { MovieMapper } from './mappers/movies.mapper.js';
import { ReviewMapper } from './mappers/reviews.mapper.js';
import { AdMapper } from './mappers/ads.mapper.js';
import { crearFiltroPeliculas } from './cache/movie.cache.js';
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
    updateHeroReviews,
    showSkeletons
} from './ui/render.js';

declare global {
    interface Window {
        openDetailModalById: (id: string) => void;
        openTicketModalById: (id: string) => void;
        toggleFavorite: (id: string) => void;
    }
}

window.openDetailModalById = openDetailModalById;
window.openTicketModalById = openTicketModalById;
window.toggleFavorite = toggleFavorite;

const filtroCache = crearFiltroPeliculas(getMoviesByGenre);

function applyTranslations(): void {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key && i18n[state.language as keyof typeof i18n]?.[key as keyof typeof i18n.es]) {
            el.textContent = i18n[state.language as keyof typeof i18n][key as keyof typeof i18n.es] as string;
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key && i18n[state.language as keyof typeof i18n]?.[key as keyof typeof i18n.es]) {
            (el as HTMLInputElement).placeholder = i18n[state.language as keyof typeof i18n][key as keyof typeof i18n.es] as string;
        }
    });

    const langEs = document.getElementById('langEs') as HTMLElement;
    const langEn = document.getElementById('langEn') as HTMLElement;

    if (state.language === 'es') {
        langEs.className = 'bg-brand-red text-white font-bold px-2 py-0.5 rounded-lg transition-all';
        langEn.className = 'text-slate-400 hover:text-slate-200 font-medium px-2 py-0.5 rounded-lg transition-all';
    } else {
        langEs.className = 'text-slate-400 hover:text-slate-200 font-medium px-2 py-0.5 rounded-lg transition-all';
        langEn.className = 'bg-brand-red text-white font-bold px-2 py-0.5 rounded-lg transition-all';
    }

    if (state.movies.length > 0) {
        updateHeroBanner(state.movies[0]);
        renderGrid();
    }
}

let searchDebounceTimer: ReturnType<typeof setTimeout>;

function handleSearchInput(query: string): void {
    state.searchQuery = query.trim();
    clearTimeout(searchDebounceTimer);

    const searchIcon = document.getElementById('searchIcon') as HTMLElement;
    const searchSpinner = document.getElementById('searchSpinner') as HTMLElement;

    if (state.searchQuery.length >= 3) {
        searchIcon.classList.add('opacity-0');
        searchSpinner.classList.remove('opacity-0');

        searchDebounceTimer = setTimeout(async () => {
            showSkeletons();
            try {
                const searchDTOs = await searchMovies(state.searchQuery);
                state.filteredMovies = searchDTOs.map(MovieMapper.toDomain);
            } catch (err) {
                state.filteredMovies = state.movies.filter(movie =>
                    movie.title.toLowerCase().includes(state.searchQuery.toLowerCase())
                );
            }
            renderGrid();
            searchIcon.classList.remove('opacity-0');
            searchSpinner.classList.add('opacity-0');
        }, 600);
    } else {
        searchIcon.classList.remove('opacity-0');
        searchSpinner.classList.add('opacity-0');
        filterAndRenderMovies();
    }
}

async function cargarPlataforma(): Promise<void> {
    showSkeletons();

    try {
        const movieDTOs = await getMovies();
        state.movies = movieDTOs.map(MovieMapper.toDomain);
    } catch (err) {
        console.warn('API de OMDb no disponible:', err);
        showToast('API Ocupada - Intenta de nuevo más tarde', 'fa-triangle-exclamation', 'text-amber-400');
    }

    if (state.movies.length > 0) updateHeroBanner(state.movies[0]);
    filterAndRenderMovies();

    Promise.allSettled([getReviews(), getAds()])
        .then(([reviewsResult, adsResult]) => {
            if (reviewsResult.status === 'fulfilled') {
                const reviews: Review[] = reviewsResult.value.map(ReviewMapper.toDomain);
                updateHeroReviews(reviews.length);
            } else {
                console.warn('Reseñas no disponibles:', reviewsResult.reason.message);
            }

            if (adsResult.status === 'fulfilled') {
                const ads: Ad[] = adsResult.value.map(AdMapper.toDomain);
                showAdsBanner(ads);
            } else {
                console.warn('Anuncios no disponibles:', adsResult.reason.message);
            }
        });
}

function setupEventListeners(): void {
    const handleSearch = (e: Event) => handleSearchInput((e.target as HTMLInputElement).value);
    (document.getElementById('searchInput') as HTMLInputElement).addEventListener('input', handleSearch);
    (document.getElementById('searchInputMobile') as HTMLInputElement).addEventListener('input', handleSearch);

    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-tab').forEach(t => {
                t.classList.remove('bg-brand-red', 'text-white', 'active');
                t.classList.add('bg-slate-900', 'text-slate-400');
            });
            const target = e.target as HTMLElement;
            target.classList.remove('bg-slate-900', 'text-slate-400');
            target.classList.add('bg-brand-red', 'text-white', 'active');

            (document.getElementById('searchInput') as HTMLInputElement).value = '';
            (document.getElementById('searchInputMobile') as HTMLInputElement).value = '';
            state.searchQuery = '';

            const genero = target.dataset.filter;
            if (genero) {
                state.activeFilter = genero;
                filtroCache.filtrarPorGenero(genero).then((movies: Movie[]) => {
                    state.filteredMovies = movies;
                    renderGrid();
                });
            }
        });
    });

    (document.getElementById('langBtn') as HTMLButtonElement).addEventListener('click', () => {
        state.language = state.language === 'es' ? 'en' : 'es';
        applyTranslations();
    });

    (document.getElementById('refreshBtn') as HTMLButtonElement).addEventListener('click', () => {
        cargarPlataforma();
        showToast(state.language === 'es' ? 'Cartelera actualizada' : 'Catalog updated', 'fa-arrows-rotate', 'text-sky-400');
    });

    (document.getElementById('closeDetailModal') as HTMLButtonElement).addEventListener('click', () => closeModal('detailModal'));
    (document.getElementById('closeTicketModal') as HTMLButtonElement).addEventListener('click', () => closeModal('ticketModal'));

    (document.getElementById('confirmBookingBtn') as HTMLButtonElement).addEventListener('click', () => {
        const count = state.selectedSeats.size;
        closeModal('ticketModal');
        showToast(
            state.language === 'es' ? `¡Reserva de ${count} entrada(s) confirmada!` : `Booking of ${count} ticket(s) confirmed!`,
            'fa-circle-check', 'text-emerald-400'
        );
    });

    [document.getElementById('detailModal'), document.getElementById('ticketModal')].forEach(modal => {
        modal!.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal!.id);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    cargarPlataforma();
    setupEventListeners();
});
