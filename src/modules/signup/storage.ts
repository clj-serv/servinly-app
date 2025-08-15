export interface SignupUser {
  firstName: string;
  lastName: string;
  email: string;
}

const SIGNUP_USER_KEY = "signup_user";

export function saveSignupUser(user: SignupUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SIGNUP_USER_KEY, JSON.stringify(user));
  }
}

export function loadSignupUser(): SignupUser | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(SIGNUP_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}

export function clearSignupUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SIGNUP_USER_KEY);
  }
}
