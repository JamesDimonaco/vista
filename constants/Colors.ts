export const colors = {
  skyBlue: '#38BDF8',
  deepNavy: '#0F172A',
  slate: '#1E293B',
  softWhite: '#F8FAFC',
  mutedGrey: '#94A3B8',
  amber: '#F59E0B',
  emerald: '#10B981',
  rose: '#F43F5E',

  circleFill: 'rgba(56, 189, 248, 0.10)',
  circleStroke: 'rgba(56, 189, 248, 0.60)',
};

const tintColorLight = colors.skyBlue;
const tintColorDark = colors.skyBlue;

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: colors.softWhite,
    background: colors.deepNavy,
    tint: tintColorDark,
    tabIconDefault: colors.mutedGrey,
    tabIconSelected: tintColorDark,
  },
};
