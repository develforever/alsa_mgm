import { Injectable } from "@angular/core";
import { signal } from "@angular/core";
import { User } from "../../../shared/models/types";

@Injectable({ providedIn: 'root' })
export class StoreService {

    private _user = signal<User | null>(null);

    user = this._user.asReadonly();

    setUser(user: User) {
        this._user.set(user);
    }
}