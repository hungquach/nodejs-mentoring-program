import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

export default class JwtService {
    async generateJwtToken(payload) {
        const { SECRET, AUDIENCE, ISSUER } = process.env;

        return await jwt.sign(payload, SECRET || "", {
            expiresIn: '1d',
            audience: AUDIENCE,
            issuer: ISSUER,
            jwtid: uuidv4(),
            subject: payload.id || ""
        });
    }
}