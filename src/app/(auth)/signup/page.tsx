import AuthPage from '@/components/auth/AuthPage';

export const metadata = {
  title: 'Sign up — North',
  description: 'Create your North account and start mapping your skills.',
};

export default function SignupPage() {
  return <AuthPage initialMode="signup" />;
}
