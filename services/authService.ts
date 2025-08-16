import { AuthUser, User } from '@/types';

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  confirmPassword: string;
}

class AuthService {
  private baseURL = 'https://api.stud.io-ai.com'; // API URL'inizi buraya ekleyin

  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik mock response döndürüyoruz
      const mockUser: AuthUser = {
        id: '1',
        email: credentials.email,
        displayName: 'Test User',
        photoURL: undefined,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token';

      return {
        user: mockUser,
        token: mockToken,
      };
    } catch (error) {
      throw new Error('Giriş yapılırken bir hata oluştu');
    }
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik mock response döndürüyoruz
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        displayName: credentials.displayName,
        photoURL: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock-jwt-token';

      return {
        user: mockUser as unknown as AuthUser,
        token: mockToken,
      };
    } catch (error) {
      throw new Error('Kayıt olurken bir hata oluştu');
    }
  }

  async signOut(): Promise<void> {
    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik sadece başarılı döndürüyoruz
      return Promise.resolve();
    } catch (error) {
      throw new Error('Çıkış yapılırken bir hata oluştu');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik sadece başarılı döndürüyoruz
      return Promise.resolve();
    } catch (error) {
      throw new Error('Şifre sıfırlama e-postası gönderilirken bir hata oluştu');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik sadece başarılı döndürüyoruz
      return Promise.resolve();
    } catch (error) {
      throw new Error('Şifre sıfırlanırken bir hata oluştu');
    }
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik mock response döndürüyoruz
      const mockUser: User = {
        id: userId,
        email: 'test@example.com',
        displayName: updates.displayName || 'Test User',
        photoURL: updates.photoURL || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return mockUser;
    } catch (error) {
      throw new Error('Profil güncellenirken bir hata oluştu');
    }
  }

  async deleteAccount(userId: string): Promise<void> {
    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik sadece başarılı döndürüyoruz
      return Promise.resolve();
    } catch (error) {
      throw new Error('Hesap silinirken bir hata oluştu');
    }
  }

  getCurrentAuthUser(): AuthUser | null {
    // Bu fonksiyon Redux store'dan mevcut kullanıcıyı almalı
    // Şimdilik null döndürüyoruz, gerçek implementasyonda
    // Redux store'a erişim gerekli olacak
    return null;
  }
}

export const authService = new AuthService();
