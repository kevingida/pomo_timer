# Pomo Timer

A modern, responsive Pomodoro timer web application built with **Next.js 16** and **React 19**. Boost your productivity with customizable work intervals, break times, and beautiful themed backgrounds.

## Features

✨ **Pomodoro Technique**: Classic 25-minute focus sessions with configurable breaks
🎨 **Theme System**: Multiple beautiful themes with custom wallpapers (Bubble, Lake Side Cafe, Minimal Black, Serene Forest)
📋 **Task Management**: Create, track, and organize tasks with drag-and-drop support
⏱️ **Flexible Durations**: Customize focus time, short break, and long break durations
🔔 **Sound Notifications**: Audio alerts when sessions complete
📱 **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile
🌗 **Dark Mode Support**: Theme-aware styling for comfortable viewing

## Tech Stack

- **Framework**: [Next.js 16.2](https://nextjs.org/)
- **UI Library**: [React 19.2](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Drag & Drop**: [@dnd-kit](https://docs.dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: Jest + React Testing Library
- **Language**: TypeScript

## Project Structure

```
pomo_timer/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Main application layout
│   ├── layout.tsx               # Root layout
│   └── favicon.ico
│
├── features/                     # Feature modules
│   ├── timer/                   # Pomodoro timer logic
│   │   ├── components/
│   │   │   ├── TimerCircle.tsx      # Visual timer display
│   │   │   ├── TimerControl.tsx     # Play/pause/reset controls
│   │   │   └── TimerTabs.tsx        # Mode selection tabs
│   │   ├── hooks/
│   │   │   ├── useTimer.ts          # Core timer countdown (10 tests)
│   │   │   ├── usePomodoroCycle.ts  # Cycle management (14 tests)
│   │   │   ├── useTimerActions.ts   # UI actions (10 tests)
│   │   │   ├── useDialog.ts         # Dialog state
│   │   │   ├── useDocumentTitle.ts  # Browser title updates
│   │   │   └── useSound.ts          # Audio notifications
│   │   ├── type.ts              # TypeScript types
│   │   └── constant.ts          # Configuration constants
│   │
│   ├── task/                    # Task management
│   │   ├── components/
│   │   │   ├── TasksList.tsx        # Task list display
│   │   │   ├── TaskListItem.tsx     # Individual task item
│   │   │   └── TaskEditor/          # Task creation/editing
│   │   ├── hooks/
│   │   │   ├── useTasksState.ts     # Task state management (27 tests)
│   │   │   ├── useTasks.tsx         # Context consumer hook
│   │   │   └── useTaskEditor.ts     # Editor state
│   │   ├── providers/
│   │   │   └── TaskProvider.tsx     # Context provider
│   │   └── type.ts              # Task interfaces
│   │
│   ├── theme/                   # Theme system
│   │   ├── components/
│   │   │   └── ThemeSelector.tsx    # Theme picker UI
│   │   ├── data/                # Theme configurations
│   │   │   ├── bubble.ts
│   │   │   ├── lakeSideCafe.ts
│   │   │   ├── minimalBlack.ts
│   │   │   └── sereneForest.ts
│   │   ├── hooks/
│   │   │   └── useThemes.ts     # Theme state management
│   │   ├── providers/
│   │   │   └── ThemeProvider.tsx    # Theme context
│   │   └── interface.ts         # Theme types
│   │
│   └── settings/                # Application settings
│       ├── components/
│       │   ├── Timer.tsx            # Duration settings
│       │   ├── Themes.tsx           # Theme settings
│       │   └── Sounds.tsx           # Sound settings
│       ├── hooks/
│       │   └── useSettings.tsx      # Settings state
│       ├── providers/
│       │   └── SettingsProvider.tsx # Settings context
│       └── type.ts              # Settings types
│
├── __tests__/                    # Test files
│   ├── useTimer.test.ts
│   ├── usePomodoroCycle.test.ts
│   ├── useTasksState.test.ts
│   └── useTimerActions.test.ts
│
├── jest.config.js               # Jest configuration
├── jest.setup.js                # Test environment setup
├── TEST_SUMMARY.md              # Detailed test documentation
└── package.json                 # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/kevingida/pomo_timer.git
cd pomo_timer

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

The app supports hot reloading—edit files in `features/` and changes appear immediately.

## Usage

### Starting a Pomodoro Session

1. **Select Mode**: Choose between Focus, Short Break, or Long Break using the tabs
2. **Set Duration**: Adjust duration in Settings if needed
3. **Start Timer**: Click the play button or press spacebar
4. **Pause/Resume**: Click pause to pause, play to resume
5. **Reset**: Click reset to go back to 00:00

### Managing Tasks

1. **Add Task**: Enter task name in the task input field
2. **Mark Complete**: Click the checkbox next to a task
3. **Reorder**: Drag tasks to reorder your list
4. **Delete**: Click the trash icon to remove a task
5. **Track Progress**: Completed Pomodoro count shown per task

### Customizing Settings

- **Duration**: Adjust focus (default 25m), short break (default 5m), and long break (default 15m) lengths
- **Theme**: Choose from preset themes with different wallpapers and color schemes
- **Sounds**: Toggle notification sounds on/off

## Testing

Comprehensive test suite with **61 tests** covering all critical business logic.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm test:watch

# Generate coverage report
npm test:coverage
```

### Test Coverage

- **useTimer** (10 tests): Timer countdown, elapsed time, completion detection
- **usePomodoroCycle** (14 tests): Mode transitions, long break intervals
- **useTasksState** (27 tests): Task CRUD, localStorage persistence, state management
- **useTimerActions** (10 tests): UI actions, dialog confirmations, status-aware behavior

See [TEST_SUMMARY.md](./TEST_SUMMARY.md) for detailed test documentation.

## Architecture

### State Management

- **Task State**: React Context API with localStorage persistence
- **Timer State**: React Hooks (useState, useCallback, useEffect)
- **Theme State**: React Context API with localStorage persistence
- **Settings State**: React Context API

### Key Hooks

| Hook | Purpose | Test Coverage |
|------|---------|---|
| `useTimer` | Core countdown logic | ✓ 10 tests |
| `usePomodoroCycle` | Cycle mode management | ✓ 14 tests |
| `useTasksState` | Task CRUD & persistence | ✓ 27 tests |
| `useTimerActions` | UI action handlers | ✓ 10 tests |

### Data Persistence

- **Tasks**: Stored in browser localStorage under "tasks" key
- **Theme Selection**: Persisted in localStorage
- **Settings**: Cached in settings context

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- Next.js 16 optimizations (App Router, automatic code splitting)
- Responsive design with Tailwind CSS
- Efficient state updates with React hooks
- localStorage caching for offline persistence

## Future Enhancements

- Cloud sync for tasks and settings
- Statistics dashboard with completed sessions tracking
- Custom notifications and desktop alerts
- Keyboard shortcuts customization
- Pomodoro analytics and insights
- Mobile app version (React Native)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, bugs, or feature requests, please open an issue on GitHub: [pomo_timer/issues](https://github.com/kevingida/pomo_timer/issues)

---

**Made with ❤️ for better productivity**
