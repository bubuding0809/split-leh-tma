import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

interface LaunchParamsWrapperProps {
  children: ReactElement;
}

const TmaSdkProvider = ({ children }: LaunchParamsWrapperProps) => {
  return <>{children}</>;
};

export default dynamic(() => Promise.resolve(TmaSdkProvider), {
  ssr: false,
});
