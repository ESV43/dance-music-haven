
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GoogleLogin as ReactGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  const { login } = useAuth();
  
  useEffect(() => {
    // Check if Google client ID is properly configured
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    console.log("Google Client ID configured:", !!clientId);
    if (!clientId || clientId === "demo-mode-client-id") {
      console.log("Using demo mode due to missing Google Client ID");
      setIsDemoMode(true);
    }
  }, []);

  const handleGoogleLoginSuccess = async (credentialResponse: GoogleCredentialResponse) => {
    setIsLoading(true);
    console.log("Google login success, processing credential...");
    
    try {
      // Decode the JWT token from Google
      const decoded = jwtDecode<DecodedCredential>(credentialResponse.credential);
      console.log("Decoded credential:", decoded.email);
      
      const userEmail = decoded.email;
      const userName = decoded.name || "";
      const userPicture = decoded.picture || "";
      
      // Use the auth context login method
      login(userEmail, userName, userPicture);
      
      toast.success("Successfully signed in with Google!");
      onLoginSuccess(userEmail);
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
      setIsDemoMode(true);
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
    const demoName = "Demo User";
    const demoPicture = "";
    
    // Use the auth context login method
    login(demoEmail, demoName, demoPicture);
    
    toast.success("Demo mode activated. Logged in as Demo User.");
    onLoginSuccess(demoEmail);
    setIsLoading(false);
  };

  // Show demo login immediately if in demo mode
  if (isDemoMode) {
    return (
      <div className="w-full">
        <Button
          onClick={handleDemoLogin}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded flex items-center justify-center space-x-2"
        >
          <User className="h-5 w-5" />
          <span>Continue with Demo Account</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <Button
          disabled
          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded flex items-center justify-center space-x-2"
        >
          <div className="animate-spin h-5 w-5 border-b-2 border-gray-800 rounded-full"></div>
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
            context="use"
          />
        </div>
      )}
    </div>
  );
}
