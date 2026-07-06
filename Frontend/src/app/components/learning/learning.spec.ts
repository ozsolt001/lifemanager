import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Learning } from './learning';

describe('Learning', () => {
  let component: Learning;
  let fixture: ComponentFixture<Learning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Learning],
    }).compileComponents();

    fixture = TestBed.createComponent(Learning);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds root concepts', () => {
    component.newRootTitle = 'Databases';
    component.addRootConcept();

    expect(component.concepts.at(-1)?.title).toBe('Databases');
    expect(component.newRootTitle).toBe('');
  });

  it('adds subconcepts up to level 10 but not deeper', () => {
    let node = component.concepts[0];

    for (let depth = 1; depth < component.maxDepth; depth++) {
      component.childDrafts[node.id] = `Level ${depth + 1}`;
      component.addSubconcept(node, depth);
      node = node.children.at(-1)!;
    }

    component.childDrafts[node.id] = 'Too deep';
    component.addSubconcept(node, component.maxDepth);

    expect(node.children).toEqual([]);
  });

  it('queues a subconcept with the full path to its root concept', () => {
    const root = component.concepts[0];
    const child = root.children[0];
    const grandchild = child.children[0];
    const path = [root.title, child.title, grandchild.title];

    component.queueConcept(grandchild, path);

    expect(component.queue).toEqual([{ nodeId: grandchild.id, path }]);
  });

  it('does not queue the same concept twice', () => {
    const root = component.concepts[0];
    const path = [root.title];

    component.queueConcept(root, path);
    component.queueConcept(root, path);

    expect(component.queue.length).toBe(1);
  });

  it('deletes a concept and all of its child concepts', () => {
    const root = component.concepts[0];
    const child = root.children[0];
    const childPath = [root.title, child.title];

    component.deleteConcept(child.id, childPath);

    expect(root.children.some((node) => node.id === child.id)).toBe(false);
  });

  it('removes queued descendants when a parent concept is deleted', () => {
    const root = component.concepts[0];
    const child = root.children[0];
    const grandchild = child.children[0];

    component.queueConcept(root, [root.title]);
    component.queueConcept(grandchild, [root.title, child.title, grandchild.title]);
    component.deleteConcept(child.id, [root.title, child.title]);

    expect(component.queue).toEqual([{ nodeId: root.id, path: [root.title] }]);
  });
});
