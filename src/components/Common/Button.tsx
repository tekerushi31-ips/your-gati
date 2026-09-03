import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-xl font-extrabold text-xs shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-7 py-3.5 text-sm'
  }[size];

  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/20',
    secondary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/20',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/20',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 shadow-none'
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
