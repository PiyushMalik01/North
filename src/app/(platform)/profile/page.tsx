import { FiUser, FiMail, FiBook, FiAward } from 'react-icons/fi';

export const metadata = {
  title: 'Profile — North',
  description: 'Your skill profile and learning history.',
};

export default function ProfilePage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-yellow)] flex items-center justify-center text-[var(--accent-fg)] text-xl font-bold">
          P
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Student Name
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Web Development · 2nd Year
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: FiMail, label: 'Email', value: 'student@college.edu' },
          { icon: FiBook, label: 'Skills Completed', value: '5 of 17' },
          { icon: FiAward, label: 'Current Streak', value: '3 days' },
          { icon: FiUser, label: 'Role', value: 'Student' },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="p-4 rounded-lg bg-[var(--background-secondary)] border border-[var(--border-color)]"
          >
            <div className="flex items-center gap-2 text-[var(--text-muted)] mb-1">
              <Icon size={14} />
              <span className="text-xs uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-[var(--text-muted)]">
        Profile editing will be available once authentication is connected.
      </p>
    </div>
  );
}
