# tri-tui

A terminal UI for browsing World Triathlon stats and rankings.

```
▄▄▄▄▄  ▄▄▄▄   ▄
  ▄    ▄   ▄   ▄
  ▄    ▄▄▄▄    ▄
  ▄    ▄  ▄    ▄
  ▄    ▄   ▄  ▄▄▄
```

## Features

- **WTCS Rankings** - Browse current World Triathlon Championship Series standings for men and women

  ![Rankings View](screenshots/rankings.png?v=2)

- **Athlete Profiles** - View detailed athlete info including recent results and personal bests

  ![Athlete Profile](screenshots/athlete.png?v=2)

- **Race Results** - View detailed results with swim/bike/run splits and visual charts

  ![Race Results](screenshots/event.png?v=2)

- **Athlete Search** - Search for any athlete in the World Triathlon database
- **Athlete Comparison** - Compare two athletes side-by-side with stats and split analysis
- **Event Browser** - Search events and browse race results
- **Keyboard-Driven** - Full keyboard navigation with vim-style bindings (j/k)

## Installation

```bash
# Clone the repository
git clone https://github.com/athleticdevco/tri-tui.git
cd tri-tui

# Install dependencies
npm install

# Link globally (optional)
npm link
```

## Setup

This app requires a free API key from World Triathlon:

1. Visit [developers.triathlon.org](https://developers.triathlon.org)
2. Sign up and get your API key
3. Create a `.env` file in the project root:

```bash
cp .env.example .env
# Edit .env and add your API key
```

## Usage

```bash
# Run directly
npm start

# Or if linked globally
tri
```

## Keyboard Controls

| Key | Action |
|-----|--------|
| `/` | Open command palette |
| `j` / `↓` | Move down |
| `k` / `↑` | Move up |
| `Tab` | Switch columns (Men/Women) |
| `Shift+Tab` | Cycle search context (Athletes/Events) |
| `Enter` | Select / Drill down |
| `c` | Compare athletes (in athlete view) |
| `Esc` | Go back / Cancel |
| `r` | Refresh rankings |
| `q` | Quit |

## Commands

Type `/` to open the command palette:

- `/athletes` - Search for athletes by name
- `/events` - Search for events and race results
- `/rankings` - Return to WTCS rankings view
- `/help` - Show help

## Tech Stack

- [React](https://reactjs.org/) + [Ink](https://github.com/vadimdemedes/ink) - Terminal UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Data Source

This app uses the official [World Triathlon API](https://developers.triathlon.org). You'll need to register for a free API key to use this app.

**Note:** This is an unofficial app and is not affiliated with World Triathlon. Data is provided for personal use only.

## License

MIT
