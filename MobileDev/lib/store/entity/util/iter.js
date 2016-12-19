/**
 * Extract the relatives of a given type from an entity's schema, finding both
 * the entity object itself and the foreign or inverse foreign key for that relative.
 * @param  {String} reltype  - 'parents'|'children'
 * @param  {Array<Object>} entities - The complete entity map.
 * @param  {Object} entity   - The entity in focus.
 * @return {Array<Array<Object, Array<String>>>} - A list of [entity, (i)fk] tuples.
 */
export const relsFor = (reltype, entities, entity) => {
  const rels = entity.schema.getMeta(reltype) || [];
  return rels.map(([relname, relkey, options]) => [entities[relname], relkey, options]);
};

/**
 * Extract the entity name spec from a schema.
 * @param  {Object} entity - The entity you want a name from.
 * @return {Object}        - The name spec for this entity.
 */
export const getEntityName = (entity) => entity.schema.getMeta('entityName');

/**
 * Get the singular version of this entity's name.
 * @param  {Object} entity - The entity you want a name from.
 * @return {String}        - The entity's name in singular form.
 */
export const entityNameSingle = (entity) => getEntityName(entity).single;

/**
 * Get the plural version of this entity's name.
 * @param  {Object} entity - The entity you want a name from.
 * @return {String}        - The entity's name in plural form.
 */
export const entityNamePlural = (entity) => getEntityName(entity).plural;

/**
 * Get a nice string that uniquely identifies the relationship between two entities.
 * @param  {Object} sourceEntity - The entity you started from
 * @param  {Object} relEntity    - The entity you wound up at
 * @param  {String} reltype      - The type of relationship ('parents' | 'children')
 * @param  {Array<String>} key   - The foreign key connecting the two entities.
 * @return {String}              - A string representing the relation.
 */
const hashRel = (sourceEntity, relEntity, reltype, key) => {
  let sourceName = entityNameSingle(sourceEntity);
  let relName = entityNameSingle(relEntity);
  switch (reltype) {
    case 'parents':
      sourceName += `[${key.join('.')}]`;
      break;
    case 'children':
      relName += `[${key.join('.')}]`;
      break;
    default:
      break;
  }
  return `${sourceName}->${relName}`;
};

/**
 * Do a breadth-first walk of the entity graph along a single relation ('parents'|'children')
 * @param {String} reltype       - The type of relationship ('parents'|'children')
 * @param {Object} entity        - The entity to start from
 * @param {Object} entities      - The complete entity map
 * @param {Object} seen          - A container for the relationships that have been
 * encountered already, so that nodes are only visited once.
 * @yield {Object} relation
 * @yield {Object} relation.relEntity - The current related entity.
 * @yield {Object} relation.source - The entity the current relation is related to.
 * @yield {Object} relation.options - Options associated with this relation, if any.
 * @yield {Array<String>} relation.key - The key connecting the relEntity to the source.
 * @yield {String} relation.hash - A unique string representing this relation. Mostly for debugging.
 */
export function* iterEntities(reltype, entity, entities, seen = {}) {
  function* getRels([rel, ...rest], source) {
    const [relEntity, key, options] = rel;
    const hash = hashRel(source, relEntity, reltype, key);
    if (!seen[hash]) {
      yield { relEntity, source, key, options, hash };
      seen[hash] = true;
    }
    if (rest.length) {
      yield* getRels(rest, source);
    }
    yield* iterEntities(reltype, relEntity, entities, seen);
  }

  const rels = relsFor(reltype, entities, entity);
  if (rels.length) {
    yield* getRels(rels, entity);
  }
}
