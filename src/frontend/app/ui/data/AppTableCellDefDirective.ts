import { Directive, inject, Input, TemplateRef } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appTableCellDef]'
})
export class AppTableCellDefDirective {
    @Input('appTableCellDef') columnName!: string;

    public template = inject(TemplateRef<any>);
}
