import { Controller, Get, Route, Tags, Request, SuccessResponse, Res, TsoaResponse } from "tsoa";
import { Request as ExRequest } from "express";
import passport from "passport";
import config from "../../config/config";

@Route("api/auth")
@Tags("Authentication")
export class AuthController extends Controller {

  /**
   * Inicjuje logowanie przez GitHub.
   * Redirects do GitHub OAuth.
   */
  @Get("github")
  public async authGithub(@Request() request: ExRequest): Promise<void> {
    // Passport zajmuje się przekierowaniem, więc tsoa tylko inicjuje proces
    return new Promise((resolve, reject) => {
      passport.authenticate('github', { scope: ['user:email'] })(request, request.res!, (err: any) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  /**
   * Callback z GitHub po zalogowaniu.
   */
  @Get("github/callback")
  public async authGithubCallback(@Request() request: ExRequest): Promise<void> {
    const res = request.res!;

    return new Promise((resolve, reject) => {
      passport.authenticate('github', {
        failureRedirect: `${config.BASE_URL}/login`
      })(request, res, () => {
        // Po udanym uwierzytelnieniu przekierowujemy na frontend z kodem
        const authCode = request.query['code'];
        res.redirect(`${config.BASE_URL}/?auth_code=${authCode}`);
        resolve();
      });
    });
  }

  /**
   * Sprawdza status zalogowania użytkownika.
   */
  @Get("status")
  public async authStatus(@Request() request: ExRequest): Promise<{ isAuthenticated: boolean; user: any }> {
    return {
      isAuthenticated: request.isAuthenticated(),
      user: request.user
    };
  }

  /**
   * Wylogowuje użytkownika i niszczy sesję.
   */
  @Get("logout")
  @SuccessResponse("200", "Logged out")
  public async authLogout(@Request() request: ExRequest): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      request.logout((err) => {
        if (err) return reject(err);

        request.session.destroy(() => {
          if (request.res) {
            request.res.clearCookie('connect.sid');
          }
          resolve({ message: 'Logged out successfully' });
        });
      });
    });
  }
}