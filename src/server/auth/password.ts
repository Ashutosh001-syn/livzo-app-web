import bcrypt from "bcrypt";

/** Server-only password service contract. */
export interface PasswordService {
  hash(password: string): Promise<string>;
  verify(hash: string, password: string): Promise<boolean>;
}

export class BcryptPasswordService implements PasswordService {
  constructor(private readonly saltRounds = 12) {}

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async verify(hash: string, password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch {
      return false;
    }
  }
}

export const defaultPasswordService: PasswordService = new BcryptPasswordService();

