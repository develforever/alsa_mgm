import { Injectable } from "@angular/core";
import { signal } from "@angular/core";
import { User } from "../../../shared/models/types";

@Injectable({ providedIn: 'root' })
export class AppStoreService {

    private _user = signal<User | null>(null);
    private _code = signal<string | null>(null);

    user = this._user.asReadonly();
    code = this._code.asReadonly();

    setUser(user: User) {
        this._user.set(user);
    }

    setCode(code: string) {
        this._code.set(code);
    }
}