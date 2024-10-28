import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'

export enum UserRole {
  ADMIN = 'admin',
  FUNCIONARIO = 'func',
  PROFISSIONAL = 'prof'
}
// type UserRole = 'admin' | 'func' | 'prof'
type AuthenticatedPayload = {
  id: string
  email: string
  role: UserRole
  isActive: true
  iat: number
  exp: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // @Inject()
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }
  public validate = (payload: AuthenticatedPayload) => payload
}