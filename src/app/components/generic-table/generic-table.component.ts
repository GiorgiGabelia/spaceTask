import { Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NgClass } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { CamelCaseToTitleCasePipe } from './camel-case-to-title-case.pipe';

export interface GenericTable {
  data: { [columnName: string]: number | string }[];
  columns: string[];
  totalItems: number;
  pageSize: number;
}

@Component({
  selector: 'app-generic-table',
  imports: [
    MatTableModule,
    NgClass,
    MatPaginator,
    MatSortModule,
    CamelCaseToTitleCasePipe,
  ],
  templateUrl: './generic-table.component.html',
})
export class GenericTableComponent {
  readonly pageChange = output<{ currentIndex: number }>();
  readonly sortChange = output<Sort>();

  tableData = input.required<GenericTable>();

  announcePageChange(e: PageEvent) {
    this.pageChange.emit({ currentIndex: e.pageIndex + 1 });
  }

  announceSortChange(e: Sort) {
    this.sortChange.emit(e);
  }
}
