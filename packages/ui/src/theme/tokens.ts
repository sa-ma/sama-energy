export type SamaStatusTone = {
  fg: string;
  surface: string;
  border: string;
};

export type SamaThemeTokens = {
  surface: {
    canvas: string;
    subtle: string;
    raised: string;
    overlay: string;
  };
  border: {
    subtle: string;
    strong: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  status: {
    positive: SamaStatusTone;
    negative: SamaStatusTone;
    warning: SamaStatusTone;
    info: SamaStatusTone;
  };
  chart: {
    series: readonly [string, string, string];
    revenueBar: string;
    revenueBarActive: string;
    revenueBarStroke: string;
    axisText: string;
    grid: string;
    legendText: string;
    cursor: string;
    cursorFill: string;
    tooltipSurface: string;
    tooltipBorder: string;
    activeDotStroke: string;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    pill: number;
  };
  elevation: {
    subtle: string;
    floating: string;
    overlay: string;
    nav: string;
    active: string;
  };
};

export const samaTokens: SamaThemeTokens = {
  surface: {
    canvas: '#f5f5f3',
    subtle: '#fafaf8',
    raised: 'rgba(255, 255, 255, 0.96)',
    overlay: 'rgba(250, 250, 248, 0.98)',
  },
  border: {
    subtle: 'rgba(226, 232, 240, 0.95)',
    strong: 'rgba(203, 213, 225, 0.98)',
  },
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    muted: '#64748b',
  },
  status: {
    positive: {
      fg: '#166534',
      surface: 'rgba(220, 252, 231, 0.78)',
      border: 'rgba(134, 239, 172, 0.72)',
    },
    negative: {
      fg: '#b91c1c',
      surface: 'rgba(254, 242, 242, 0.86)',
      border: 'rgba(252, 165, 165, 0.68)',
    },
    warning: {
      fg: '#b45309',
      surface: 'rgba(255, 247, 237, 0.9)',
      border: 'rgba(253, 186, 116, 0.62)',
    },
    info: {
      fg: '#2563eb',
      surface: 'rgba(239, 246, 255, 0.9)',
      border: 'rgba(147, 197, 253, 0.72)',
    },
  },
  chart: {
    series: ['#2563eb', '#dc2626', '#16a34a'],
    revenueBar: '#93c5fd',
    revenueBarActive: '#60a5fa',
    revenueBarStroke: 'rgba(37, 99, 235, 0.18)',
    axisText: '#475569',
    grid: 'rgba(148, 163, 184, 0.24)',
    legendText: '#334155',
    cursor: 'rgba(15, 23, 42, 0.12)',
    cursorFill: 'rgba(15, 23, 42, 0.04)',
    tooltipSurface: 'rgba(255, 255, 255, 0.98)',
    tooltipBorder: 'rgba(203, 213, 225, 0.92)',
    activeDotStroke: '#ffffff',
  },
  radius: {
    sm: 10,
    md: 12,
    lg: 16,
    pill: 999,
  },
  elevation: {
    subtle: '0 1px 2px rgba(15, 23, 42, 0.05)',
    floating: '0 14px 30px rgba(15, 23, 42, 0.12)',
    overlay: '0 18px 40px rgba(15, 23, 42, 0.1)',
    nav: '0 6px 16px rgba(15, 23, 42, 0.05)',
    active: '0 6px 14px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.06)',
  },
};
