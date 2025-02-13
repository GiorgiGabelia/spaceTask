import { Component, DestroyRef, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, distinctUntilChanged, filter, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SessionStorageService } from '../../services/session-storage.service';

@Component({
  selector: 'app-mini-filter-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatButtonModule,
  ],
  templateUrl: './mini-filter-form.component.html',
})
export class MiniFilterFormComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sessionStorage = inject(SessionStorageService);

  addMiniFilters = output<{ name: string | null }>();

  readonly form = new FormGroup({
    name: new FormControl<string>(
      this.sessionStorage.readFiltersStateFromSession()?.name || '',
    ),
  });

  ngOnInit() {
    this.form.controls.name.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((val) =>
        this.addMiniFilters.emit({
          name: val || null,
        }),
      );
  }
}
