import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';

const withProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuthState = async () => {
        try {
          await Auth.currentAuthenticatedUser();
          setIsLoading(false);
        } catch (err) {
          Router.replace('/login');
        }
      };
      checkAuthState();
    }, []);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withProtectedRoute;
