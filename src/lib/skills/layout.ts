import type { SkillNodeData } from '@/data/skill-trees/web-development';

export interface PositionedNode {
  id: string;
  x: number;
  y: number;
  layer: number;
}

const NODE_WIDTH = 220;
const NODE_HEIGHT = 88;
const HORIZONTAL_GAP = 60;
const VERTICAL_GAP = 100;

function assignLayers(nodes: SkillNodeData[]): Map<string, number> {
  const layers = new Map<string, number>();
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  function getLayer(id: string): number {
    if (layers.has(id)) return layers.get(id)!;

    const node = nodeMap.get(id);
    if (!node || node.prerequisites.length === 0) {
      layers.set(id, 0);
      return 0;
    }

    const maxPrereqLayer = Math.max(
      ...node.prerequisites
        .filter((pid) => nodeMap.has(pid))
        .map((pid) => getLayer(pid))
    );
    const layer = maxPrereqLayer + 1;
    layers.set(id, layer);
    return layer;
  }

  for (const node of nodes) {
    getLayer(node.id);
  }

  return layers;
}

function groupByLayer(
  nodes: SkillNodeData[],
  layers: Map<string, number>
): Map<number, string[]> {
  const groups = new Map<number, string[]>();
  for (const node of nodes) {
    const layer = layers.get(node.id) ?? 0;
    if (!groups.has(layer)) groups.set(layer, []);
    groups.get(layer)!.push(node.id);
  }
  return groups;
}

function orderWithinLayers(
  layerGroups: Map<number, string[]>,
  nodes: SkillNodeData[]
): Map<number, string[]> {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const ordered = new Map<number, string[]>();
  const sortedLayers = [...layerGroups.keys()].sort((a, b) => a - b);

  for (const layer of sortedLayers) {
    const ids = layerGroups.get(layer)!;

    if (layer === 0) {
      ordered.set(layer, ids);
      continue;
    }

    const prevLayer = ordered.get(layer - 1) ?? [];
    const prevPositions = new Map(prevLayer.map((id, i) => [id, i]));

    const withBarycenter = ids.map((id) => {
      const node = nodeMap.get(id)!;
      const parentPositions = node.prerequisites
        .filter((pid) => prevPositions.has(pid))
        .map((pid) => prevPositions.get(pid)!);

      const barycenter =
        parentPositions.length > 0
          ? parentPositions.reduce((sum, p) => sum + p, 0) /
            parentPositions.length
          : 0;

      return { id, barycenter };
    });

    withBarycenter.sort((a, b) => a.barycenter - b.barycenter);
    ordered.set(
      layer,
      withBarycenter.map((w) => w.id)
    );
  }

  return ordered;
}

export function computeLayout(nodes: SkillNodeData[]): PositionedNode[] {
  const layers = assignLayers(nodes);
  const layerGroups = groupByLayer(nodes, layers);
  const orderedGroups = orderWithinLayers(layerGroups, nodes);

  const maxLayerWidth = Math.max(
    ...[...orderedGroups.values()].map(
      (ids) => ids.length * NODE_WIDTH + (ids.length - 1) * HORIZONTAL_GAP
    )
  );

  const positioned: PositionedNode[] = [];

  for (const [layer, ids] of orderedGroups) {
    const layerWidth =
      ids.length * NODE_WIDTH + (ids.length - 1) * HORIZONTAL_GAP;
    const offsetX = (maxLayerWidth - layerWidth) / 2;

    for (let i = 0; i < ids.length; i++) {
      positioned.push({
        id: ids[i],
        x: offsetX + i * (NODE_WIDTH + HORIZONTAL_GAP),
        y: layer * (NODE_HEIGHT + VERTICAL_GAP),
        layer,
      });
    }
  }

  return positioned;
}

export interface EdgeData {
  id: string;
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

export function computeEdges(
  nodes: SkillNodeData[],
  positions: PositionedNode[]
): EdgeData[] {
  const posMap = new Map(positions.map((p) => [p.id, p]));
  const edges: EdgeData[] = [];

  for (const node of nodes) {
    const target = posMap.get(node.id);
    if (!target) continue;

    for (const prereqId of node.prerequisites) {
      const source = posMap.get(prereqId);
      if (!source) continue;

      edges.push({
        id: `${prereqId}->${node.id}`,
        sourceId: prereqId,
        targetId: node.id,
        sourceX: source.x + NODE_WIDTH / 2,
        sourceY: source.y + NODE_HEIGHT,
        targetX: target.x + NODE_WIDTH / 2,
        targetY: target.y,
      });
    }
  }

  return edges;
}

export { NODE_WIDTH, NODE_HEIGHT };
