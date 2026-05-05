const block = (style: string) =>
  `<div class="dotastats-skel-block" style="${style}"></div>`;

const heroRow = (nameWidth: number) => `
    <div class="dotastats-skel-row">
      ${block("width:8px;height:8px;border-radius:50%;flex-shrink:0")}
      ${block("width:40px;height:22px;border-radius:3px;flex-shrink:0")}
      ${block(`width:${nameWidth}px;height:11px`)}
      <div style="margin-left:auto;display:flex;gap:6px">
        ${block("width:32px;height:11px")}
        ${block("width:36px;height:11px")}
      </div>
    </div>`;

const header = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      ${block("width:70px;height:9px")}
      ${block("width:16px;height:16px;border-radius:3px")}
    </div>`;

const divider = `
    <div style="display:flex;align-items:center;gap:8px;margin:8px 0;">
      <div style="flex:1;height:1px;background:linear-gradient(to right,transparent,rgba(100,130,160,0.3))"></div>
      ${block("width:50px;height:9px;border-radius:4px")}
      <div style="flex:1;height:1px;background:linear-gradient(to left,transparent,rgba(100,130,160,0.3))"></div>
    </div>`;

const mainBlock = `
    <div class="dotastats-skel-row" style="align-items:flex-start;gap:10px;margin-top:4px">
      ${block("width:52px;height:52px;border-radius:4px;flex-shrink:0")}
      <div style="flex:1;display:flex;flex-direction:column;gap:6px;padding-top:2px">
        ${block("width:110px;height:13px")}
        ${block("width:75px;height:11px")}
        <div style="display:flex;gap:8px">
          ${block("width:55px;height:11px")}
          ${block("width:55px;height:11px")}
          ${block("width:55px;height:11px")}
        </div>
      </div>
    </div>`;

export const SKELETON_HTML = `
  <div class="dotastats-skeleton">${header}${heroRow(90)}${heroRow(70)}${heroRow(80)}${divider}${mainBlock}
  </div>
`;
