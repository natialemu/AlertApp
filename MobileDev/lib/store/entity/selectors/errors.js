import { uniq } from 'lodash';
import { createSelector } from 'reselect';

export const applyErrorSelectors = () => entity => {
  const invalidRecords = (expanded) => expanded
    .filter(r => r.get('errors') && r.get('errors').count());

  entity.selectors.invalidRecords = createSelector(
    entity.selectors.expanded,
    invalidRecords
  );

  entity.selectors.editor.invalidRecords = createSelector(
    entity.selectors.editor.expanded,
    invalidRecords
  );

  const uploadErrors = (invalid) => invalid
    .toList()
    .filter(r => r.get('status') !== 'DELETED')
    .flatMap(r => r.get('errors'));

  entity.selectors.uploadErrors = createSelector(
    entity.selectors.expanded,
    uploadErrors
  );

  entity.selectors.editor.uploadErrors = createSelector(
    entity.selectors.editor.expanded,
    uploadErrors
  );

  const asJS = (errors) => uniq(errors.toJS(), 'key');

  entity.selectors.errorsJS = createSelector(
    entity.selectors.uploadErrors,
    asJS
  );

  entity.selectors.editor.errorsJS = createSelector(
    entity.selectors.editor.uploadErrors,
    asJS
  );

  return entity;
};
