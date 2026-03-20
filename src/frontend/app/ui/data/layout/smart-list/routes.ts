import { AddComponent } from "./add.component";
import { EditComponent } from "./edit.component";
import { ViewComponent } from "./view.component";



export function createSidebarRoutes() {
    return [{
        path: "selected/:id",
        component: ViewComponent,
        title: "List",
        outlet: "sidebar"
    },
    {
        path: "add",
        component: AddComponent,
        title: "Add",
        outlet: "sidebar"
    },
    {
        path: "edit/:id",
        component: EditComponent,
        title: "Edit",
        outlet: "sidebar"
    },]
}