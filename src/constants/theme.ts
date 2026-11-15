/**
 * Dizayn tizimi: ranglar, shriftlar, o'lchamlar — barcha ekranlar shu yerdan oladi.
 * Uslub: to'q (dark) "studio" — professional grafik dasturlar kabi,
 * kanvas esa oq bo'lib, diqqat markazida turadi.
 */
export const colors = {
  bg: '#0B0E14',
  workspace: '#11151D',
  surface: '#161B26',
  surfaceRaised: '#1D2433',
  surfaceHover: '#252D40',
  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.14)',
  text: '#EEF1F7',
  textMuted: '#8C95AA',
  textFaint: '#5B647A',
  accent: '#7C6CFF',
  accent2: '#4AA8FF',
  accentSoft: 'rgba(124,108,255,0.16)',
  canvas: '#FFFFFF',
  danger: '#FF5D73',
  dangerSoft: 'rgba(255,93,115,0.14)',
  success: '#2FD08B',
  overlay: 'rgba(5,7,12,0.72)',
};

/** Asosiy gradient (logotip, "Saqlash" tugmasi, faol asbob). */
export const gradient = {
  accent: ['#8B5CF6', '#6366F1', '#3B82F6'] as const,
  danger: ['#FF6B81', '#F43F5E'] as const,
};

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  round: 999,
};

/** Soya — kanvas va suzuvchi panellar uchun. */
export const shadow = {
  canvas: {
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
};
