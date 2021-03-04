import { AuthChecker } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { Hero } from './entities/hero';

import { Context } from './interfaces/context.interface';
const JWT_SIGNING_SECRET = process.env.JWT_SIGNING_SECRET;

// create auth checker function
export const authChecker: AuthChecker<Context> = async ({ context: { token } }, roles) => {
  
    const heroRepository = getRepository(Hero);

    try {
        // verify the JWT
        let verification = verify(token, JWT_SIGNING_SECRET) as { userId: string };
        
        // find the hero with corresponding ID
        const hero = await heroRepository.findOne(verification.userId);
    
        // return true if hero's role has access, false if not
        return roles.includes(hero.role);
    } catch {
        // if verification fails
        return false;
    }

};