import AuthPage from '@/components/auth/AuthPage';

export const metadata = {
  title: 'Log in — North',
  description: 'Log in to your North account and continue building your skill profile.',
};

export default function LoginPage() {
  return <AuthPage initialMode="login" />;
}
