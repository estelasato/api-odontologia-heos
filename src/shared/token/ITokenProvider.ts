import { JwtPayload } from 'jsonwebtoken'
import { UserRole } from '../strategies/jwt.strategy'

export type SingInput = {
  jwtSecret: string
  jwtExpiresIn?: string
  id?: string
  email: string
  nome?: string
  role?: UserRole
}

export type DecodeInput = {
  jwtSecret: string
  token: string
}

export interface DecodeOutput extends JwtPayload {
  id: string | number
  email: string
  role: UserRole
  isActive: true
}

export abstract class ITokenProvider {
  abstract sign(data: SingInput): Promise<string>
  abstract decode(data: DecodeInput): Promise<DecodeOutput>
}
