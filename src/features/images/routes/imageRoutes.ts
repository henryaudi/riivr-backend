import { Password } from '@auth/controllers/password';
import { SignIn } from '@auth/controllers/signin';
import { SignOut } from '@auth/controllers/signout';
import { Signup } from '@auth/controllers/signup';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Add } from '@image/controllers/add-image';
import express, { Router } from 'express';

class ImageRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/images/profile', authMiddleware.checkAuthentication, Add.prototype.profileImage);
    this.router.post('/images/background', authMiddleware.checkAuthentication, Add.prototype.backgroundImage);

    return this.router;
  }
}

export const imageRoutes: ImageRoutes = new ImageRoutes();
