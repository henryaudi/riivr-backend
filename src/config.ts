import dotenv from 'dotenv';
import bunyan from 'bunyan';
import cloudinary from 'cloudinary';

dotenv.config({});

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRETE_KEY_ONE: string | undefined;
  public SECRETE_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_HOST: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_API_SECRET: string | undefined;
  public SENDER_EMAIL: string | undefined;
  public SENDER_EMAIL_PASSWORD: string | undefined;
  public SENDGRID_API_KEY: string | undefined;
  public SENDGRID_SENDER: string | undefined;
  public EC2_URL: string | undefined;

  private readonly DEFAULT_DB_URL = 'mongodb://localhost:27017/riivr-backend';
  private readonly DEFAULT_JWT_TOKEN = 'your-default-jwt-token';
  private readonly DEFAULT_NODE_ENV = 'development';
  private readonly DEFAULT_SECRETE_KEY_ONE = 'your-default-secret-key-one';
  private readonly DEFAULT_SECRETE_KEY_TWO = 'your-default-secret-key-two';
  private readonly DEFAULT_CLIENT_URL = 'http://localhost:3000';
  private readonly DEFAULT_REDIS_HOST = 'http://localhost:6379';

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DB_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || this.DEFAULT_JWT_TOKEN;
    this.NODE_ENV = process.env.NODE_ENV || this.DEFAULT_NODE_ENV;
    this.SECRETE_KEY_ONE = process.env.SECRETE_KEY_ONE || this.DEFAULT_SECRETE_KEY_ONE;
    this.SECRETE_KEY_TWO = process.env.SECRETE_KEY_TWO || this.DEFAULT_SECRETE_KEY_TWO;
    this.CLIENT_URL = process.env.CLIENT_URL || this.DEFAULT_CLIENT_URL;
    this.REDIS_HOST = process.env.REDIS_HOST || this.DEFAULT_REDIS_HOST;
    this.CLOUD_NAME = process.env.CLOUD_NAME || '';
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
    this.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
    this.SENDGRID_SENDER = process.env.SENDGRID_SENDER || '';
    this.EC2_URL = process.env.EC2_URL || '';
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }

  public validateConfig(): void {
    for (const [key, val] of Object.entries(this)) {
      if (val === undefined) {
        throw new Error(`Configuration error - missing env var: ${key}`);
      }
    }
  }

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET
    });
  }
}

export const config: Config = new Config();
