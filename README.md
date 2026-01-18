<div align="center">

# Dota 2 OpenDota Stats for Millennium

Compact Dota 2 statistics widget directly on your Steam profile page.

<br/>

<!-- You can attach a screenshot of the plugin card here -->
<img src="examplee.png" alt="Dota 2 OpenDota Stats preview" width="640" />

</div>

---

## ⚡ About

Plugin for [Steam Millennium](https://github.com/SteamClientHomebrew/Millennium) that integrates a Dota 2 stats widget directly into your Steam profile.

**What this plugin does:**

- **Dota 2 rank and medal** using local Steam icons (`steamui/DotaRanks`).
- **Rank label in Russian**: Recruit, Guardian, Crusader, Hero, Legend, Ancient, Divine, Immortal.
- **MMR**:
  - uses `mmr_estimate` / `solo_competitive_rank` when available from OpenDota;
  - otherwise calculates an **approximate MMR from rank and stars**.
- Compact stats line: `Matches / MMR / WR`.
- If OpenDota stats are hidden, it shows `Matches: hidden`, `WR: hidden`.
- Button to quickly open your profile on **OpenDota**.
- Shortcut icon to **Dotabuff** in the top‑right corner of the card.

> All data is fetched from OpenDota and **may differ from what you see in the Dota 2 client**.

---

## 📥 Installation

> It is recommended to install plugins only from trusted sources. Always review the code before installing.

1. Download the latest plugin build (`dotastats-x.y.z.zip`).
2. Extract the archive contents into your Steam plugins folder:
   - default on Windows: `C:\Program Files (x86)\Steam\plugins\dotastats`.
3. Make sure the structure looks roughly like this:

   ```text
   Steam/
    └─ plugins/
       └─ dotastats/
          ├─ backend/
          ├─ frontend/
          ├─ webkit/
          ├─ plugin.json
          └─ ...
   ```

4. Restart Steam with Millennium installed.
5. Open the Millennium settings and enable the **Dota 2 OpenDota Stats** plugin.

---

## 🛠 Building

Clone the repository:

```bash
git clone https://github.com/BambooFury/dotastats.git
cd dotastats
```

Install dependencies and build the frontend:

```bash
npm install
npm run build
```

The `npm run build` command copies the compiled webkit bundle from `.millennium/Dist/webkit.js` to `webkit/webkit.js`.

After building, move the `dotastats` folder into your Steam plugins directory (see the Installation section).

---

## 📎 Notes

- The plugin uses Millennium **WebKit** to inject JavaScript directly into the Steam browser.
- Do not install plugins from untrusted sources — they have access to the contents of your Steam pages.
- With many profiles having private or incomplete stats, discrepancies between Dota 2, OpenDota and Dotabuff data are possible.

**Default Millennium paths:**

- **Windows:** `C:\Program Files (x86)\Steam`  → plugins in `Steam/plugins`.
- **Unix:** `~/.millennium` (if you are using Millennium there).

---

## 📜 License

This project is licensed under the **MIT** license. See [LICENSE](LICENSE) for details.

