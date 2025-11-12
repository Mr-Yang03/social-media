'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, X, ImagePlus } from 'lucide-react';
import { useCreatePost } from '@/api/post/mutations';
import { useUIStore } from '@/stores/ui-store';

const postSchema = z.object({
  content: z.string().min(1, 'Post content is required').max(1000, 'Post is too long'),
});

type PostFormValues = z.infer<typeof postSchema>;

export function CreatePostDialog() {
  const isOpen = useUIStore((state) => state.isCreatePostOpen);
  const setOpen = useUIStore((state) => state.setCreatePostOpen);
  const createPost = useCreatePost();
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PostFormValues) => {
    try {
      await createPost.mutateAsync({
        content: data.content,
        images: images.length > 0 ? images : undefined,
      });
      form.reset();
      setImages([]);
      setOpen(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleClose = () => {
    form.reset();
    setImages([]);
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Share your thoughts with the community
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What&apos;s on your mind?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts..."
                      className="min-h-[120px] resize-none"
                      {...field}
                      disabled={createPost.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Section */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={createPost.isPending}
                className="w-full"
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Add Images
              </Button>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createPost.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createPost.isPending}>
                {createPost.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Post
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
