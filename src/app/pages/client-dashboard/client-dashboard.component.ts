import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, switchMap } from 'rxjs';
import { selectClientById } from '../../state/client/client.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-client-dashboard',
  imports: [AsyncPipe],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.scss',
})
export class ClientDashboardComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  client$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      return id ? this.store.select(selectClientById(id)) : of(null);
    }),
  );
}
