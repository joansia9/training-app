import {
  Component,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StatusMenuComponent } from '../status-menu/status-menu.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {
  ConfirmationDialog,
  trpcResource,
} from '@fhss-web-team/frontend-utils';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TRPC_CLIENT } from '../../../utils/trpc.client';
import type { TaskStatus } from '../../../../../prisma/app';

type TaskCard = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  completedAt: Date | null;
};

@Component({
  selector: 'app-task-card',
  imports: [
    MatIconModule,
    StatusMenuComponent,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormField,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  private readonly trpc = inject(TRPC_CLIENT);
  private readonly confirmation = inject(ConfirmationDialog);

  readonly initialState = input.required<TaskCard>();
  readonly deleted = output();

  protected readonly editMode = signal<boolean>(false);
  protected readonly newTitle = linkedSignal(() => this.initialState().title);
  protected readonly newDescription = linkedSignal(
    () => this.initialState().description
  );
  protected readonly newStatus = linkedSignal<TaskStatus>(
    () => this.initialState().status
  );

  protected readonly state = trpcResource(
    this.trpc.task.updateTask.mutate,
    () => ({
      id: this.initialState().id,
      newTitle: this.newTitle(),
      newDescription: this.newDescription(),
      newStatus: this.newStatus(),
    }),
    { valueComputation: () => this.initialState() }
  );

  protected readonly deleteResource = trpcResource(
    this.trpc.task.deleteTask.mutate,
    () => ({
      id: this.initialState().id,
    })
  );

  protected async save() {
    if (await this.state.refresh()) {
      this.toggleEditMode();
    }
  }

  protected cancel() {
    this.newTitle.set(this.state.value()?.title ?? '');
    this.newDescription.set(this.state.value()?.description ?? '');
    this.toggleEditMode();
  }

  protected toggleEditMode() {
    this.editMode.update(prev => !prev);
  }

  protected deleteTask() {
    this.confirmation
      .open({ action: 'delete this task' })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.deleteResource.refresh().then(success => {
            if (success) {
              this.deleted.emit();
            }
          });
        }
      });
  }
}
