"use client"

import { useForm, UseFormReturn } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/Form';
import { zodResolver } from '@hookform/resolvers/zod';
import { withProperties } from '@/utils/WithProperties';
import { ComponentType } from 'react';

interface MainFormProps {
  children: ((form: UseFormReturn<any>) => React.ReactNode) | React.ReactNode;
  validationSchema?: any;
  defaultValues?: any;
  onSubmit: (data: any) => void;
}

interface FieldProps {
  name: string;
  label?: string;
  component: ComponentType<any>;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  description?: string;
  className?: string;
  [key: string]: any;
}

function MainForm({ children, validationSchema, defaultValues, onSubmit }: MainFormProps) {
  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues,
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {typeof children === 'function' ? children(form) : children}
        </form>
      </Form>
    </>
  )
}

function Field({ name, label, component: Component, placeholder, type, disabled, description, className, ...props }: FieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Component
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={className}
              {...field}
              {...props}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default withProperties(MainForm, {
  Field,
});