import React, { useState, useEffect, useCallback } from "react";
// import { message } from "antd";
import authService from "@/services/auth.service";
import { useNotify } from '@/providers/NotificationProvider';


declare global {
  interface Window {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}
interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  createdAt: string;
}

// Google Sign-In Hook
const useGoogleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isPrompting, setIsPrompting] = useState<boolean>(false);
  const { message } = useNotify();
  // Handle Google credential response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCredentialResponse = async (response: any) => {
    console.log("🔍 DEBUG: handleCredentialResponse called with:", response);

    if (!response || !response.credential) {
      console.error("❌ DEBUG: No credential received from Google");
      setError("No credential received from Google");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsPrompting(false);

      console.log(
        "🔍 DEBUG: Calling authService.googleSignIn with credential length:",
        response.credential.length
      );
      const result = await authService.googleSignIn(response.credential);
      console.log("✅ DEBUG: Google Sign-In Response:", result);

      if (result.success && result.data) {
        setUser(result.data.user);
        // Store tokens
        localStorage.setItem("authToken", result.data.authToken);
        localStorage.setItem("refreshToken", result.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        setIsAuthenticated(true);
        message.success("Đăng nhập Google thành công");
      } else {
        setError(result.message || "Sign-in failed");
      }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ DEBUG: Error in handleCredentialResponse:", err);
      console.error("❌ DEBUG: Error response:", err.response?.data);
      setError(err.response?.data?.message || "Sign-in failed");
    } finally {
      setLoading(false);
      setIsPrompting(false); // Ensure prompting state is reset
    }
  };

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleCredentialResponse,
          auto_select: false,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-container"),
          { theme: "outline", size: "large", text: "continue_with" }
        );
      }
    };
    // Load Google Sign-In script
    const loadGoogleScript = () => {
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("DEBUG: Google script loaded successfully");
        setTimeout(() => {
          initializeGoogleSignIn();
        }, 100);
      };
      script.onerror = (error) => {
        console.error("DEBUG: Failed to load Google script:", error);
        setError("Failed to load Google Sign-In library");
      };
      document.head.appendChild(script);
    };

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    if (existingScript) {
      console.log(" DEBUG: Google script already exists, initializing...");

      setTimeout(() => {
        initializeGoogleSignIn();
      }, 100);
    } else {
      loadGoogleScript();
    }
    return () => {
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id &&
        !isPrompting
      ) {
        try {
          window.google.accounts.id.cancel();
        } catch (error) {
          console.log("Cleanup error:", error);
        }
      }
    };
  }, []);

  const signInWithGoogle = useCallback(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      setError(null);
      setIsPrompting(true);
      console.log("✅ DEBUG: Prompting Google Sign-In...");

      try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.error(
              " DEBUG: Google Sign-In not displayed:",
              notification.getNotDisplayedReason()
            );
            setError(
              `Google Sign-In not displayed: ${notification.getNotDisplayedReason()}`
            );
          } else {
            console.log(" DEBUG: Google Sign-In prompt successful");
          }
          setIsPrompting(false);
        });
      } catch (error) {
        console.error("DEBUG: Error prompting Google Sign-In:", error);
        setError("Failed to show Google Sign-In prompt");
        setIsPrompting(false);
      }
    } else {
      const errorMsg =
        "Google Sign-In not loaded. Please refresh and try again.";
      console.error(" DEBUG:", errorMsg);
      setError(errorMsg);
      message.error(errorMsg);
    }
  }, [loading]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isPrompting,
    signInWithGoogle,
  };
};
export default useGoogleAuth;
