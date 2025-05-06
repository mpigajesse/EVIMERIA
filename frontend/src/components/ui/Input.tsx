import { ChangeEvent, InputHTMLAttributes, ReactNode, useState, forwardRef } from 'react';
import { classNames } from '../../utils/designSystem';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onValueChange?: (value: string) => void;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
  iconClickable?: boolean;
  onIconClick?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      variant = 'outlined',
      size = 'md',
      fullWidth = false,
      onValueChange,
      containerClassName = '',
      labelClassName = '',
      inputClassName = '',
      helperTextClassName = '',
      errorClassName = '',
      iconClickable = false,
      onIconClick,
      onChange,
      id,
      className,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const isInvalid = !!error;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e);
      if (onValueChange) onValueChange(e.target.value);
    };

    // Classes pour le variant et la taille
    const getVariantClasses = (): string => {
      if (variant === 'filled') {
        return `bg-gray-100 border-transparent ${
          focused 
            ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-20' 
            : isInvalid 
              ? 'border-red-500 ring-2 ring-red-500 ring-opacity-20' 
              : 'hover:bg-gray-200 focus:bg-white'
        }`;
      }
      
      return `bg-white border-gray-300 ${
        focused 
          ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-20' 
          : isInvalid 
            ? 'border-red-500 ring-2 ring-red-500 ring-opacity-20' 
            : 'hover:border-gray-400'
      }`;
    };

    const getSizeClasses = (): string => {
      switch (size) {
        case 'sm':
          return 'py-1.5 text-sm h-9';
        case 'md':
          return 'py-2.5 text-base h-11';
        case 'lg':
          return 'py-3 text-lg h-13';
        default:
          return 'py-2.5 text-base h-11';
      }
    };

    // Gestion des paddings en fonction des icônes
    const getPaddingClasses = (): string => {
      if (leftIcon && rightIcon) return 'pl-10 pr-10';
      if (leftIcon) return 'pl-10 pr-4';
      if (rightIcon) return 'pl-4 pr-10';
      return 'px-4';
    };

    // Classes de base pour l'input
    const inputBaseClasses = classNames(
      'block border rounded-full w-full focus:outline-none transition-all duration-200',
      getVariantClasses(),
      getSizeClasses(),
      getPaddingClasses(),
      fullWidth ? 'w-full' : '',
      inputClassName
    );

    // Générer un ID unique si aucun n'est fourni
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={classNames('relative', fullWidth ? 'w-full' : '', containerClassName)}>
        {label && (
          <label 
            htmlFor={inputId} 
            className={classNames(
              'block text-sm font-medium text-gray-700 mb-1',
              isInvalid ? 'text-red-500' : '',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div 
              className={classNames(
                'absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500',
                iconClickable ? 'cursor-pointer' : ''
              )}
              onClick={iconClickable ? onIconClick : undefined}
            >
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            ref={ref}
            className={classNames(inputBaseClasses, className, 'transition-all duration-200 hover:shadow-sm')}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-invalid={isInvalid}
            aria-describedby={`${inputId}-helper ${inputId}-error`}
            {...props}
          />
          
          {rightIcon && (
            <div 
              className={classNames(
                'absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500',
                iconClickable ? 'cursor-pointer' : ''
              )}
              onClick={iconClickable ? onIconClick : undefined}
            >
              {rightIcon}
            </div>
          )}
        </div>
        
        {(helperText || error) && (
          <div className="mt-1">
            {helperText && !error && (
              <p 
                id={`${inputId}-helper`} 
                className={classNames('text-xs text-gray-500', helperTextClassName)}
              >
                {helperText}
              </p>
            )}
            
            {error && (
              <p 
                id={`${inputId}-error`} 
                className={classNames('text-xs text-red-500', errorClassName)}
              >
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 