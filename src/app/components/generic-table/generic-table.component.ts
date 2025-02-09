import { Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NgClass, TitleCasePipe } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

export interface TableData {
  data: { [columnName: string]: number | string }[];
  totalItems: number;
  pageSize: number;
}

@Component({
  selector: 'app-generic-table',
  imports: [MatTableModule, NgClass, TitleCasePipe, MatPaginator],
  templateUrl: './generic-table.component.html',
})
export class GenericTableComponent {
  tableData = input.required<TableData>();
  pageChange = output<{ currentIndex: number }>();

  // TODO: move this to pipe
  get columns() {
    if (this.tableData().data[0]) return Object.keys(this.tableData().data[0]);
    else return [];
  }

  handlePageEvent(e: PageEvent) {
    this.pageChange.emit({ currentIndex: e.pageIndex + 1 });
  }
}
