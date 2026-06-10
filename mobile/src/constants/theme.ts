export const NEU = {
  surface: '#E0E5EC',
  white:   '#FFFFFF',
  shadow:  '#A3B1C6',
  text:    {
    primary:   '#2D3748',
    secondary: '#718096',
    muted:     '#A0AEC0',
  },
};

export const ROLES = {
  parent:  { accent: '#0EA5E9', label: 'Parent' },
  student: { accent: '#10B981', label: 'Student' },
};

export const FONT = {
  xs:  11,
  sm:  13,
  md:  15,
  lg:  18,
  xl:  22,
  xxl: 28,
};

export const RADIUS = { sm: 8, md: 12, lg: 18, xl: 24 };

// Neu-skeuomorphism shadow helpers
export const raiseShadow = (size: 'sm'|'md'|'lg' = 'md') => {
  const offsets = { sm: 3, md: 6, lg: 10 };
  const n = offsets[size];
  return {
    shadowColor: NEU.shadow,
    shadowOffset: { width: n, height: n },
    shadowOpacity: 0.7,
    shadowRadius: n * 1.5,
    elevation: n,
  };
};

export const sinkShadow = () => ({
  shadowColor: NEU.shadow,
  shadowOffset: { width: -2, height: -2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 0,
});
