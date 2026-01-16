// Добавляем обработчики кликов для открытия ссылок через Steam API
function addClickHandlers(accountId) {
    const dotabuffBtn = document.getElementById('dotastats-dotabuff');
    const opendotaLink = document.getElementById('dotastats-link');
    
    if (dotabuffBtn) {
        dotabuffBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = `https://www.dotabuff.com/players/${accountId}`;
            
            // Попробуем разные способы открытия ссылки
            if (window.SteamClient && window.SteamClient.Browser) {
                window.SteamClient.Browser.OpenURL(url);
            } else if (window.open) {
                window.open(url, '_blank');
            } else {
                // Fallback - копируем в буфер обмена
                navigator.clipboard.writeText(url).then(() => {
                    console.log('[dotastats] URL copied to clipboard:', url);
                });
            }
        });
    }
    
    if (opendotaLink) {
        opendotaLink.addEventListener('click', (e) => {
            e.preventDefault();
            const url = `https://www.opendota.com/players/${accountId}`;
            
            if (window.SteamClient && window.SteamClient.Browser) {
                window.SteamClient.Browser.OpenURL(url);
            } else if (window.open) {
                window.open(url, '_blank');
            } else {
                navigator.clipboard.writeText(url).then(() => {
                    console.log('[dotastats] URL copied to clipboard:', url);
                });
            }
        });
    }
}