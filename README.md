<div align="center">

# Dota 2 Stats for Millennium

A [Millennium](https://steambrew.app/) plugin that displays Dota 2 player statistics directly on Steam profile pages.

<br/>

<img src="examplee.png" alt="Dota 2 Stats Preview" width="600" />

</div>

---

## Features

- **Rank Medal Display** — Shows your current Dota 2 rank with official medal icons
- **MMR Estimation** — Displays MMR from OpenDota or calculates approximate value from rank
- **Match Statistics** — Total matches played and win rate percentage
- **Leaderboard Position** — Shows top rank position for Immortal players
- **Quick Links** — One-click access to your OpenDota and Dotabuff profiles
- **Works Everywhere** — Compatible with Steam Desktop and Overlay browser

## Requirements

- [Millennium](https://steambrew.app/) v2.30.0 or higher
- Windows or Linux
- Public Steam profile (for best results)

## Installation

### Method 1: Millennium Plugin Installer (Recommended)

1. Open Steam with Millennium installed
2. Go to **Steam** → **Millennium** → **Plugins**
3. Click **Install a plugin**
4. Paste the Plugin ID and click **Install**
5. Restart Steam when prompted

### Method 2: Manual Installation

1. Download the latest release from [Releases](https://github.com/BambooFury/Dota-Stats/releases)
2. Extract to your Steam plugins folder:
   - **Windows:** `C:\Program Files (x86)\Steam\plugins\dotastats`
   - **Linux:** `~/.millennium/plugins/dotastats`
3. Restart Steam
4. Enable the plugin in Millennium settings

## Building from Source

```bash
# Clone the repository
git clone https://github.com/BambooFury/Dota-Stats.git
cd Dota-Stats

# Install dependencies
npm install

# Build the plugin
npm run build
```

## How It Works

The plugin uses the [OpenDota API](https://docs.opendota.com/) to fetch player statistics and displays them in a custom widget on Steam profile pages. All data is fetched in real-time and may differ slightly from what you see in the Dota 2 client.

## Data Sources

- **Primary:** [OpenDota](https://www.opendota.com/) - Free and open-source Dota 2 statistics
- **Alternative:** [Dotabuff](https://www.dotabuff.com/) - Quick link for detailed match history

## Privacy

This plugin:
- ✅ Only fetches publicly available data from OpenDota
- ✅ Does not collect or store any personal information
- ✅ Does not modify your Steam profile
- ✅ Runs entirely locally on your machine

## Troubleshooting

### Stats not loading?

- Make sure your Steam profile is **public**
- Check that you have played Dota 2 matches (OpenDota needs data to display)
- Try refreshing the profile page (F5)
- OpenDota API might be temporarily unavailable

### Plugin not showing?

- Verify Millennium is installed and running
- Check that the plugin is enabled in Millennium settings
- Restart Steam completely
- Check console for errors (F12 in Steam)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-rebuild
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **Frontend:** TypeScript + React (via @steambrew/client)
- **Backend:** Lua (for system access)
- **Build System:** Millennium CLI
- **API:** OpenDota REST API

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Millennium](https://steambrew.app/) - The Steam client modding framework
- [OpenDota](https://www.opendota.com/) - Free Dota 2 statistics API
- [Valve](https://www.valvesoftware.com/) - Dota 2 rank icons and assets

## Support

If you encounter any issues or have questions:

- Open an [Issue](https://github.com/BambooFury/Dota-Stats/issues)
- Join the [Millennium Discord](https://steambrew.app/discord)
- Check the [Millennium Documentation](https://docs.steambrew.app/)

---

<div align="center">

Made with ❤️ for the Dota 2 community

[Report Bug](https://github.com/BambooFury/Dota-Stats/issues) · [Request Feature](https://github.com/BambooFury/Dota-Stats/issues)

</div>
