"use client"

import { useForm, UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/Form';
import { zodResolver } from '@hookform/resolvers/zod';

interface MainFormProps {
  children: ((form: UseFormReturn<any>) => React.ReactNode) | React.ReactNode;
  validationSchema?: any;
  defaultValues?: any;
  onSubmit: (data: any) => void;
}

export default function MainForm({ children, validationSchema, defaultValues, onSubmit }: MainFormProps) {
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