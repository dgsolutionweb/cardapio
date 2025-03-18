import React from 'react';
import { IconType } from 'react-icons';

interface IconProps {
  icon: IconType;
  size?: number;
  color?: string;
}

export const IconRenderer: React.FC<IconProps> = ({ icon: Icon, size, color }) => {
  return React.createElement(Icon as any, { size, color });
}; 