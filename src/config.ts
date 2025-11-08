import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRETE_KEY_ONE: string | undefined;
  public SECRETE_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;

  private readonly DEFAULT_DB_URL = 'mongodb://localhost:27017/riivr-backend';
  private readonly DEFAULT_JWT_TOKEN = 'your-default-jwt-token';
  private readonly DEFAULT_NODE_ENV = 'development';
  private readonly DEFAULT_SECRETE_KEY_ONE = 'your-default-secret-key-one';
  private readonly DEFAULT_SECRETE_KEY_TWO = 'your-default-secret-key-two';
  private readonly DEFAULT_CLIENT_URL = 'http://localhost:3000';

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DB_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || this.DEFAULT_JWT_TOKEN;
    this.NODE_ENV = process.env.NODE_ENV || this.DEFAULT_NODE_ENV;
    this.SECRETE_KEY_ONE = process.env.SECRETE_KEY_ONE || this.DEFAULT_SECRETE_KEY_ONE;
    this.SECRETE_KEY_TWO = process.env.SECRETE_KEY_TWO || this.DEFAULT_SECRETE_KEY_TWO;
    this.CLIENT_URL = process.env.CLIENT_URL || this.DEFAULT_CLIENT_URL;
  }

  public validateConfig(): void {
    for (const [key, val] of Object.entries(this)) {
      if (val === undefined) {
        throw new Error(`Configuration error - missing env var: ${key}`);
      }
    }
  }
};

export const config: Config = new Config();