export function assertPassword(password: string) {
  if (password.length < 10) {
    throw new Error("Password must be at least 10 characters.");
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    throw new Error("Password must include upper, lower, and numeric characters.");
  }
}
