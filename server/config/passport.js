import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy } from "passport-google-oauth20";

const configurePassport = (User) => {
  passport.use(
    new Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // Create a new user if the user doesn't exist
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("222", salt);
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              isVerified: true,
              role: "user",
              password: hashedPassword,
            });
          }
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  // Serialize user into the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
export default configurePassport;
