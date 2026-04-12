
## Opis

użytkownik klikając w dowolny element w aplikacji powinien mieć możliwość wyświetlenia kontekstowego menu z opcjami dostępnymi dla danego elementu. Elementy tego menu powinny być generowane na podstawie kontekstu przez serwis. Serwis generujący menu powinien być niezależny od komponentów aplikacji. Akcje wykonywane po wybraniu opcji z menu powinny być obsługiwane przez komponenty aplikacji. Akcje powinny być definiowane w serwisie generującym menu. Każdy komponent aplikacji może zarejestrować własne akcje w menu. Użytkownik może tworzyć własne menu kontekstowe wybierając opcję "Dodaj własne menu" w menu kontekstowym. Menu kontektowe bazuje na material menu i material toolbar z angulara. 


## Wytyczne do implementacji 

2. Implementacja Techniczna (Angular 21 style)
Krok 1: Serwis jako "Event Bus"
Dodajemy do serwisu Subject, który będzie emitował zdarzenia o kliknięciu.

TypeScript
@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  // Strumień zdarzeń - przesyła ID klikniętej akcji
  private actionTrigger = new Subject<string>();
  
  // Observable, który komponenty będą subskrybować
  actionTriggered$ = this.actionTrigger.asObservable();

  // Metoda wywoływana przez UI menu kontekstowego
  dispatch(actionId: string) {
    this.actionTrigger.next(actionId);
  }
}
Krok 2: Komponent jako "Słuchacz"
Komponent subskrybuje strumień, ale reaguje tylko wtedy, gdy ID akcji pasuje do jego kompetencji. W Angular 21 używamy takeUntilDestroyed, aby uniknąć wycieków pamięci.

TypeScript
@Component({ ... })
export class UserListComponent {
  private contextService = inject(ContextMenuService);
  private destroyRef = inject(DestroyRef);

  // Lokalny stan, do którego serwis nie ma bezpośredniego dostępu
  private myLocalVariable = "Dane użytkownika X";

  constructor() {
    this.contextService.actionTriggered$
      .pipe(takeUntilDestroyed(this.destroyRef)) // Automatyczne odpięcie przy zniszczeniu komponentu
      .subscribe(actionId => {
        if (actionId === 'edit-user') {
          this.executeEdit();
        }
      });
  }

  executeEdit() {
    console.log('Wykonuję logikę z użyciem:', this.myLocalVariable);
    // Tutaj masz dostęp do pełnego "this" komponentu
  }
}
3. Rozwiązanie problemu "Kto ma odpowiedzieć?"
Pojawia się pytanie: co jeśli mam dwa komponenty na ekranie i oba nasłuchują na edit-user? Oba wykonają akcję. Aby temu zapobiec, stosuje się Scope (Zakres).

Ulepszony model zdarzenia:
Zamiast wysyłać samo string, wysyłamy obiekt z kontekstem:

TypeScript
interface ActionEvent {
  id: string;
  scope?: string; // np. ID konkretnego wiersza lub nazwa modułu
}
W komponencie sprawdzasz nie tylko id, ale też czy scope dotyczy Ciebie:

TypeScript
this.contextService.actionTriggered$.subscribe(event => {
  if (event.id === 'edit-user' && event.scope === this.currentUserId) {
    this.executeEdit();
  }
});
Dlaczego to jest lepsze niż tradycyjne podejście?
Leniwe ładowanie (Lazy Loading): Serwis zna nazwę akcji "Raport Finansowy", zanim moduł finansowy zostanie pobrany. Gdy użytkownik kliknie tę akcję, a moduł finansowy się załaduje i zainicjuje komponent, on "w locie" zacznie słuchać na to zdarzenie.

Brak cykli komponentów: Nie musisz przekazywać serwisu przez 5 poziomów komponentów (Prop Drilling). Komponent po prostu "wpina się" w globalną szynę zdarzeń.

Testowalność: Możesz testować serwis menu w całkowitej izolacji od komponentów, sprawdzając tylko, czy poprawnie emituje ID akcji po kliknięciu.

[!TIP]
W bardzo dużej skali, zamiast Subject, możesz użyć wzorca Command Pattern, gdzie każda akcja jest osobną klasą, ale dla większości aplikacji Angularowych Subject w serwisie w zupełności wystarczy i jest najbardziej czytelny.

Czy ten mechanizm "szyny zdarzeń" (Event Bus) w połączeniu z DI jest dla Ciebie jasny, czy pokazać jak to połączyć z konkretnym UI (np. biblioteką Angular Material)?