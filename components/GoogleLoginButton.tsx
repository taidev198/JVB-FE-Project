import React, { useEffect } from 'react';
import { useSendGoogleCredentialMutation, useProcessRedirectUrlMutation } from '@/services/portalHomeApi';
import { logIn } from '@/store/slices/user';
import { roles } from '@/utils/app/const';
import router, { useRouter } from 'next/router';
import { useAppDispatch } from '@/store/hooks';
import { store } from '@/store/store';

const GoogleLoginButton: React.FC = () => {

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [sendGoogleCredential] = useSendGoogleCredentialMutation();
  const [processRedirectUrl] = useProcessRedirectUrlMutation();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: `${process.env.NEXT_PUBLIC_YOUR_GOOGLE_CLIENT_ID}`,
        callback: handleLoginSuccess,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-login-button')!,
        { theme: 'outline', size: 'large' }
      );
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLoginSuccess = async (response: any) => {
    if (response.credential) {
      try {
        // Send the credential to the backend
        const socialLoginResponse = await sendGoogleCredential({
          loginType: 'google',
          token: response.credential,
        }).unwrap();
  
        const redirectUrl = socialLoginResponse.data;
        const urlParams = new URLSearchParams(redirectUrl.split('?')[1]);
        const redirectUri = urlParams.get('redirect_uri')?.replace('http://localhost:3000', 'http://localhost:8082');
  
        // Process the redirect URL
        const data = await processRedirectUrl({
          redirectUri: redirectUri!,
          idTokenString: response.credential,
        }).unwrap();
  
        if (data && data.data && data.data.token && data.data.user) {
          // Dispatch login action with valid data
          dispatch(
            logIn({
              token: data.data.token,
              name: data.data.user.fullName || data.data.user.companyName || data.data.user.universityName,
              id: data.data.user.id,
              logoUrl: data.data?.user.logoUrl ? data.data?.user.logoUrl : '',
              idAccount: data.data.user?.id,
              roleAccount: data.data.roleAccount,
            })
          );        
          // Redirect based on user role
          switch (data?.data.roleAccount) {
            case roles.ADMIN:
              router.push('/admin/system/dashboard');
              break;
            case roles.COMPANY:
              router.push('/admin/company/dashboard');
              break;
            case roles.UNIVERSITY:
              router.push('/admin/school/dashboard');
              break;
            default:
              break;
          }
        } else {
          console.error('Invalid data received from processRedirectUrl:', data);
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    } else {
      console.error('No credential received');
    }
  };

  return (
    <div>
      <div id="google-login-button"></div>
    </div>
  );
};

export default GoogleLoginButton;