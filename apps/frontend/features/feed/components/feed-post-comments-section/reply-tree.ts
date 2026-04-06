import type { ReplyItem, ReplyNode } from "./types";

export function buildReplyTree(replies: ReplyItem[]): ReplyNode[] {
  const byParent = new Map<string | null, ReplyItem[]>();
  for (const r of replies) {
    const p = r.parentReplyId;
    const arr = byParent.get(p) ?? [];
    arr.push(r);
    byParent.set(p, arr);
  }
  const cmp = (a: ReplyItem, b: ReplyItem) =>
    a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id);
  for (const [, arr] of byParent) {
    arr.sort(cmp);
  }
  function walk(parentId: string | null): ReplyNode[] {
    const items = byParent.get(parentId) ?? [];
    return items.map((reply) => ({
      reply,
      children: walk(reply.id),
    }));
  }
  return walk(null);
}
