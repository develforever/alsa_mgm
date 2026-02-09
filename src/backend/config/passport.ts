import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import config from './config';

const clientID = config.GITHUB_CLIENT_ID;
const clientSecret = config.GITHUB_CLIENT_SECRET;

if (!clientID || !clientSecret) {
    console.error("❌ BŁĄD: Brak GITHUB_CLIENT_ID lub GITHUB_CLIENT_SECRET w pliku .env");
}

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

passport.use('github', new GitHubStrategy({
  clientID,
  clientSecret,
  callbackURL: `${config.BASE_URL}/api/auth/github/callback`
},
  (accessToken: string, refreshToken: string, profile: any, done: any) => {

    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : profile.username;
    profile.userEmail = email; 

    return done(null, profile);
  }
));