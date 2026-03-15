import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface YesNoDialogData {
    title?: string;
    content?: string;
}

@Component({
    selector: 'app-ui-dialog-yes-no',
    templateUrl: './yes-no.dialog.component.html',
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppUiDialogYesNoComponent {

    readonly data = inject<YesNoDialogData>(MAT_DIALOG_DATA);
    readonly dialogRef = inject(MatDialogRef<AppUiDialogYesNoComponent>);

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onYesClick(): void {
        this.dialogRef.close(true);
    }
}