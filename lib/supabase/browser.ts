'use client';

import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseConfig } from './config';

export function createSupabaseBrowserClient() {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error('Supabase is not configured. Add the public URL and anon key to the environment.');
  }

  return createBrowserClient(config.url, config.anonKey);
}
