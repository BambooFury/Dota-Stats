export function injectStyles() {
  if (document.getElementById("dotastats-style")) return;
  if (!document.getElementById("dotastats-font")) {
    const link = document.createElement("link");
    link.id = "dotastats-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap";
    document.head.appendChild(link);
  }
  const style = document.createElement("style");
  style.id = "dotastats-style";
  style.textContent = `
    .dotastats-widget {
      font-family: "Motiva Sans", sans-serif;
      padding: 12px 14px 10px;
      color: #c6d4df;
      font-size: 12px;
      background: rgba(0, 0, 0, 0.45);
      border-radius: 6px;
      margin: 8px 6px;
      backdrop-filter: blur(4px);
    }
    .dotastats-heroes {
      margin-bottom: 10px;
    }
    .dotastats-heroes-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #8f98a0;
      margin-bottom: 6px;
    }
    .dotastats-hero-row {
      display: flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 5px;
    }
    .dotastats-hero-dot {
      color: #4caf50;
      font-size: 10px;
      flex-shrink: 0;
    }
    .dotastats-hero-img {
      width: 40px;
      height: 22px;
      object-fit: cover;
      border-radius: 3px;
      flex-shrink: 0;
    }
    .dotastats-hero-img-wrap {
      position: relative;
      flex-shrink: 0;
      width: 40px;
      height: 22px;
    }
    .dotastats-hero-name {
      flex: 1;
      color: #c6d4df;
      font-size: 11px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dotastats-hero-stats {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
      font-size: 10px;
      color: #8f98a0;
    }
    .dotastats-hero-wr {
      color: #4caf50;
    }
    .dotastats-skeleton {
      padding: 12px 14px 10px;
      background: rgba(0, 0, 0, 0.45);
      border-radius: 6px;
      margin: 8px 6px;
    }
    .dotastats-skel-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .dotastats-skel-block {
      background: linear-gradient(90deg, #1e2530 25%, #2a3444 50%, #1e2530 75%);
      background-size: 200% 100%;
      animation: dotastats-shimmer 1.4s infinite;
      border-radius: 4px;
    }
    @keyframes dotastats-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .dotastats-divider {
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(100,130,160,0.5), transparent);
      margin: 8px 0;
      border: none;
    }
    .dotastats-main {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      gap: 10px;
      width: 100%;
    }
    .dotastats-rank-img {
      width: 52px;
      height: 52px;
      object-fit: contain;
      flex-shrink: 0 !important;
      display: block !important;
    }
    .dotastats-info {
      flex: 1 !important;
      min-width: 0;
    }
    .dotastats-name {
      font-size: 13px;
      font-weight: 600;
      color: #e8eaed;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 160px;
    }
    .dotastats-rank-label {
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .dotastats-stats-row {
      display: flex;
      gap: 10px;
      font-size: 11px;
      color: #8f98a0;
    }
    .dotastats-stat-val {
      color: #c6d4df;
    }
    .dotastats-footer {
      margin-top: 7px;
      font-size: 10px;
      color: #6a7a8a;
      display: flex;
      justify-content: space-between;
    }
    .dotastats-expand-btn {
      position: relative;
      margin: 6px 0 0;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 4px 0;
    }
    .dotastats-expand-btn::before,
    .dotastats-expand-btn::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(100,130,160,0.45));
    }
    .dotastats-expand-btn::after {
      background: linear-gradient(to left, transparent, rgba(100,130,160,0.45));
    }
    .dotastats-expand-inner {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      color: #6a7a8a;
      transition: color 0.15s;
      white-space: nowrap;
    }
    .dotastats-expand-btn:hover .dotastats-expand-inner {
      color: #c6d4df;
    }
    .dotastats-expand-arrow {
      width: 10px;
      height: 10px;
      transition: transform 0.2s;
    }
    .dotastats-activity {
      margin-top: 10px;
      padding: 4px 0;
    }
    .dotastats-activity-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #8f98a0;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
    }
    .dotastats-plus {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      vertical-align: middle;
    }
    .dotastats-plus img {
      width: 16px;
      height: 16px;
      object-fit: contain;
    }
    .dotastats-recent-matches {
      margin-top: 4px;
      margin-bottom: 2px;
    }
    .dotastats-recent-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .dotastats-wl-badge {
      position: relative;
      display: inline-flex;
      align-items: flex-end;
      justify-content: flex-end;
      width: 36px;
      height: 22px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .dotastats-wl-badge.win {
      box-shadow: 0 0 0 1px rgba(60, 180, 80, 0.5);
    }
    .dotastats-wl-badge.loss {
      box-shadow: 0 0 0 1px rgba(180, 60, 60, 0.5);
    }
    .dotastats-wl-letter {
      position: absolute;
      bottom: 1px;
      right: 2px;
      font-size: 9px;
      font-weight: 700;
      font-family: 'Orbitron', 'Motiva Sans', sans-serif;
      letter-spacing: 0;
      line-height: 1;
      text-shadow: 0 0 6px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1);
    }
    .dotastats-wl-badge.win .dotastats-wl-letter { color: #7dffaa; }
    .dotastats-wl-badge.loss .dotastats-wl-letter { color: #ff9090; }
  `;
  document.head.appendChild(style);
}
