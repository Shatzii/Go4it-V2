export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function getTokenFromStorage(): string | null {
  return localStorage.getItem("auth_token");
}

export function setTokenInStorage(token: string): void {
  localStorage.setItem("auth_token", token);
}

export function removeTokenFromStorage(): void {
  localStorage.removeItem("auth_token");
}

export function formatUserRole(role: string): string {
  const roleMap = {
    student: "Student Athlete",
    coach: "Coach",
    parent: "Parent",
  };
  return roleMap[role as keyof typeof roleMap] || role;
}
