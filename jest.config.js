module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community|-tvos)?|@react-navigation|react-native-screens|react-native-safe-area-context)/)',
  ],
};
