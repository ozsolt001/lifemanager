import { NgTemplateOutlet, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface LearningNode {
  id: number;
  title: string;
  children: LearningNode[];
  expanded: boolean;
}

interface QueueItem {
  nodeId: number;
  path: string[];
}

@Component({
  selector: 'app-learning',
  imports: [FormsModule, NgTemplateOutlet, NgClass],
  templateUrl: './learning.html',
  styleUrl: './learning.css',
  host: {
    class: 'fixed inset-x-0 bottom-0 top-[4.5rem] z-[1] block overflow-hidden bg-[#f5f7fb] text-[#172033]',
  },
})
export class Learning {
  readonly maxDepth = 10;

  private nextId = 10;

  concepts: LearningNode[] = [
    {
      id: 1,
      title: 'Frontend engineering',
      expanded: true,
      children: [
        {
          id: 2,
          title: 'Angular',
          expanded: true,
          children: [
            { id: 3, title: 'Components', expanded: true, children: [] },
            { id: 4, title: 'Templates', expanded: true, children: [] },
          ],
        },
        { id: 5, title: 'Tailwind CSS', expanded: true, children: [] },
      ],
    },
    {
      id: 6,
      title: 'Computer science',
      expanded: true,
      children: [
        { id: 7, title: 'Data structures', expanded: true, children: [] },
        { id: 8, title: 'Algorithms', expanded: true, children: [] },
      ],
    },
    { id: 9, title: 'Languages', expanded: true, children: [] },
  ];

  queue: QueueItem[] = [];
  newRootTitle = '';
  childDrafts: Record<number, string> = {};

  addRootConcept(): void {
    const title = this.newRootTitle.trim();

    if (!title) {
      return;
    }

    this.concepts = [...this.concepts, this.createNode(title)];
    this.newRootTitle = '';
  }

  addSubconcept(parent: LearningNode, depth: number): void {
    if (!this.canAddChild(depth)) {
      return;
    }

    const title = this.childDrafts[parent.id]?.trim();

    if (!title) {
      return;
    }

    parent.children = [...parent.children, this.createNode(title)];
    parent.expanded = true;
    this.childDrafts = { ...this.childDrafts, [parent.id]: '' };
  }

  deleteConcept(nodeId: number, path: string[]): void {
    this.concepts = this.removeNode(this.concepts, nodeId);
    this.queue = this.queue.filter((item) => !this.pathStartsWith(item.path, path));

    const { [nodeId]: _removedDraft, ...remainingDrafts } = this.childDrafts;
    this.childDrafts = remainingDrafts;
  }

  canAddChild(depth: number): boolean {
    return depth < this.maxDepth;
  }
  
  openChildForms = new Set<number>();

  toggleAddChild(node: LearningNode): void {
    if (this.openChildForms.has(node.id)) {
      this.openChildForms.delete(node.id);
      delete this.childDrafts[node.id];
    } else {
      this.openChildForms.add(node.id);
    }
  }

  isAddingChild(node: LearningNode): boolean {
    return this.openChildForms.has(node.id);
  }

  toggleExpanded(node: LearningNode): void {
    node.expanded = !node.expanded;
  }

  queueConcept(node: LearningNode, path: string[]): void {
    if (this.isQueued(node.id)) {
      return;
    }

    this.queue = [...this.queue, { nodeId: node.id, path }];
  }

  removeFromQueue(nodeId: number): void {
    this.queue = this.queue.filter((item) => item.nodeId !== nodeId);
  }

  clearQueue(): void {
    this.queue = [];
  }

  isQueued(nodeId: number): boolean {
    return this.queue.some((item) => item.nodeId === nodeId);
  }

  formatPath(path: string[]): string {
    return path.join(' / ');
  }

  headingClass(depth: number): string {
    const classes: Record<number, string> = {
      1: 'text-4xl font-extrabold',
      2: 'text-3xl font-bold',
      3: 'text-2xl font-bold',
      4: 'text-xl font-bold',
      5: 'text-lg font-bold',
      6: 'text-base font-extrabold uppercase tracking-[0.08em]',
    };

    return classes[Math.min(depth, 6)] ?? classes[6];
  }

  trackNode(_index: number, node: LearningNode): number {
    return node.id;
  }

  trackQueueItem(_index: number, item: QueueItem): number {
    return item.nodeId;
  }

  private createNode(title: string): LearningNode {
    return {
      id: this.nextId++,
      title,
      expanded: true,
      children: [],
    };
  }

  private removeNode(nodes: LearningNode[], nodeId: number): LearningNode[] {
    return nodes
      .filter((node) => node.id !== nodeId)
      .map((node) => ({
        ...node,
        children: this.removeNode(node.children, nodeId),
      }));
  }

  private pathStartsWith(path: string[], prefix: string[]): boolean {
    return prefix.every((part, index) => path[index] === part);
  }
}
