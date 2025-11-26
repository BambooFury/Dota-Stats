const pluginName = "yourname.dotastats";

function InitializePlugins() {
    !window.PLUGIN_LIST && (window.PLUGIN_LIST = {});
    if (!window.PLUGIN_LIST[pluginName]) {
        window.PLUGIN_LIST[pluginName] = {};
    }
}

InitializePlugins();

var millennium_main = (function (exports) {
    "use strict";

    exports.default = async function () {
        console.log("__DOTASTATS__ Front End Loaded.");

        try {
            const rightCols = await Millennium.findElement(document, ".profile_rightcol");
            if (!rightCols || rightCols.length === 0) {
                console.error("[dotastats] .profile_rightcol not found");
                return;
            }

            const rightCol = rightCols[0];
            if (rightCol.querySelector(".dotastats-card")) {
                return;
            }

            // Вставляем стили напрямую, т.к. static/dotastats.css не всегда подхватывается
            try {
                if (!document.getElementById("dotastats-style")) {
                    const style = document.createElement("style");
                    style.id = "dotastats-style";
                    style.textContent = `
                        .dotastats-card {
                            position: relative;
                            overflow: visible;
                            background: transparent;
                            border-radius: 10px;
                            padding: 14px 14px 10px;
                            color: #f5f5f5;
                            font-size: 13px;
                            margin-bottom: 10px;
                            box-shadow: none;
                        }
                        .dotastats-dotabuff-btn {
                            position: absolute;
                            top: 4px;
                            right: 6px;
                            width: 20px;
                            height: 20px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            text-decoration: none;
                            cursor: pointer;
                            user-select: none;
                        }
                        .dotastats-dotabuff-btn img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                            filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.8));
                            transition: transform 0.15s ease, filter 0.15s ease;
                        }
                        .dotastats-dotabuff-btn:hover img {
                            transform: translateY(-1px);
                            filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.95));
                        }
                        .dotastats-name-row {
                            position: relative;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: 600;
                            font-size: 12px;
                            margin-bottom: 4px;
                        }
                        .dotastats-name-row span {
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .dotastats-rank {
                            position: relative;
                            display: flex;
                            justify-content: center;
                            margin: 4px 0 0;
                        }
                        .dotastats-rank-circle {
                            width: 52px;
                            height: 52px;
                            border-radius: 50%;
                            background: transparent;
                            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.65), 0 0 10px rgba(255, 190, 90, 0.8);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                        }
                        .dotastats-rank-icon {
                            width: 56px;
                            height: 56px;
                            object-fit: contain;
                        }
                        .dotastats-top-rank {
                            position: absolute;
                            bottom: 2px;
                            left: 50%;
                            transform: translateX(-50%);
                            font-size: 11px;
                            font-weight: 700;
                            color: #ffffff;
                            text-shadow: 0 0 3px rgba(0, 0, 0, 0.9), 0 0 6px rgba(0, 0, 0, 0.9);
                            pointer-events: none;
                        }
                        .dotastats-rank-label {
                            margin-top: 2px;
                            font-size: 11px;
                            text-align: center;
                            opacity: 0.95;
                        }
                        .dotastats-stats {
                            position: relative;
                            margin-top: 4px;
                        }
                        .dotastats-stats-line {
                            font-size: 11px;
                            text-align: center;
                            white-space: nowrap;
                        }
                        .dotastats-stats-line b {
                            font-weight: 600;
                            font-size: 12px;
                        }
                        .dotastats-footer {
                            position: relative;
                            margin-top: 6px;
                            border-top: 1px dashed rgba(255,255,255,0.18);
                            padding-top: 4px;
                            text-align: center;
                            font-size: 11px;
                        }
                        .dotastats-footer a {
                            color: #ffcc55;
                            text-decoration: none;
                            transition: color 0.15s ease, text-shadow 0.15s ease;
                        }
                        .dotastats-footer a:hover {
                            color: #ffe08a;
                            text-shadow: 0 0 6px rgba(255, 218, 120, 0.8);
                        }
                        .dotastats-source-note {
                            margin-top: 3px;
                            font-size: 9px;
                            text-align: center;
                            color: rgba(255, 255, 255, 0.45);
                        }
                    `;
                    document.head.appendChild(style);
                }
            } catch (styleErr) {
                console.error("[dotastats] failed to inject styles", styleErr);
            }

            const container = document.createElement("div");
            container.className = "account-row";
            container.innerHTML = `
                <div class="dotastats-card">
                    <a id="dotastats-dotabuff" class="dotastats-dotabuff-btn" href="#" target="_blank" title="Open Dotabuff">
                        <img src="https://steamloopback.host/DotaRanks/dotabuff_icon.png" alt="Dotabuff" />
                    </a>
                    <div class="dotastats-name-row"><span id="dotastats-name">Dota 2 Player</span></div>
                    <div class="dotastats-rank">
                        <div id="dotastats-rank-circle" class="dotastats-rank-circle">
                            <img id="dotastats-rank-icon" class="dotastats-rank-icon" src="https://steamloopback.host/DotaRanks/netrank.png" alt="Нет ранга" />
                            <div id="dotastats-top-rank" class="dotastats-top-rank" style="display:none;"></div>
                        </div>
                    </div>
                    <div id="dotastats-rank-label" class="dotastats-rank-label">Нет ранга</div>
                    <div class="dotastats-stats">
                        <div class="dotastats-stats-line">
                            Matches: <b id="dotastats-matches">...</b>
                            &nbsp; MMR: <b id="dotastats-mmr">...</b>
                            &nbsp; WR: <b id="dotastats-winrate">...</b>
                        </div>
                    </div>
                    <div class="dotastats-footer">
                        <a id="dotastats-link" href="#" target="_blank">Show detailed Dota stats</a>
                        <div class="dotastats-source-note">Данные: OpenDota, могут отличаться от клиента Dota 2</div>
                    </div>
                </div>
            `;

            // Вставляем сразу после первой строки (как делает FaceIt Stats)
            rightCol.insertBefore(container, rightCol.children[1] || null);

            // Всё, что ниже — best-effort: при любой ошибке остаются заглушки
            try {
                const parser = new DOMParser();
                const xmlProfileUrl = `${window.location.href}?xml=1`;

                const xmlResp = await fetch(xmlProfileUrl);
                const xmlText = await xmlResp.text();
                const xmlDoc = parser.parseFromString(xmlText, "application/xml");
                const steamId64 = xmlDoc.querySelector("steamID64")?.textContent || null;

                if (!steamId64) {
                    console.error("[dotastats] steamID64 not found in XML profile");
                    return;
                }

                // Переводим steamID64 в account_id для OpenDota
                let accountId;
                try {
                    const STEAMID64_OFFSET = BigInt("76561197960265728");
                    const accountIdBigInt = BigInt(steamId64) - STEAMID64_OFFSET;
                    accountId = accountIdBigInt.toString();
                } catch (e) {
                    console.error("[dotastats] BigInt not supported or conversion failed", e);
                    return;
                }

                const matchesEl = document.getElementById("dotastats-matches");
                const winrateEl = document.getElementById("dotastats-winrate");
                const mmrEl = document.getElementById("dotastats-mmr");
                const nameEl = document.getElementById("dotastats-name");
                const rankIconEl = document.getElementById("dotastats-rank-icon");
                const rankCircleEl = document.getElementById("dotastats-rank-circle");
                const rankLabelEl = document.getElementById("dotastats-rank-label");
                const topRankEl = document.getElementById("dotastats-top-rank");
                const dotabuffEl = document.getElementById("dotastats-dotabuff");
                const linkEl = document.getElementById("dotastats-link");

                if (linkEl) {
                    linkEl.href = `https://www.opendota.com/players/${accountId}`;
                }
                if (dotabuffEl) {
                    dotabuffEl.href = `https://www.dotabuff.com/players/${accountId}`;
                }

                try {
                    const [playerResp, wlResp] = await Promise.all([
                        fetch(`https://api.opendota.com/api/players/${accountId}`),
                        fetch(`https://api.opendota.com/api/players/${accountId}/wl`)
                    ]);

                    const playerData = await playerResp.json();
                    const wlData = await wlResp.json();

                    const wins = wlData.win || 0;
                    const losses = wlData.lose || 0;
                    const totalMatches = wins + losses;
                    const hasVisibleStats = totalMatches > 0;
                    const winrate = hasVisibleStats ? (wins / totalMatches) * 100 : 0;

                    let mmr = playerData.mmr_estimate?.estimate || playerData.solo_competitive_rank || null;
                    const rankTier = playerData.rank_tier || null;
                    const leaderboardRank = playerData.leaderboard_rank || null;
                    const personaName = playerData.profile?.personaname || "Dota 2 Player";

                    if (matchesEl) matchesEl.textContent = hasVisibleStats ? String(totalMatches) : "скрыто";
                    if (winrateEl) winrateEl.textContent = hasVisibleStats ? `${winrate.toFixed(2)}%` : "скрыто";
                    if (nameEl) nameEl.textContent = personaName;

                    if (rankTier) {
                        const tierStr = String(rankTier).padStart(2, "0");
                        const major = parseInt(tierStr.charAt(0), 10);
                        let minor = parseInt(tierStr.charAt(1), 10);
                        // На всякий случай ограничиваем количество звёзд 1..5
                        if (!Number.isFinite(minor) || minor < 1) minor = 1;
                        if (minor > 5) minor = 5;

                        if (rankIconEl) {
                            // Иконки рангов должны лежать в steamui/DotaRanks/rank_icon_<major>_<minor>.png
                            rankIconEl.src = `https://steamloopback.host/DotaRanks/rank_icon_${major}_${minor}.png`;
                        }

                        // Если нет реального MMR, прикидываем по рангу и количеству звёзд
                        if (mmr == null || mmr === "N/A") {
                            // Таблица приблизительного MMR по рангу и звёздам (1–5)
                            // Основана на известных значениях, как на твоём скриншоте
                            const approxByTierAndStar = {
                                //  major: { minor: mmr }
                                1: { // Рекрут / Herald
                                    1: 0,
                                    2: 154,
                                    3: 308,
                                    4: 462,
                                    5: 616,
                                },
                                2: { // Страж / Guardian
                                    1: 770,
                                    2: 924,
                                    3: 1078,
                                    4: 1232,
                                    5: 1386,
                                },
                                3: { // Рыцарь / Crusader
                                    1: 1540,
                                    2: 1694,
                                    3: 1848,
                                    4: 2002,
                                    5: 2156,
                                },
                                4: { // Герой / Archon
                                    1: 2310,
                                    2: 2464,
                                    3: 2618,
                                    4: 2772,
                                    5: 2926,
                                },
                                5: { // Легенда / Legend
                                    1: 3080,
                                    2: 3234,
                                    3: 3388,
                                    4: 3542,
                                    5: 3696,
                                },
                                6: { // Властелин / Ancient
                                    1: 3850,
                                    2: 4004,
                                    3: 4158,
                                    4: 4312,
                                    5: 4466,
                                },
                                7: { // Божество / Divine
                                    1: 4620,
                                    2: 4820,
                                    3: 5020,
                                    4: 5220,
                                    5: 5420,
                                },
                                8: { // Титан / Immortal — просто примерные значения
                                    1: 6200,
                                    2: 6400,
                                    3: 6600,
                                    4: 6800,
                                    5: 7000,
                                },
                            };

                            const tierMap = approxByTierAndStar[major];
                            if (tierMap) {
                                if (tierMap[minor]) {
                                    mmr = tierMap[minor];
                                } else if (tierMap[5]) {
                                    mmr = tierMap[5];
                                }
                            }
                        }

                        if (rankCircleEl) {
                            const glowColors = {
                                1: "rgba(80, 200, 120, 0.9)",   // Рекрут — зелёный
                                2: "rgba(180, 120, 60, 0.9)",   // Страж — коричневатый
                                3: "rgba(90, 200, 255, 0.9)",   // Рыцарь — голубоватый
                                4: "rgba(140, 160, 255, 0.9)",  // Герой — синий/фиолетовый
                                5: "rgba(255, 215, 120, 0.95)", // Легенда — золотистый
                                6: "rgba(255, 160, 90, 0.95)",  // Властелин — оранжево-золотой
                                7: "rgba(190, 120, 255, 0.95)", // Божество — фиолетовый
                                8: "rgba(255, 255, 255, 0.95)", // Титан — почти белый
                            };

                            const glow = glowColors[major] || "rgba(255, 190, 90, 0.8)";
                            rankCircleEl.style.boxShadow = `0 0 0 2px rgba(0, 0, 0, 0.65), 0 0 14px ${glow}`;
                        }

                        if (topRankEl) {
                            // Показываем топ только для Титана, если есть leaderboard_rank
                            if (major === 8 && leaderboardRank) {
                                try {
                                    const formatted = Number(leaderboardRank).toLocaleString("en-US");
                                    topRankEl.textContent = formatted;
                                    topRankEl.style.display = "block";
                                } catch {
                                    topRankEl.textContent = String(leaderboardRank);
                                    topRankEl.style.display = "block";
                                }
                            } else {
                                topRankEl.style.display = "none";
                            }
                        }

                        if (rankLabelEl) {
                            const baseNames = {
                                1: "Рекрут",
                                2: "Страж",
                                3: "Рыцарь",
                                4: "Герой",
                                5: "Легенда",
                                6: "Властелин",
                                7: "Божество",
                                8: "Титан",
                            };

                            const baseName = baseNames[major] || "Без ранга";
                            const rankText = major >= 8 ? baseName : `${baseName} ${minor}`;
                            rankLabelEl.textContent = rankText;
                        }
                    } else {
                        // Нет ранга: используем отдельную иконку-заглушку и подпись
                        if (rankIconEl) {
                            rankIconEl.src = "https://steamloopback.host/DotaRanks/rank_icon_unranked.png";
                        }
                        if (rankLabelEl) {
                            rankLabelEl.textContent = "Нет ранга";
                        }
                        if (topRankEl) {
                            topRankEl.style.display = "none";
                        }
                    }

                    if (mmrEl) mmrEl.textContent = mmr != null ? String(mmr) : "";
                } catch (e) {
                    console.error("[dotastats] failed to load OpenDota data", e);
                }
            } catch (innerErr) {
                console.error("[dotastats] unexpected error while resolving OpenDota stats", innerErr);
            }
        } catch (err) {
            console.error("[dotastats] error while injecting widget", err);
        }
    };

    Object.defineProperty(exports, "__esModule", { value: true });
    return exports;
})({});

function ExecuteWebkitModule() {
    Object.assign(window.PLUGIN_LIST[pluginName], millennium_main);
    millennium_main["default"]();
}

ExecuteWebkitModule();
