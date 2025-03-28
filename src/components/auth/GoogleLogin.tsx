
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GoogleLogin as ReactGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { User } from "lucide-react";

interface GoogleLoginProps {
  onLoginSuccess: (email: string) => void;
}

interface GoogleCredentialResponse {
  credential: string;
}

interface DecodedCredential {
  email: string;
  name: string;
  picture: string;
  exp: number;
  iat: number;
}

export function GoogleLogin({ onLoginSuccess }: GoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleGoogleLoginSuccess = async (credentialResponse: GoogleCredentialResponse) => {
    setIsLoading(true);
    
    try {
      // Decode the JWT token from Google
      const decoded = jwtDecode<DecodedCredential>(credentialResponse.credential);
      const userEmail = decoded.email;
      
      // Store the authenticated state in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userName", decoded.name || "");
      localStorage.setItem("userPicture", decoded.picture || "");
      
      toast.success("Successfully signed in with Google!");
      onLoginSuccess(userEmail);
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google sign in failed, enabling demo mode");
    setIsLoading(false);
    setIsDemoMode(true);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    
    // Create a demo user
    const demoEmail = `demo.user${Math.floor(Math.random() * 1000)}@example.com`;
    
    // Store the authenticated state in localStorage
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", demoEmail);
    localStorage.setItem("userName", "Demo User");
    localStorage.setItem("userPicture", "");
    
    toast.success("Demo mode activated. Logged in as Demo User.");
    onLoginSuccess(demoEmail);
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <Button
          disabled
          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded flex items-center justify-center space-x-2"
        >
          <div className="animate-spin h-5 w-5 border-b-2 border-gray-800 rounded-full"></div>
        </Button>
      ) : isDemoMode ? (
        <Button
          onClick={handleDemoLogin}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded flex items-center justify-center space-x-2"
        >
          <User className="h-5 w-5" />
          <span>Continue with Demo Account</span>
        </Button>
      ) : (
        <div className="flex justify-center items-center w-full">
          <ReactGoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            useOneTap
            theme="filled_blue"
            text="signin_with"
            shape="rectangular"
            type="standard"
            logo_alignment="left"
            width="100%"
          />
        </div>
      )}
    </div>
  );
}
