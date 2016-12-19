import plainText from './plain';

const UNDERSCORE_REGEX = /_/g;

const toTableValue = v => (v || '').replace(UNDERSCORE_REGEX, ' ');

export default Object.assign({}, plainText, {
  toTableValue,
  type: 'text/timezone',
});
