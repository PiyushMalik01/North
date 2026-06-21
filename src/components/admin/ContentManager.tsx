'use client';

import { traceNodes, traceBranches } from '@/data/platform/trace';
import { assessments } from '@/data/platform/prove';
import { quests } from '@/data/platform/spark';
import { driftFeed } from '@/data/platform/drift';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { GitBranch, FileCheck2, Target, Rss } from 'lucide-react';

// ── helpers ─────────────────────────────────────────────────────────────────

function branchName(id: string): string {
  return traceBranches.find((b) => b.id === id)?.name ?? id;
}

function Dash() {
  return <span className="text-muted-foreground">—</span>;
}

// ── Skills ──────────────────────────────────────────────────────────────────

function SkillsTab() {
  const totalXp = traceNodes.reduce((s, n) => s + n.xp, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Branches', value: traceBranches.length },
          { label: 'Nodes', value: traceNodes.length },
          { label: 'Total XP', value: totalXp },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="px-4 py-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-0.5 text-xl font-semibold text-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-x-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Deps</TableHead>
              <TableHead>XP</TableHead>
              <TableHead>Prove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {traceNodes.map((node) => (
              <TableRow key={node.id}>
                <TableCell className="font-medium">{node.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{branchName(node.branchId)}</Badge>
                </TableCell>
                <TableCell>{node.tier}</TableCell>
                <TableCell>{node.deps.length}</TableCell>
                <TableCell>{node.xp}</TableCell>
                <TableCell>
                  {node.proveId ? (
                    <span className="font-mono text-xs text-foreground">{node.proveId}</span>
                  ) : (
                    <Dash />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Assessments ──────────────────────────────────────────────────────────────

function AssessmentsTab() {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Kind</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Pass %</TableHead>
            <TableHead>XP</TableHead>
            <TableHead>Linked Node</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{a.kind}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{branchName(a.branchId)}</Badge>
              </TableCell>
              <TableCell>{a.questions.length}</TableCell>
              <TableCell>{a.passPct}%</TableCell>
              <TableCell>{a.xp}</TableCell>
              <TableCell>
                {a.nodeId ? (
                  <span className="font-mono text-xs text-foreground">{a.nodeId}</span>
                ) : (
                  <Dash />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Quests ───────────────────────────────────────────────────────────────────

function QuestsTab() {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Steps</TableHead>
            <TableHead>XP</TableHead>
            <TableHead>Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quests.map((q) => (
            <TableRow key={q.id}>
              <TableCell className="font-medium">{q.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{q.type}</Badge>
              </TableCell>
              <TableCell>{q.steps.length}</TableCell>
              <TableCell>{q.xp}</TableCell>
              <TableCell className="max-w-64 truncate text-sm text-muted-foreground">
                {q.detail}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Feed ─────────────────────────────────────────────────────────────────────

function FeedTab() {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Kind</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Posted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {driftFeed.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{item.kind}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.source}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{item.tags.length - 2}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {item.ago}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────

export default function ContentManager() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Content"
        description="The skill tree, assessments, quests, and feed."
      />

      <Tabs defaultValue="skills">
        <TabsList>
          <TabsTrigger value="skills" className="gap-1.5">
            <GitBranch className="h-3.5 w-3.5" />
            Skills ({traceNodes.length})
          </TabsTrigger>
          <TabsTrigger value="assessments" className="gap-1.5">
            <FileCheck2 className="h-3.5 w-3.5" />
            Assessments ({assessments.length})
          </TabsTrigger>
          <TabsTrigger value="quests" className="gap-1.5">
            <Target className="h-3.5 w-3.5" />
            Quests ({quests.length})
          </TabsTrigger>
          <TabsTrigger value="feed" className="gap-1.5">
            <Rss className="h-3.5 w-3.5" />
            Feed ({driftFeed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="mt-4">
          <SkillsTab />
        </TabsContent>
        <TabsContent value="assessments" className="mt-4">
          <AssessmentsTab />
        </TabsContent>
        <TabsContent value="quests" className="mt-4">
          <QuestsTab />
        </TabsContent>
        <TabsContent value="feed" className="mt-4">
          <FeedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
