---
trigger: always_on
---

---
name: web-dev-standards
description: Standardy dla Node.js, TypeScript i Angular. Stosuj przy tworzeniu komponentów, serwisów i logiki backendowej.
activation: always-on
---

# 🛠 Standardy Techniczne

## 🟢 Node.js & TypeScript
- **Strict Mode**: Zawsze używaj `strict: true` w tsconfig.
- **Typowanie**: Unikaj typu `any`. Każda funkcja musi mieć zdefiniowane typy argumentów i zwracanej wartości.
- **Asynchroniczność**: Preferuj `async/await` zamiast surowych Promise lub callbacków.
- **Obsługa błędów**: Każdy endpoint/logika musi posiadać blok `try-catch` z ustrukturyzowanym logowaniem błędów.

## 🅰️ Angular (Frontend)
- **Standalone Components**: Twórz komponenty jako `standalone: true` (Angular 14+).
- **OnPush**: Zawsze stosuj `changeDetection: ChangeDetectionStrategy.OnPush`.
- **RxJS**: 
  - Używaj `pipe()` i operatorów (np. `switchMap`, `catchError`).
  - Unikaj ręcznych subskrypcji (`.subscribe()`) w komponentach; preferuj `| async` w szablonach.
- **Nazywanie**: Komponenty: `name.component.ts`, Serwisy: `name.service.ts`.

## 📦 Struktura Projektu
- **Clean Architecture**: Oddzielaj logikę biznesową od frameworka.
- **Importy**: Używaj ścieżek absolutnych zdefiniowanych w aliasach (np. `@app/...`, `@env/...`).

## 🧪 Testowanie
- **Unit Tests**: Każdy nowy serwis/komponent musi posiadać plik `.spec.ts`.
- **Mocks**: Używaj mocków dla zewnętrznych API i baz danych.
