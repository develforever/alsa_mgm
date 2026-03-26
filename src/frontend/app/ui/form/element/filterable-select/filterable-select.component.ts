import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  forwardRef,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  Observable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-filterable-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './filterable-select.component.html',
  styleUrls: ['./filterable-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterableSelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableSelectComponent<T> implements ControlValueAccessor, OnInit, OnDestroy {
  /** Funkcja pobierająca listę opcji na podstawie wpisanego ciągu znaków */
  @Input({ required: true }) fetchFn!: (query: string) => Observable<T[]>;
  /** Funkcja pobierająca pojedynczy obiekt na podstawie jego ID (przydatne przy inicjalizacji z samym ID) */
  @Input() fetchByIdFn?: (id: any) => Observable<T | null>;
  
  /** Klucz obiektu lub funkcja formatująca obiekt do wyświetlenia (np. (item) => item.Name) */
  @Input() displayKey: keyof T | ((item: T) => string) = 'Name' as keyof T;
  /** Klucz obiektu lub funkcja wyciągająca wartość do zapisu w formularzu (np. (item) => item.ID) */
  @Input() valueKey: keyof T | ((item: T) => any) = 'ID' as keyof T;
  
  @Input() label: string = 'Wybierz';
  @Input() placeholder: string = 'Szukaj...';
  @Input() appearance: MatFormFieldAppearance = 'fill';

  searchControl = new FormControl<string | T | null>('');
  options = signal<T[]>([]);
  isLoading = signal(false);

  private destroy$ = new Subject<void>();
  private selectedValue: any = null;

  // CVA
  onChange: any = () => {};
  onTouched: any = () => {};
  isDisabled = false;

  get displayFn(): (item: T) => string {
    return typeof this.displayKey === 'function' ? this.displayKey : (item: T) => String(item[this.displayKey as keyof T] || '');
  }

  get valFn(): (item: T) => any {
    return typeof this.valueKey === 'function' ? this.valueKey : (item: T) => item[this.valueKey as keyof T];
  }

  ngOnInit() {
    // Inicjalne pobranie bez filtra po kliknięciu/focusie jest obsługiwane przez standardowe zachowanie lub można tu dodać switchMap
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((value) => {
          if (typeof value === 'object' && value !== null) {
            // Obiekt został wybrany
            this.selectedValue = this.valFn(value as T);
            this.onChange(this.selectedValue);
          } else if (typeof value === 'string') {
            // Użytkownik wpisuje tekst - czyścimy wybraną wartość jeśli wcześniej była wybrana
            if (this.selectedValue !== null) {
              this.selectedValue = null;
              this.onChange(null);
            }
          } else if (value === null) {
            this.selectedValue = null;
            this.onChange(null);
          }
        }),
        switchMap((value) => {
          const query = typeof value === 'string' ? value : '';
          this.isLoading.set(true);
          return this.fetchFn(query).pipe(
            catchError(() => of([])),
            tap(() => this.isLoading.set(false))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((results) => {
        this.options.set(results);
      });

    // Wstępne pobranie opcji (puste zapytanie)
    this.fetchFn('').pipe(takeUntil(this.destroy$)).subscribe(res => this.options.set(res));
  }

  displayWith = (option: T | null): string => {
    if (!option) return '';
    return this.displayFn(option);
  };

  onSelected(event: MatAutocompleteSelectedEvent) {
    // Obsłużone już w tap() w ramach valueChanges kontrolki
  }

  clearSelection(event: Event) {
    event.stopPropagation();
    this.searchControl.setValue(null);
    this.onChange(null);
    this.searchControl.markAsTouched();
    // Ponownie uderz i załaduj wszystkie rekordy po wyczyszczeniu
    // (odpalenie setValue(null) triggeruje valueChanges -> fetchFn(''))
  }

  onBlur() {
    this.onTouched();
    // Jeśli po opuszczeniu pola wpisany tekst to string (czyli nie zatwierdzono obiektu z listy), kasujemy wartość i tekst
    const val = this.searchControl.value;
    if (typeof val === 'string' && val.trim() !== '') {
      this.searchControl.setValue(null);
    }
  }

  // ==== CVA Methods ====
  writeValue(value: any): void {
    if (value === null || value === undefined || value === '') {
      this.searchControl.setValue(null, { emitEvent: false });
      this.selectedValue = null;
      return;
    }

    this.selectedValue = value;

    // Najpierw spróbuj znaleźć na aktualnej liście
    const found = this.options().find((opt) => this.valFn(opt) === value);
    if (found) {
      this.searchControl.setValue(found, { emitEvent: false });
    } else if (this.fetchByIdFn) {
      // Jeśli brak na liście i mamy metodę odpytującą po ID (np. edycja)
      this.isLoading.set(true);
      this.fetchByIdFn(value).subscribe({
        next: (item) => {
          if (item) {
            // Zapisz wartość by wyświetliła się nazwa, nie emituj onChanges
            this.searchControl.setValue(item, { emitEvent: false });
          }
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    } else {
      // Brak dostępu do pełnego obiektu, niestety Autocomplete w Angularze będzie pusty lub pokaże ID
      // To ograniczenie by design (potrzebujemy napisu). 
      // Jako workaround można zainicjować fake-obiekt jeśli znamy DisplayKey
      console.warn(`[FilterableSelect] Cannot display name for value ${value}. Provide fetchByIdFn.`);
      this.searchControl.setValue(null, { emitEvent: false }); 
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.searchControl.disable({ emitEvent: false });
    } else {
      this.searchControl.enable({ emitEvent: false });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
