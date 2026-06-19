# 🏆 Álbum de Figurinhas Copa 2026

A modern, mobile-first web application for tracking FIFA 2026 sticker collections. Built with vanilla JavaScript and Supabase for real-time synchronization across devices.

## Features

- **Responsive Design**: Mobile-first approach for seamless experience on any device
- **Real-time Sync**: Supabase integration for instant updates across all your devices
- **Sticker Tracking**: Track which stickers you have, need, and want to trade
- **Collection Management**: Organize stickers by team, player, or collection status
- **Trading System**: Facilitate trades with other collectors
- **Offline Support**: Progressive Web App capabilities for offline access

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Version Control**: Git

## Project Structure

```
figurinhas-album-2026/
├── css/                    # Stylesheets
├── js/                     # JavaScript modules
├── data/                   # Data files and fixtures
├── scripts/                # Utility scripts
├── docs/                   # Documentation
│   └── superpowers/
│       └── plans/          # Development plans
├── index.html              # Main entry point
├── .env.local              # Local environment variables
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Getting Started

### Prerequisites
- Node.js 16+ (optional, for development tooling)
- Git
- A Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/figurinhas-album-2026.git
cd figurinhas-album-2026
```

2. Create local environment file:
```bash
cp .env.local.example .env.local
```

3. Configure your Supabase credentials in `.env.local`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

4. Open `index.html` in your browser or use a local development server:
```bash
python -m http.server 8000
# or
npx http-server
```

## Development

### Directory Organization

- **css/**: Style sheets organized by component or page
- **js/**: JavaScript modules for features, utilities, and components
- **data/**: JSON fixtures, API responses, and data files
- **scripts/**: Build scripts, data processing utilities

### Making Changes

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git add .
git commit -m "feat: describe your changes"
```

3. Push and create a pull request

## Deployment

The project is configured for deployment on Vercel:

1. Push your changes to the main branch
2. Vercel will automatically detect and deploy
3. Environment variables should be configured in Vercel project settings

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Open a pull request

## License

This project is private. All rights reserved.

## Support

For issues or questions, please open an issue on the repository.

---

Built with 💙 by Leandro Henrique
