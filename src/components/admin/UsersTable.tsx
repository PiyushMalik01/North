'use client';

import { useState } from 'react';
import { Search, MoreHorizontal, ShieldCheck, Ban, CheckCircle2, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { adminUsers, type AdminUser, type UserRole } from '@/data/platform/admin';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

function Initials({ name }: { name: string }) {
  const letters = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <div className="size-8 rounded-full bg-muted grid place-items-center text-xs font-medium text-muted-foreground shrink-0">
      {letters}
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  if (role === 'admin') return <Badge>admin</Badge>;
  if (role === 'teacher') return <Badge variant="secondary">teacher</Badge>;
  return <Badge variant="outline">student</Badge>;
}

function StatusBadge({ status }: { status: AdminUser['status'] }) {
  if (status === 'active')
    return (
      <Badge variant="secondary" className="text-emerald-600">
        active
      </Badge>
    );
  return <Badge variant="destructive">suspended</Badge>;
}

export function UsersTable() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [query, setQuery] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()),
  );

  function setRole(id: string, role: UserRole) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    const user = users.find((u) => u.id === id);
    if (user) toast.success(`${user.name} is now an ${role}`);
  }

  function toggleStatus(id: string) {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const next: AdminUser['status'] = user.status === 'active' ? 'suspended' : 'active';
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: next } : u)));
    if (next === 'suspended') toast(`${user.name} suspended`);
    else toast.success(`${user.name} reactivated`);
  }

  return (
    <div>
      <AdminHeader title="Users" description="Manage students, teachers, and admins." />

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {filtered.length} {filtered.length === 1 ? 'user' : 'users'}
        </span>
      </div>

      <div className="overflow-x-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>XP</TableHead>
              <TableHead>Streak</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Initials name={user.name} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground leading-tight truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <RoleBadge role={user.role} />
                </TableCell>
                <TableCell className="text-sm">{user.level}</TableCell>
                <TableCell className="text-sm">{user.xp.toLocaleString()}</TableCell>
                <TableCell className="text-sm">{user.streak}d</TableCell>
                <TableCell>
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.joined}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Open menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setRole(user.id, 'admin')}
                        disabled={user.role === 'admin'}
                      >
                        <ShieldCheck className="size-4 mr-2" />
                        Promote to admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setRole(user.id, 'teacher')}
                        disabled={user.role === 'teacher'}
                      >
                        <UserCog className="size-4 mr-2" />
                        Make teacher
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === 'active' ? (
                        <DropdownMenuItem
                          onClick={() => toggleStatus(user.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Ban className="size-4 mr-2" />
                          Suspend
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => toggleStatus(user.id)}>
                          <CheckCircle2 className="size-4 mr-2" />
                          Reactivate
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
