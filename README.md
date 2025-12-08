# LinkTree Clone

A professional LinkTree clone built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 Beautiful gradient themes for each profile
- 🌙 Dark/Light mode toggle
- 📱 Fully responsive design
- 🚀 Fast and optimized with Next.js
- 🎯 Projects popup modal
- 🔗 Cross-profile linking
- ✨ Smooth animations and hover effects
- 📧 Email integration
- 🎭 Professional design better than original LinkTree

## Demo Profiles

- `/john` - Full Stack Developer
- `/sarah` - UI/UX Designer  
- `/mike` - Content Creator

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── [username]/
│   │   └── page.tsx          # Dynamic profile pages
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # 403 homepage
├── components/
│   ├── IconComponent.tsx    # Icon mapping
│   ├── ProjectsModal.tsx    # Projects popup
│   └── ThemeProvider.tsx    # Theme context
├── public/data/
│   ├── john.json           # John's profile data
│   ├── sarah.json          # Sarah's profile data
│   └── mike.json           # Mike's profile data
└── data/                   # Backup JSON files
```

## Adding New Profiles

1. Create a new JSON file in `public/data/[username].json`
2. Follow the existing JSON structure
3. Access via `localhost:3000/[username]`

## Deployment

Deploy easily on Vercel:

```bash
npm run build
```

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Vercel Ready

## License

MIT License

ok ab yh kro ke profilkes ka data public se rome kro and wait kro main new data load methed btao ga tum ko code ys remove kro publib folder delete nhi karn
