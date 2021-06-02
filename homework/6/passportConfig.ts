import passport from 'passport';
import passportJWT from 'passport-jwt'
import './config'

const { SECRET, AUDIENCE, ISSUER } = process.env;

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
    issuer: ISSUER,
    audience: AUDIENCE
};

const stategy = new JwtStrategy(jwtOptions, async (token, done) => {
    done(null, {});
});

passport.use('jwt', stategy);

export default passport;