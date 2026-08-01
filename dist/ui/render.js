import { state } from '../state.js';
import { t, translateGenre } from '../i18n/i18n.js';
const movieGrid = document.getElementById('movieGrid');
const movieCountEl = document.getElementById('movieCount');
const emptyState = document.getElementById('emptyState');
export function renderGrid() {
    movieGrid.innerHTML = '';
    if (state.filteredMovies.length === 0) {
        emptyState.classList.remove('hidden');
        movieCountEl.textContent = `0 ${t('moviesFound')}`;
        return;
    }
    emptyState.classList.add('hidden');
    movieCountEl.textContent = `${state.filteredMovies.length} ${state.searchQuery ? t('moviesFound') : t('moviesShowing')}`;
    state.filteredMovies.forEach(movie => {
        const isFav = state.favorites.has(movie.id);
        const card = document.createElement('div');
        card.className = 'group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-slate-700 hover:shadow-2xl hover:shadow-brand-red/10 transition-all duration-300 flex flex-col justify-between';
        card.innerHTML = `
            <div class="relative overflow-hidden aspect-[2/3] cursor-pointer" onclick="openDetailModalById('${movie.id}')">
                <img src="${movie.posterUrl}" alt="${movie.title}" 
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop'">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                <div class="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-brand-gold border border-slate-800 flex items-center gap-1">
                    <i class="fa-solid fa-star"></i> ${movie.rating}
                </div>
                <button onclick="event.stopPropagation(); toggleFavorite('${movie.id}')" 
                        class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-brand-red border border-slate-800 flex items-center justify-center transition-transform active:scale-90">
                    <i class="${isFav ? 'fa-solid text-brand-red' : 'fa-regular'} fa-heart text-sm"></i>
                </button>
            </div>
            <div class="p-4 flex flex-col flex-grow justify-between gap-3">
                <div>
                    <span class="text-[11px] font-medium text-brand-red uppercase tracking-wide block mb-1">
                        ${translateGenre(movie.genre.split(', ')[0] || 'Drama')}
                    </span>
                    <h3 class="font-bold text-white text-base leading-snug line-clamp-1 group-hover:text-brand-red transition-colors">
                        ${movie.title}
                    </h3>
                </div>
                <button onclick="openTicketModalById('${movie.id}')" 
                        class="w-full py-2 bg-slate-800 hover:bg-brand-red text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700/60 hover:border-brand-red transition-all">
                    <i class="fa-solid fa-ticket"></i> ${t('buy')}
                </button>
            </div>
        `;
        movieGrid.appendChild(card);
    });
}
export function updateHeroBanner(movie) {
    const heroBg = document.getElementById('heroBg');
    const heroTitle = document.getElementById('heroTitle');
    const heroOverview = document.getElementById('heroOverview');
    const heroMeta = document.getElementById('heroMeta');
    const heroRating = document.getElementById('heroRating');
    const heroGenre = document.getElementById('heroGenre');
    const heroYear = document.getElementById('heroYear');
    const heroBookBtn = document.getElementById('heroBookBtn');
    const heroDetailBtn = document.getElementById('heroDetailBtn');
    heroBg.style.backgroundImage = `url('${movie.posterUrl}')`;
    heroTitle.textContent = movie.title;
    heroOverview.textContent = movie.plot.replace(/<\/?[^>]+(>|$)/g, "");
    heroMeta.classList.remove('hidden');
    heroRating.textContent = String(movie.rating);
    heroGenre.textContent = translateGenre(movie.genre.split(', ')[0]);
    heroYear.textContent = String(movie.year);
    heroBookBtn.onclick = () => openTicketModal(movie);
    heroDetailBtn.onclick = () => openDetailModal(movie);
}
export function showSkeletons() {
    movieGrid.innerHTML = '';
    const template = document.getElementById('skeletonTemplate');
    for (let i = 0; i < 10; i++) {
        movieGrid.appendChild(template.content.cloneNode(true));
    }
}
export function showModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.firstElementChild.classList.remove('scale-95');
    modal.firstElementChild.classList.add('scale-100');
}
export function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.firstElementChild.classList.remove('scale-100');
    modal.firstElementChild.classList.add('scale-95');
}
export function showToast(message, iconClass = 'fa-circle-check', iconColor = 'text-emerald-400') {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = message;
    const toastIcon = document.getElementById('toastIcon');
    toastIcon.className = `fa-solid ${iconClass} ${iconColor}`;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}
