export const applyAdditionalSelectors = entities => entity => {
  if (entity.additionalSelectors) {
    entity.additionalSelectors(entity, entities);
  }
  return entity;
};
