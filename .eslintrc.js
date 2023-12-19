module.exports = {
    extends: ['plugin:react-native/all', 'prettier'],
    plugins: ['prettier', 'react-native'],
    rules: {
      'prettier/prettier': 'error',
      'react-native/no-unused-styles': 'error',
      'react-native/split-platform-components': 'error',
    },
  };
  