import Immutable from 'immutable';

/**
 * Take a field list and turn it into a map of key -> field.
 * The structure of the field map will reflect the structure of the object
 * the fields pertain to (nested fields will be nested in the field map).
 * @param  {Array<Object>} fields - The field list to make a map of.
 * @return {Object}        - The field map.
 */
export function fieldMap(fields) {
  return fields.reduce(
    (m, field) => m.setIn(field.key, field),
    new Immutable.Map()
  ).toJS();
}

/**
 * In most cases, you don't want to export a relative object's fields. But
 * you generally do need to export the ID and Name for identification purposes.
 * @type {Array}
 */
const REL_EXPORTED_KEYS = ['id', 'name'];

/**
 * Create a new copy of a relative field, including a key prefix.
 * Relative fields are marked as not-for-export (unless their keys end in one of the
 * strings in REL_EXPORTED_KEYS) and readonly.
 * @param  {Array<String>} keyPrefix - A keypath to prepend to the relative field's key.
 * @return {Object}        - The remapped field.
 */
export function relativeField(keyPrefix) {
  return f => Object.assign({}, f, {
    key: keyPrefix.concat(f.key),
    readonly: true,
    isRelative: true,
    isExported: (
      f.expanded !== false &&
      f.key.indexOf('organization') === -1 &&
      REL_EXPORTED_KEYS.indexOf(f.key[f.key.length - 1]) > -1
    ),
  });
}

/**
 * Fix name collisions amongst relative fields by prepending the category of relative
 * fields involved in the collision to its label.
 * @param  {Array<Object>} fields - The list of fields to (possibly) rename
 * @return {Array<Object>}        - The fields, renamed as necessary.
 */
export function renameExpandedFields(fields) {
  const labelMap = fields.reduce(
    (m, f, i) => {
      if (m.hasOwnProperty(f.label)) {
        m[f.label].push(i);
      } else {
        m[f.label] = [i];
      }
      return m;
    },
    {}
  );
  return fields.map(f => (
    (
      labelMap[f.label].length > 1 &&
      f.isRelative &&
      !f.label.match(new RegExp(`^${f.category}`, 'i')
    ) ? Object.assign({}, f, { label: `${f.category} ${f.label}` }) : f
  )));
}

export function statField(category) {
  return f => Object.assign({}, f, {
    category,
    key: ['stats'].concat(f.key),
    expanded: false,
    isStats: true,
  });
}
