import { useNavigate } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';

export const AuthLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        'w-screen h-screen overflow-hidden grid md:grid-cols-2 grid-cols-1 grid-rows-[120px_1fr] sm:grid-rows-[300px_1fr] md:grid-rows-1',
        className,
      )}
    >
      <div className="h-full w-full sm:bg-[url('/auth-bg.png')] bg-no-repeat p-2 bg-cover flex gap-2 items-center flex-col justify-center ">
        <div className="max-w-465 flex flex-col items-center sm:items-start  gap-2 md:gap-5 ">
          <div className="flex items-center  gap-3  px-4 py-3 w-max rounded-full">
            <img
              src="/logo.png"
              alt="logo"
              onClick={() => navigate(routes.home)}
              className="object-contain w-80  hidden -ml-8 sm:block cursor-pointer"
            />
            <img
              src="/logo-black.png"
              alt="dark-version-lgo"
              className="sm:hidden w-80"
              onClick={() => navigate(routes.home)}
            />
            {/* <h4 className="text-gray-50 text-lg md:text-2xl font-bold">Duality AI</h4> */}
          </div>
          <h1 className="text-white hidden sm:block text-2xl md:text-6xl font-semibold md:leading-66">
            Welcome to Seethos
          </h1>
          <p className="hidden sm:block text-blueGray-300 text-sm md:text-lg">
            Seethos provides you with AI integrated agent to respond to all of your users.
          </p>
        </div>
      </div>
      <div className="flex md:px-20 md:py-32 p-4 max-w-[800px] overflow-auto">{children}</div>
    </div>
  );
};
