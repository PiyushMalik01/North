'use client';

import { useState } from 'react';
import { Check, Trash2, Flag, MessageSquare, FileText, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { moderationQueue, type ModItem, type ReportStatus } from '@/data/platform/admin';

type TabValue = ReportStatus | 'all';

function KindIcon({ kind }: { kind: ModItem['kind'] }) {
  return kind === 'post' ? (
    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
  ) : (
    <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
  );
}

function ReasonBadge({ reason }: { reason: string }) {
  const destructiveReasons = ['harassment', 'hate', 'violence'];
  const variant = destructiveReasons.includes(reason) ? 'destructive' : 'outline';
  return <Badge variant={variant}>{reason}</Badge>;
}

function ResolvedBadge({ status }: { status: ReportStatus }) {
  if (status === 'approved') {
    return (
      <Badge variant="outline" className="border-emerald-600 text-emerald-600">
        approved
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-destructive text-destructive">
      removed
    </Badge>
  );
}

function ItemCard({
  item,
  onApprove,
  onRemove,
}: {
  item: ModItem;
  onApprove: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <KindIcon kind={item.kind} />
          <span className="font-medium text-foreground">{item.author}</span>
          <ReasonBadge reason={item.reason} />
          <span className="flex items-center gap-1 text-muted-foreground">
            <Flag className="h-3.5 w-3.5" />
            {item.reports}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">{item.ago}</span>
        </div>

        <p className="mt-2 text-sm italic text-muted-foreground">&ldquo;{item.excerpt}&rdquo;</p>

        <div className="mt-3 flex items-center gap-2">
          {item.status === 'pending' ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onApprove(item.id)}
                className="gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onRemove(item.id)}
                className="gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
            </>
          ) : (
            <ResolvedBadge status={item.status} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ tab }: { tab: TabValue }) {
  const messages: Record<TabValue, string> = {
    pending: 'Nothing pending — queue is clear.',
    approved: 'No approved items yet.',
    removed: 'No removed items yet.',
    all: 'No items in the queue.',
  };
  return (
    <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
      {messages[tab]}
    </div>
  );
}

export default function ModerationQueue() {
  const [items, setItems] = useState<ModItem[]>(moderationQueue);
  const [tab, setTab] = useState<TabValue>('pending');

  const pendingCount = items.filter((i) => i.status === 'pending').length;

  function handleApprove(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'approved' } : i)));
    toast.success('Kept — marked approved');
  }

  function handleRemove(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'removed' } : i)));
    toast('Content removed');
  }

  const filtered = tab === 'all' ? items : items.filter((i) => i.status === tab);

  return (
    <div>
      <AdminHeader title="Moderation" description="Review reported huddle content.">
        <Badge variant="outline" className="gap-1.5 text-xs text-muted-foreground">
          <ShieldAlert className="h-3.5 w-3.5" />
          Mock data — DB offline
        </Badge>
      </AdminHeader>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="gap-1.5">
            Pending
            {pendingCount > 0 && (
              <Badge variant="destructive" className="h-4 min-w-4 px-1 text-[10px]">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="removed">Removed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        {(['pending', 'approved', 'removed', 'all'] as TabValue[]).map((t) => (
          <TabsContent key={t} value={t} className="space-y-3">
            {filtered.length === 0 ? (
              <EmptyState tab={tab} />
            ) : (
              filtered.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onApprove={handleApprove}
                  onRemove={handleRemove}
                />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
