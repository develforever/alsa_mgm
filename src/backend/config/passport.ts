import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import config from './config';
import { AppDataSource } from './data-source';
import { User, UserRole } from '../entity/User';

const clientID = config.GITHUB_CLIENT_ID;
const clientSecret = config.GITHUB_CLIENT_SECRET;

if (!clientID || !clientSecret) {
  console.error("❌ BŁĄD: Brak GITHUB_CLIENT_ID lub GITHUB_CLIENT_SECRET w pliku .env");
}

const userRepo = AppDataSource.getRepository(User);

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

passport.use('github', new GitHubStrategy({
  clientID,
  clientSecret,
  callbackURL: `${config.BASE_URL}/api/auth/github/callback`
},
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : profile.username;
      const githubId = profile.id;
      
      // Find or create user in database
      let user = await userRepo.findOne({ where: { githubId: String(githubId) } });
      
      if (!user) {
        // Create new user
        user = userRepo.create({
          githubId: String(githubId),
          username: profile.username,
          displayName: profile.displayName || profile.username,
          email: email,
          avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
          role: UserRole.Viewer, // Default role
          isActive: true,
          lastLoginAt: new Date()
        });
        
        // If this is the first user ever, make them admin
        const userCount = await userRepo.count();
        if (userCount === 0) {
          user.role = UserRole.Admin;
        }
        
        await userRepo.save(user);
      } else {
        // Update last login
        user.lastLoginAt = new Date();
        await userRepo.save(user);
      }
      
      // Add user data to profile
      profile.userEmail = email;
      profile.userAvatar = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
      profile.dbUser = user; // Include DB user info

      return done(null, profile);
    } catch (error) {
      console.error('Error during GitHub authentication:', error);
      return done(error, false);
    }
  }
));

export default passport;