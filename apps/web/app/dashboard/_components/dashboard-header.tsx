'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardNav } from '@sama-energy/ui';

const navLinks = [
  {
    href: '/dashboard/overview',
    label: 'Overview',
  },
  {
    href: '/dashboard/comparison',
    label: 'Comparison',
  },
] as const;

export default function DashboardHeader() {
  const pathname = usePathname();

  return <DashboardNav activePath={pathname} linkComponent={Link} links={navLinks} />;
}
