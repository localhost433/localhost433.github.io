import * as React from 'react';

/**
 * Badge — from kit@1.0.0.
 */
export interface BadgeProps {
  /** Visual style variant. */
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  children?: React.ReactNode;
  [prop: string]: unknown;
}

export declare const Badge: React.ComponentType<BadgeProps>;
