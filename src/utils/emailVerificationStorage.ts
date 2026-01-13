const KEY = 'verify_email';

export function setVerifyEmail(email: string) {
  try {
    window.localStorage.setItem(KEY, email);
  } catch {

  }
}

export function getVerifyEmail(): string {
  try {
    return window.localStorage.getItem(KEY) ?? '';
  } catch {
    return '';
  }
}

export function clearVerifyEmail() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    
  }
}

