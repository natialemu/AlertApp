import baseTypes from '../../entity/types/types';
import { applyCurrentValueSelectors } from './currentValues';
import { applyEditorSelectors } from './editor';
import { applyExpandedSelectors } from './expanded';
import { applyFamilySelectors } from './family';
import { applyStateSelectors } from './state';
import { applyErrorSelectors } from './errors';
import { applyTableDataSelectors } from './tableData';
import { applyAdditionalSelectors } from './additionalSelectors';

export default function makeSelectorFactories(entityMap, context = {}) {
  const fieldTypes = context.fieldTypes || baseTypes;
  const editorName = context.editorName || (() => 'editor');
  const recordsModule = context.recordsModule || {
    name: 'records',
    selectors: {
      getRecords(state) {
        return state.records;
      },
    },
  };
  const tableDataContext = context.tableDataContext || (() => ({}));

  return [
    applyCurrentValueSelectors(entityMap, recordsModule),
    applyExpandedSelectors(entityMap),
    applyFamilySelectors(entityMap, recordsModule),
    applyStateSelectors(entityMap),
    applyEditorSelectors(entityMap, editorName, fieldTypes),
    applyErrorSelectors(entityMap),
    applyTableDataSelectors(entityMap, fieldTypes, tableDataContext),
    applyAdditionalSelectors(entityMap),
  ];
}
