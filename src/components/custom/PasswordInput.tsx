'use client';

import { useState, useRef, forwardRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  disabled?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ disabled, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const togglePasswordVisibility = () => {
      const input = inputRef.current;
      const cursorPosition = input?.selectionStart ?? null;
      
      setShowPassword(!showPassword);
      
      setTimeout(() => {
        if (input) {
          input.focus();
          if (cursorPosition !== null) {
            input.setSelectionRange(cursorPosition, cursorPosition);
          }
        }
      }, 0);
    };

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          ref={(el) => {
            inputRef.current = el;
            if (typeof ref === 'function') {
              ref(el);
            } else if (ref) {
              ref.current = el;
            }
          }}
          className={className}
          disabled={disabled}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
