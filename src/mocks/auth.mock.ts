import { AuthPayload, IAuthDocument } from '@auth/interfaces/auth.interface';
import { config } from '@root/config';
import { Response } from 'express';

/**
 * Creates a lightweight mock for Express requests in controller tests.
 *
 * @param sessionData - Serialized session object placed on `req.session`.
 * @param body - Request payload used for a specific test case.
 * @param currentUser - Optional authenticated user attached to the request.
 * @param params - Optional route parameters exposed via `req.params`.
 * @returns Minimal subset of the Express request used by controllers under test.
 *
 * Usage:
 * ```ts
 * const req = authMockRequest({ jwt: 'token' }, { email: 'test@example.com' }, mockUser, { id: '123' });
 * controllerMethod(req as Request, res as Response);
 * ```
 */
export const authMockRequest = (
  sessionData: IJWT,
  body: IAuthMock,
  currentUser?: AuthPayload | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any
) => ({
  session: sessionData,
  body,
  currentUser,
  params
});

export const authMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export interface IJWT {
  jwt?: string;
}

export interface IAuthMock {
  _id?: string;
  username?: string;
  email?: string;
  uId?: string;
  password?: string;
  avartarColor?: string;
  avartarImage?: string;
  createdAt?: Date | string;
}

export interface IAuthMock {
  _id?: string;
  username?: string;
  email?: string;
  uId?: string;
  password?: string;
  avatarColor?: string;
  avatarImage?: string;
  createdAt?: Date | string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  quote?: string;
  work?: string;
  school?: string;
  location?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  messages?: boolean;
  reactions?: boolean;
  comments?: boolean;
  follows?: boolean;
}

export const authUserPayload: AuthPayload = {
  userId: '60263f14648fed5246e322d9',
  uId: '1621613119252066',
  username: 'Manny',
  email: 'manny@me.com',
  avatarColor: '#9c27b0',
  iat: 12345
};

export const authMock = {
  _id: '60263f14648fed5246e322d3',
  uId: '1621613119252066',
  username: 'Manny',
  email: 'manny@me.com',
  avatarColor: '#9c27b0',
  createdAt: '2022-08-31T07:42:24.451Z',
  save: () => {},
  comparePassword: () => false
} as unknown as IAuthDocument;

// Create a signUpMockData
export const signUpMockData = {
  _id: '605727cd646eb50e668a4e13',
  uId: '92241664235577172',
  username: 'Manny',
  email: 'manny@test.com',
  avatarColor: '#ff9800',
  password: 'manny1',
  birthDay: { month: '', day: '' },
  postsCount: 0,
  gender: '',
  quotes: '',
  about: '',
  relationship: '',
  blocked: [],
  blockedBy: [],
  bgImageVersion: '',
  bgImageId: '',
  work: [],
  school: [],
  placesLived: [],
  createdAt: new Date(),
  followersCount: 0,
  followingCount: 0,
  notifications: { messages: true, reactions: true, comments: true, follows: true },
  profilePicture: `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v1763094838/6916b135baadb31ad19c8f1e.png`
};
