import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DragItem } from './drag-drop-service';
import { Draggable } from './draggable-component';
import { DropTarget } from './drop-target-directive';

interface ExampleCv {
  readonly id: string;
  readonly name: string;
  readonly folderId: string | null;
}

@Component({
  selector: 'app-drag-and-drop-example',
  imports: [Draggable, DropTarget],
  templateUrl: './drag-and-drop-example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragAndDropExample {
  readonly dragType = 'cv';
  readonly folder = { id: 'applications', name: 'Applications' };
  readonly cvs = signal<readonly ExampleCv[]>([
    { id: 'frontend', name: 'Frontend developer CV', folderId: null },
    { id: 'fullstack', name: 'Full-stack developer CV', folderId: null },
  ]);
  readonly availableCvs = computed(() => this.cvs().filter((cv) => cv.folderId === null));
  readonly folderCvs = computed(() =>
    this.cvs().filter((cv) => cv.folderId === this.folder.id),
  );

  dropOnFolder(item: DragItem): void {
    if (item.type !== this.dragType) return;

    this.cvs.update((cvs) =>
      cvs.map((cv) => (cv.id === item.id ? { ...cv, folderId: this.folder.id } : cv)),
    );
  }

  returnToList(id: string): void {
    this.cvs.update((cvs) =>
      cvs.map((cv) => (cv.id === id ? { ...cv, folderId: null } : cv)),
    );
  }
}
