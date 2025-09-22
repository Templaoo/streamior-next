# Firebase Deployment Guide

## Prerequisites

1. Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

## Project Setup

1. Initialize Firebase project:
```bash
firebase init
```

2. Select the following services:
- ✅ Firestore: Configure security rules and indexes
- ✅ Hosting: Configure files for Firebase Hosting
- ✅ Functions (optional): Configure Cloud Functions

3. Use existing project: `streamior-app`

## Deploy Commands

### Deploy everything:
```bash
firebase deploy
```

### Deploy only Firestore rules:
```bash
firebase deploy --only firestore:rules
```

### Deploy only Firestore indexes:
```bash
firebase deploy --only firestore:indexes
```

### Deploy only hosting:
```bash
firebase deploy --only hosting
```

## Development with Emulators

1. Start Firebase emulators:
```bash
firebase emulators:start
```

2. Access the emulator UI:
- Open: http://localhost:4000
- Auth: http://localhost:9099
- Firestore: http://localhost:8080

## Environment Setup

1. Create `.env.local` with your Firebase config
2. Update `src/lib/firebase.ts` if needed
3. Test authentication in development mode

## Security Rules Testing

Test your Firestore rules with:
```bash
firebase emulators:exec --only firestore "npm test"
```

## Hosting Configuration

For Next.js static export:
1. Update `next.config.ts` with `output: 'export'`
2. Run `npm run build`
3. Deploy with `firebase deploy --only hosting`
