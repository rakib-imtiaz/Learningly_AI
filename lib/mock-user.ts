// Mock user data for development until authentication is implemented
export const MOCK_USER = {
  id: "mock-user-id",
  email: "demo@example.com",
  username: "demo_user",
  full_name: "Demo User",
  role: "student",
};

// Function to get mock user ID
export function getMockUserId(): string {
  return MOCK_USER.id;
}

// Function to get mock user details
export function getMockUser() {
  return MOCK_USER;
}
