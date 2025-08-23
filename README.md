# LaughFactory Ticket Scanning App

A React Native Expo application for scanning tickets at LaughFactory events. This app allows staff members to authenticate, view events, scan QR codes on tickets, and manage their profiles.

## Features

- **User Authentication**: Login, forgot password, and update password functionality
- **Dashboard**: Overview of statistics including total events, scanned tickets, and recent activity
- **Events Management**: View all events with filtering and search capabilities
- **QR Code Scanning**: Camera-based QR code scanning for ticket verification
- **Profile Management**: View and update user profile information
- **Offline-First Design**: Works with dummy data during development

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development toolchain and platform
- **React Navigation**: Navigation between screens
- **Expo Camera**: QR code scanning functionality
- **Expo Secure Store**: Secure token storage
- **Context API**: State management for authentication

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button.js
│   ├── Input.js
│   ├── LoadingSpinner.js
│   └── EventCard.js
├── screens/             # Screen components
│   ├── LoginScreen.js
│   ├── DashboardScreen.js
│   ├── EventsScreen.js
│   ├── QRScannerScreen.js
│   ├── ProfileScreen.js
│   └── ForgotPasswordScreen.js
├── navigation/          # Navigation configuration
│   └── AppNavigation.js
├── services/           # API services
│   ├── apiService.js
│   └── apiEndpoints.js
├── config/             # Configuration files
│   └── apiConfig.js
├── context/            # React Context providers
│   └── AuthContext.js
└── utils/              # Utility functions
    └── helpers.js
```

## Installation & Setup

1. **Clone the repository**

   ```bash
   cd /path/to/your/project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your API configuration.

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## API Configuration

The app is designed to work with dummy APIs during development. When your backend APIs are ready, you can easily switch by updating the configuration in:

- `src/config/apiConfig.js` - Update base URLs and endpoints
- `.env` - Update environment variables

### API Endpoints

The app expects the following API endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/forgot-password` - Password reset
- `PUT /auth/update-password` - Update password
- `GET /dashboard/stats` - Dashboard statistics
- `GET /events` - List all events
- `GET /events/:id` - Get single event
- `POST /tickets/scan` - Scan ticket QR code
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile

### Dummy Data

During development, the app uses mock data that simulates real API responses. This allows frontend development to proceed while backend APIs are being developed.

## Key Features Implementation

### Authentication Flow

- Secure token storage using Expo Secure Store
- Automatic token validation on app startup
- Context-based state management for user session

### QR Code Scanning

- Camera permission handling
- Real-time QR code detection
- Validation and feedback for scanned codes
- Integration with ticket verification API

### Responsive Design

- iOS-optimized interface
- Safe area handling for modern devices
- Consistent styling with custom color scheme
- Loading states and error handling

## Development

### Running in Development

```bash
npm start
```

This will start the Expo development server. You can then:

- Scan the QR code with Expo Go app on your phone
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Press `w` to open in web browser

### Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Environment Variables

| Variable           | Description                         | Default                                |
| ------------------ | ----------------------------------- | -------------------------------------- |
| `API_BASE_URL`     | Production API base URL             | `https://api.laughfactory.com/v1`      |
| `DEV_API_BASE_URL` | Development API base URL            | `https://jsonplaceholder.typicode.com` |
| `API_TIMEOUT`      | API request timeout in milliseconds | `10000`                                |

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the existing code style
3. Test thoroughly on both iOS and Android
4. Submit a pull request with a clear description

## API Integration Notes

When the backend APIs are ready:

1. Update the base URL in `.env` file
2. Modify the dummy data flags in `src/services/apiEndpoints.js`
3. Adjust the API response structure if needed
4. Test all endpoints with real data

## License

Private project for LaughFactory internal use.
