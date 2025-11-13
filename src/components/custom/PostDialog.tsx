'use client';

import { useState, useRef, useEffect } from 'react';
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
} from '@/components/ui/Dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Loader2, X, ImagePlus } from 'lucide-react';
import { useCreatePost, useUpdatePost } from '@/api/post/mutations';
import { useUIStore } from '@/stores/ui-store';
import { PostWithUser } from '@/api/post/types';

const postSchema = z.object({
  content: z.string().min(1, 'Post content is required').max(1000, 'Post is too long'),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostDialogProps {
  mode: 'create' | 'edit';
  post?: PostWithUser | null;
}

export function PostDialog({ mode, post }: PostDialogProps) {
  const isCreateOpen = useUIStore((state) => state.isCreatePostOpen);
  const setCreateOpen = useUIStore((state) => state.setCreatePostOpen);
  const isEditOpen = useUIStore((state) => state.isEditPostOpen);
  const setEditOpen = useUIStore((state) => state.setEditPostOpen);
  const setEditingPostId = useUIStore((state) => state.setEditingPostId);
  
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOpen = mode === 'create' ? isCreateOpen : isEditOpen;
  const setOpen = mode === 'create' ? setCreateOpen : setEditOpen;
  const mutation = mode === 'create' ? createPost : updatePost;

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
    },
  });

  // Update form when post changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && post) {
      form.reset({
        content: post.content,
      });
      setImages(post.images || []);
    }
  }, [mode, post, form]);

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
      if (mode === 'create') {
        await createPost.mutateAsync({
          content: data.content,
          images: images.length > 0 ? images : undefined,
        });
      } else {
        if (!post) return;
        await updatePost.mutateAsync({
          id: post.id,
          data: {
            content: data.content,
            images: images,
          },
        });
      }
      handleClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Delay reset to allow modal close animation
    setTimeout(() => {
      form.reset();
      setImages([]);
      if (mode === 'edit') {
        setEditingPostId(null);
      }
    }, 200);
  };

  const dialogOpen = mode === 'edit' ? (isEditOpen && !!post) : isCreateOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Post' : 'Edit Post'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Share your thoughts with the community' 
              : 'Make changes to your post'}
          </DialogDescription>
        </DialogHeader>

        {(mode === 'create' || post) ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {mode === 'create' ? "What's on your mind?" : 'Content'}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your thoughts..."
                        className="min-h-[120px] resize-none"
                        {...field}
                        disabled={mutation.isPending}
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
                  id={`image-upload-${mode}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={mutation.isPending}
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
                  disabled={mutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {mode === 'create' ? 'Post' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Loading...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
