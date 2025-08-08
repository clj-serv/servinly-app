'use client';
import EmailConfirmationPage from './EmailConfirmationPage';
import SignUpPage from './SignUpPage';
import ProfilePage from './ProfilePage';
import Dashboard from './Dashboard';

export default function ServinlyApp() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-3">
      <h1 className="text-3xl font-semibold">Servinly App</h1>
      <p className="opacity-70 text-sm">
        App shell loaded. Components are imported with default exports to satisfy build.
      </p>
      <div className="hidden">
        <EmailConfirmationPage />
        <SignUpPage />
        <ProfilePage />
        <Dashboard />
      </div>
    </main>
  );
}