export function openDetailModalById(id) {
    const movie = state.movies.find(m => String(m.id) === String(id))
        || state.filteredMovies.find(m => String(m.id) === String(id));
    if (movie)
        openDetailModal(movie);
}
export function openTicketModalById(id) {
    const movie = state.movies.find(m => String(m.id) === String(id))
        || state.filteredMovies.find(m => String(m.id) === String(id));
    if (movie)
        openTicketModal(movie);
}
export function openDetailModal(movie) {
    document.getElementById('modalCover').src = movie.posterUrl;
    document.getElementById('modalTitle').textContent = movie.title;
    document.getElementById('modalGenre').textContent = movie.genre.split(', ').map(translateGenre).join(' \u2022 ');
    document.getElementById('modalRating').textContent = String(movie.rating);
    const runtimeSpan = document.getElementById('modalRuntime').querySelector('span');
    runtimeSpan.textContent = `${movie.runtime}`;
    document.getElementById('modalSummary').innerHTML = movie.plot;
    const favBtn = document.getElementById('modalFavBtn');
    const isFav = state.favorites.has(movie.id);
    const favIcon = favBtn.querySelector('i');
    favIcon.className = `${isFav ? 'fa-solid text-brand-red' : 'fa-regular'} fa-heart`;
    favBtn.onclick = () => {
        toggleFavorite(movie.id);
        favIcon.className = `${state.favorites.has(movie.id) ? 'fa-solid text-brand-red' : 'fa-regular'} fa-heart`;
    };
    const modalBookBtn = document.getElementById('modalBookBtn');
    modalBookBtn.onclick = () => {
        closeModal('detailModal');
        openTicketModal(movie);
    };
    showModal('detailModal');
}
export function openTicketModal(movie) {
    state.selectedSeats.clear();
    document.getElementById('ticketMovieTitle').textContent = movie.title;
    updateTicketTotal();
    const seatsGrid = document.getElementById('seatsGrid');
    seatsGrid.innerHTML = '';
    for (let i = 1; i <= 24; i++) {
        const seat = document.createElement('button');
        const isOccupied = i % 5 === 0;
        seat.className = `w-9 h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${isOccupied
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-40'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/80'}`;
        seat.textContent = String(i);
        if (!isOccupied)
            seat.onclick = () => toggleSeat(i, seat);
        seatsGrid.appendChild(seat);
    }
    showModal('ticketModal');
}
export function toggleSeat(seatNum, seatEl) {
    if (state.selectedSeats.has(seatNum)) {
        state.selectedSeats.delete(seatNum);
        seatEl.classList.remove('bg-brand-red', 'text-white', 'border-brand-red');
        seatEl.classList.add('bg-slate-800', 'text-slate-300');
    }
    else {
        state.selectedSeats.add(seatNum);
        seatEl.classList.remove('bg-slate-800', 'text-slate-300');
        seatEl.classList.add('bg-brand-red', 'text-white', 'border-brand-red');
    }
    updateTicketTotal();
}
export function updateTicketTotal() {
    const total = state.selectedSeats.size * state.ticketPrice;
    document.getElementById('ticketTotal').textContent = `$${total.toFixed(2)}`;
    document.getElementById('confirmBookingBtn').disabled = state.selectedSeats.size === 0;
}
export function toggleFavorite(id) {
    if (state.favorites.has(id)) {
        state.favorites.delete(id);
        showToast(state.language === 'es' ? 'Eliminada de favoritos' : 'Removed from favorites', 'fa-heart-crack', 'text-slate-400');
    }
    else {
        state.favorites.add(id);
        showToast(state.language === 'es' ? 'A\u00f1adida a favoritos' : 'Added to favorites', 'fa-heart', 'text-brand-red');
    }
    document.getElementById('favCount').textContent = String(state.favorites.size);
    renderGrid();
}
export function updateHeroReviews(count) {
    const heroMeta = document.getElementById('heroMeta');
    const existingBadge = document.getElementById('heroReviewBadge');
    if (!count) {
        if (existingBadge)
            existingBadge.remove();
        return;
    }
    if (!existingBadge) {
        const badge = document.createElement('span');
        badge.id = 'heroReviewBadge';
        badge.className = 'flex items-center gap-1 bg-brand-red/20 border border-brand-red/30 px-2.5 py-1 rounded-md text-xs';
        badge.innerHTML = '<i class="fa-solid fa-comments text-brand-red"></i> <span id="heroReviewCount"></span>';
        heroMeta.insertBefore(badge, heroMeta.firstChild);
    }
    const heroReviewCount = document.getElementById('heroReviewCount');
    heroReviewCount.textContent = String(count);
}
export function showAdsBanner(ads) {
    const existingBanner = document.getElementById('adsBanner');
    if (existingBanner)
        existingBanner.remove();
    if (!ads || ads.length === 0)
        return;
    const pills = ads.map(ad => `<span class="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border border-slate-700">
            <span class="text-slate-300">${ad.promo}</span>
            <span class="text-brand-gold font-bold">${ad.discount}</span>
        </span>`).join('');
    const bannerHTML = `
        <div id="adsBanner" class="flex items-center gap-4 overflow-x-auto py-3 px-4 bg-gradient-to-r from-brand-red/10 to-amber-500/10 border border-brand-red/20 rounded-xl mb-4 animate-fade-in">
            <span class="text-brand-red text-sm font-bold whitespace-nowrap flex items-center gap-1.5">
                <i class="fa-solid fa-tag"></i> Ofertas
            </span>
            ${pills}
        </div>
    `;
    movieGrid.insertAdjacentHTML('beforebegin', bannerHTML);
}
export function filterAndRenderMovies() {
    state.filteredMovies = state.movies.filter(movie => {
        if (state.searchQuery.length >= 3) {
            return movie.title.toLowerCase().includes(state.searchQuery.toLowerCase());
        }
        if (state.activeFilter === 'all')
            return true;
        return movie.genre.split(', ').some((g) => g.toLowerCase().includes(state.activeFilter.toLowerCase()));
    });
    renderGrid();
}
