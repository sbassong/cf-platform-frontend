'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSWRConfig } from 'swr';
import { format } from 'date-fns';
import { Event as EventType } from '@/types';
import { updateEvent, getEventImageUploadUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Loader2, CalendarIcon } from 'lucide-react';

interface EditEventModalProps {
  event: EventType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(10).max(1000),
  location: z.string().min(3),
  date: z.date(),
});

export default function EditEventModal({ event, isOpen, onOpenChange }: EditEventModalProps) {
  const { mutate } = useSWRConfig();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(event.imageUrl || '');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: event.title,
        description: event.description,
        location: event.location,
        date: new Date(event.date),
      });
      setImagePreview(event.imageUrl || '');
      setImageFile(null);
    }
  }, [isOpen, event, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const updateData: any = { ...values, date: values.date.toISOString() };

    try {
      if (imageFile) {
        const { uploadUrl, publicUrl } = await getEventImageUploadUrl(imageFile.type);
        await fetch(uploadUrl, { method: 'PUT', body: imageFile, headers: { 'Content-Type': imageFile.type } });
        updateData.imageUrl = publicUrl;
      }

      await updateEvent(event._id, updateData);
      mutate(`/events/${event._id}`);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update event", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div>
              <FormLabel>Event Image</FormLabel>
              <div className="mt-2 aspect-video w-full relative bg-muted rounded-md overflow-hidden">
                {imagePreview && <Image src={imagePreview} alt="Event preview" fill className="object-cover" />}
                <Button type="button" variant="secondary" size="sm" className="absolute bottom-2 right-2" onClick={() => imageInputRef.current?.click()}>
                  Change Image
                </Button>
              </div>
            </div>
            <input type="file" ref={imageInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

            {/* Form Fields */}
            <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}> {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>} <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>)} />

            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}