import { Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NgClass, TitleCasePipe } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

export interface TableData {
  [columnName: string]: number | string;
}

@Component({
  selector: 'app-generic-table',
  imports: [MatTableModule, NgClass, TitleCasePipe, MatPaginator],
  templateUrl: './generic-table.component.html',
})
export class GenericTableComponent {
  tableData = input.required<TableData[]>();

  // todo: move this to pipe
  get columns() {
    return Object.keys(this.tableData()[0]);
  }

  handlePageEvent(e: PageEvent) {
    console.log(e);
  }
}
