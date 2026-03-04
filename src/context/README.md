# React Context API Reference

This directory contains the global state management files for the Survey Module MVP. We use the React Context API to manage state that needs to be accessed by multiple components across the application without prop drilling.

## 1. AuthContext (`AuthContext.jsx`)
Manages the simulated user authentication state and role assignments.

### State Managed
- `currentUser`: Object containing `{ name: string, role: 'admin' | 'user' }` or `null` if logged out.

### Key Functions
- `login(role)`: Sets the `currentUser` based on the requested role ('admin' or 'user'). Automatically saves to `localStorage` for persistence across page reloads.
- `logout()`: Clears the `currentUser` from state and `localStorage`.
- `useAuth()`: Custom hook to consume the Context.

### Usage Example
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
    const { currentUser, logout } = useAuth();
    
    if (currentUser?.role === 'admin') {
        return <div>Admin Portal Access</div>;
    }
    return <button onClick={logout}>Sign Out</button>;
}
```

---

## 2. SurveyContext (`SurveyContext.jsx`)
Manages the mock backend database, storing global survey records and system notifications. This ensures that changes made in one part of the app (like submitting a survey) instantly reflect elsewhere (like the dashboard charts or verification list).

### State Managed
- `surveys`: Array of survey record objects.
- `notifications`: Array of notification objects.

### Key Functions
- `addSurvey(surveyData)`: Generates a new unique `id`, prepends it to the `surveys` state with a `status: 'pending'`, and triggers a new notification.
- `updateSurveyStatus(id, newStatus)`: Used by the Admin to transition a survey's status (e.g., to `'approved'` or `'rejected'`).
- `markAsRead(id)` / `markAllRead()`: Used by the Navbar to clear unread notification badges.
- `useData()`: Custom hook to consume the Context.

### Usage Example
```jsx
import { useData } from '../context/SurveyContext';

function VerificationPanel() {
    const { surveys, updateSurveyStatus } = useData();

    return (
        <ul>
            {surveys.map(survey => (
                <li key={survey.id}>
                    {survey.name} - Status: {survey.status}
                    <button onClick={() => updateSurveyStatus(survey.id, 'approved')}>
                        Approve
                    </button>
                </li>
            ))}
        </ul>
    );
}
```

## How to Edit/Extend Future Contexts
1. **Adding Properties**: If you need tracking for a new feature (e.g. `settings` or `theme`), simply add a `useState` hook inside the provider function (`SurveyProvider` or `AuthProvider`).
2. **Exporting Functions**: Make sure any new modifier functions (like `setTheme` or `updateSettings`) are passed into the `value` object returned by the Provider so consumers can access them.
3. **App Providers**: If you create a brand new Context completely out of scope of these two, remember to wrap it around your application inside `src/App.jsx`.
