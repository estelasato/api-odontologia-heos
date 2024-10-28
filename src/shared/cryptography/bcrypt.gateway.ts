import { hash, genSalt, compare } from 'bcrypt'
import { CompareInput, CompareOutput, EncryptInput, EncryptOutput, ICryptographyProvider } from './ICryptographyProvider'


export class BCryptGateway implements ICryptographyProvider {
  public async encrypt({ password }: EncryptInput): Promise<EncryptOutput> {
    return hash(password, await genSalt())
  }
  public async compare({ password, hash }: CompareInput): Promise<CompareOutput> {
    return compare(password, hash)
  }
}
