import makeEditorModule from '../../lib/store/entity/editor/editor';
import fieldTypes from './types';
import entities from './schema';
import records from './records';

const name = 'editor';
const editor = makeEditorModule(name, records, entities, fieldTypes);

export default editor;
