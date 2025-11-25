import { useState, useCallback } from "react";
import * as VerifyOTPService from "../../services/VerifyOPTService";

export function useVerifyOTP() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleError = (err: unknown, fallbackMessage: string) => {
    if (err instanceof Error) setError(err.message);
    else setError(fallbackMessage);
  };

  const sendOTP = useCallback(async (phone: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await VerifyOTPService.sendOTP(phone);
      setMessage(response.message);

      if (response.success === false) {
        setError(response.message); 
      }

      return response;
      
    } catch (err: unknown) {
      handleError(err, "Failed to send OTP");
      throw err;
    } finally {
      setLoading(false);
    }
    

    
  }, []);

  const verifyOTP = useCallback(async (phone: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await VerifyOTPService.verifyOTP({ phone, otp });
      setMessage(response.message);
      return response;
    } catch (err: unknown) {
      handleError(err, "Failed to verify OTP");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, message, sendOTP, verifyOTP };
}
