import type { CardProps } from '@/types';

export const Card = ({ children, className = '', ...props }: CardProps) => (
  <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...props }: CardProps) => (
  <div className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '', ...props }: CardProps) => (
  <div className={`p-3 ${className}`} {...props}>
    {children}
  </div>
);
