import { Component, inject, signal, viewChild } from '@angular/core';
import { TRPC_CLIENT } from '../../utils/trpc.client';
import { trpcResource } from '@fhss-web-team/frontend-utils';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TaskCardComponent } from './task-card/task-card.component';

@Component({
  selector: 'app-tasks',
  imports: [MatProgressSpinnerModule, MatPaginator, TaskCardComponent],
  templateUrl: './tasks.page.html',
  styleUrl: './tasks.page.scss',
})
export class TasksPage {
  private readonly trpc = inject(TRPC_CLIENT); //puts trpc client token here

  //pagination stuff
  protected readonly PAGE_SIZE = 12 as const;
  private readonly pageOffset = signal(0); //signal getter functions - reads values
  protected handlePageEvent(e: PageEvent) {
    this.pageOffset.set(e.pageIndex * e.pageSize);
  }

  protected readonly taskResource = trpcResource(
    this.trpc.task.getTasksByUser.mutate,
    () => ({
      pageSize: this.PAGE_SIZE,
      pageXOffset: this.pageOffset(),
    }),
    { autoRefresh: true }
  );

  protected readonly paginator = viewChild.required(MatPaginator); //this function wants a paginator component we can get through viewChild
  protected async taskDeleted() {
    await this.taskResource.refresh();
    if (
      this.pageOffset() != 0 &&
      this.taskResource.value()?.data.length === 0
    ) {
      this.paginator().previousPage();
    }
  }
}
