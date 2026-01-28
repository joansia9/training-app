import { Component, model, output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import type { TaskStatus } from '../../../../../prisma/app';

@Component({
  selector: 'app-status-menu',
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './status-menu.component.html',
  styleUrl: './status-menu.component.scss',
})
export class StatusMenuComponent {
  readonly status = model.required<TaskStatus>();
  readonly changed = output();

  protected setStatus(newStatus: TaskStatus) {
    this.status.set(newStatus);
    this.changed.emit();
  }
}
