import { Controller, Get, Route, Tags, Request, SuccessResponse } from "tsoa";
import { Request as ExRequest } from "express";
import passport from "passport";
import config from "../../config/config";
import { User } from "@shared/models/types";

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
      passport.authenticate('github', { scope: ['user:email'] })(request, request.res!, (err: unknown) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  /**
   * Mock logowania dla celów deweloperskich.
   * Dostępny tylko gdy NODE_ENV !== 'production'.
   */
  @Get("dev-login")
  public async devLogin(@Request() request: ExRequest): Promise<void> {
    if (config.nodeEnv === 'production') {
      this.setStatus(403);
      throw new Error("Dev login is not allowed in production");
    }

    const mockUser: User = {
      id: 999,
      username: 'dev_hero',
      displayName: 'Developer Hero',
      userEmail: 'dev@alsa.local',
      userAvatar: 'https://ui-avatars.com/api/?name=Dev+Hero&background=0D8ABC&color=fff',
      provider: 'mock',
      email: 'dev@alsa.local',
      role: 'admin',
      nodeId: '1',
      profileUrl: 'https://ui-avatars.com/api/?name=Dev+Hero&background=0D8ABC&color=fff',
      photos: [
        {
          value: 'https://ui-avatars.com/api/?name=Dev+Hero&background=0D8ABC&color=fff'
        }
      ],
      accessToken: 'mock_access_token',
    };

    return new Promise((resolve, reject) => {
      request.login(mockUser, (err) => {
        if (err) return reject(err);
        const res = request.res!;
        res.redirect(`/?auth_code=mock_dev_code`);
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
      })(request, res, (err: unknown) => {
        if (err) return reject(err);
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
  public async authStatus(@Request() request: ExRequest): Promise<{ isAuthenticated: boolean; user: unknown }> {
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