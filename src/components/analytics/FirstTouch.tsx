'use client';

import { useEffect } from 'react';
import { recordFirstTouch } from '@/lib/firstTouch';

/** Mounted once in the root layout; see src/lib/firstTouch.ts. */
export default function FirstTouch() {
  useEffect(recordFirstTouch, []);
  return null;
}
