export type CompareInput = {
  password: string
  hash: string
}
export type CompareOutput = boolean

export type EncryptInput = {
  password: string
}

export type EncryptOutput = string

export abstract class ICryptographyProvider {
  abstract encrypt(data: EncryptInput): Promise<EncryptOutput>
  abstract compare(data: CompareInput): Promise<CompareOutput>
}
