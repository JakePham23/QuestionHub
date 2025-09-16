import axios from "@/utils/axios.customize";
const version  = '/api'

interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

const authService = {
  async signup(payload: SignupPayload) {
    const url = `${ version}/auth/signup`;
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" ,
        'ngrok-skip-browser-warning': 'true',},
      
    });
    return response.data;
  },

  async requestPasswordReset(email: string) {
    const url = `${ version}/auth/forgot-password`;
    const response = await axios.post(
      url,
      { email },
      { headers: { "Content-Type": "application/json" ,
        'ngrok-skip-browser-warning': 'true',} }
    );
    return response.data;
  },

  async verifyOTP(email: string, otp: string) {
    const url = `${ version}/auth/verify-otp`;
    const response = await axios.post(
      url,
      { email, otp },
      { headers: { "Content-Type": "application/json" ,
        'ngrok-skip-browser-warning': 'true',} }
    );
    return response.data;
  },

  async resetPassword(payload: ResetPasswordPayload) {
    const url = `${ version}/auth/reset-password`;
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" ,
        'ngrok-skip-browser-warning': 'true',},
    });
    return response.data;
  },

  async resendOTP(email: string) {
    const url = `${ version}/auth/resend-otp`;
    const response = await axios.post(
      url,
      { email },
      { headers: { "Content-Type": "application/json" ,
        'ngrok-skip-browser-warning': 'true',} }
    );
    return response.data;
  },

  // Login with GG
  async googleSignIn(idToken: string) {
    console.log("🔍 DEBUG: Google Sign-In ID Token:", idToken);
    const url = `${ version}/auth/google/signin`;
    try {
      const response = await axios.post(
        url,
        { idToken },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      console.log("✅ DEBUG: Backend response received:", response.data);
      return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ DEBUG: Backend request failed:", error);
      console.error("❌ DEBUG: Error response:", error.response?.data);
      throw error;
    }
  },
  async refreshToken(refreshToken: string) {
    const url = `${ version}/auth/refresh-token`;
    const response = await axios.post(
      url,
      { refreshToken },
      { headers: { "Content-Type": "application/json" ,
        'ngrok-skip-browser-warning': 'true',} }
    );
    return response.data;
  },
  async getCurrentUser() {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    const url = `${ version}/auth/me`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true',
      },
    });
    return response.data;
  },
  // Logout
  async logout() {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const url = `${ version}/auth/logout`;
        await axios.post(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              'ngrok-skip-browser-warning': 'true',
            },
          }
        );
      } catch (error) {
        console.error("Logout API error:", error);
      }
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
  },
};

export default authService;
