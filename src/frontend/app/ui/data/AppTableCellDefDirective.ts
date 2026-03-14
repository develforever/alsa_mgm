import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appTableCellDef]'
})
export class AppTableCellDefDirective {
    // Przekazujemy tu nazwę kolumny, np. 'actions'
    @Input('appTableCellDef') columnName!: string;

    constructor(public template: TemplateRef<any>) { }
}
