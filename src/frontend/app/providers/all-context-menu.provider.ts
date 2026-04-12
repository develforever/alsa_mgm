import { Provider } from "@angular/core";
import { provideAuditLogMenu } from "../feature/home/components/audit-log/audit-log-menu.config";



export const provideAllContextMenuProviders: Provider[] = [
    provideAuditLogMenu
];
