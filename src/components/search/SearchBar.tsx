'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import useSWR from 'swr';
import { searchAll } from '@/lib/api';
import { SearchResults } from '@/types';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { User, MessageSquare, Users, Calendar, } from 'lucide-react';

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const router = useRouter();

  const { data: results } = useSWR<SearchResults>(
    debouncedQuery ? `/search?q=${debouncedQuery}` : null,
    () => searchAll(debouncedQuery)
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => unknown) => {
    setOpen(false);
    command();
  };

  console.log({results})

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64'
        )}
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder="Search for people, posts, groups..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {Array.isArray(results?.profiles) && results.profiles.length > 0 && (
            <CommandGroup heading="People">
              {results.profiles.map((profile) => (
                <CommandItem
                  key={profile._id}
                  value={profile.username}
                  onSelect={() => runCommand(() => router.push(`/profiles/${profile.username}`))}
                >
                  <User className="mr-2 h-4 w-4" />
                  <div>{profile.displayName}</div>
                  <div>@{profile.username}</div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {Array.isArray(results?.posts) && results.posts.length > 0 && (
            <CommandGroup heading="Posts">
              {results.posts.map((post) => (
                <CommandItem
                  key={post._id}
                  value={post.content}
                  onSelect={() => runCommand(() => router.push(`/posts/${post._id}`))}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>{post.content}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {Array.isArray(results?.groups) && results.groups.length > 0 && (
            <CommandGroup heading="Groups">
              {results.groups.map((group) => (
                <CommandItem
                  key={group._id}
                  value={group.name}
                  onSelect={() => runCommand(() => router.push(`/groups/${group._id}`))}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>{group.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {Array.isArray(results?.events) && results.events.length > 0 && (
            <CommandGroup heading="Events">
              {results.events.map((event) => (
                <CommandItem
                  key={event._id}
                  value={event.title}
                  onSelect={() => runCommand(() => router.push(`/events/${event._id}`))}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{event.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

        </CommandList>
      </CommandDialog>
    </>
  );
}