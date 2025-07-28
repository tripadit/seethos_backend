import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SubHeading = ({
  title,
  children,
  onBackPress,
  isChildPage,
}: {
  title: string;
  children: React.ReactNode;
  onBackPress?: () => void;
  isChildPage?: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row justify-between w-subheading items-center py-2  flex-1 sticky top-[-20px]   pr-8 z-10 bg-white border-solid border-b">
      <div
        className="flex gap-2 items-center text-gray-700 cursor-pointer"
        onClick={() => (onBackPress ? onBackPress?.() : navigate(-1))}
      >
        {isChildPage && <ArrowLeft className="w-5 h-5 font-bold text-gray-700" />}
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
};
