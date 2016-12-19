import { expect, assert } from 'chai';

export function sharedModuleTests() {
  it('requires module name', function () {
    assert.throws(() => this.createModule(null), 'module name must be a non-empty string');
    assert.throws(() => this.createModule(''), 'module name must be a non-empty string');
    assert.throws(() => this.createModule({}), 'module name must be a non-empty string');
  });
  it('is a valid module bundle', function () {
    const module = this.createModule('name');
    expect(module).to.be.a('object').and.contain.all.keys(
      ['name', 'actionTypes', 'actions', 'reducer']
    );
    expect(module.name).to.equal('name');
  });
  it('has a "name" property', function () {
    const module = this.createModule('foo');
    expect(module.name).to.equal('foo');
  });
  it('has an "actionTypes" property whose values are all strings', function () {
    const actionTypes = this.createModule('name').actionTypes;
    expect(actionTypes).to.be.a('object');
    Object.keys(actionTypes).forEach((k) => {
      assert.isString(actionTypes[k], `action type ${k} must be a string`);
    });
  });
  it('has an "actions" property whose values are all functions', function () {
    const actions = this.createModule('name').actions;
    expect(actions).to.be.a('object');
    Object.keys(actions).forEach((k) => {
      assert.isFunction(actions[k], `action creator ${k} must be a function`);
    });
  });
  it('has a "reducer" property that is a function', function () {
    const reducer = this.createModule('name').reducer;
    expect(reducer).to.be.a('function');
  });
  it('might have a "sagas" property whose values are all generators', function () {
    const module = this.createModule('name');
    if (this.applySagas) {
      this.applySagas(module);
    }
    const sagas = module.sagas || {};
    expect(sagas).to.be.a('object');
    Object.keys(sagas).forEach((k) => {
      assert.isFunction(sagas[k]().next, `saga ${k} must be a generator`);
    });
  });
  it('might have a "selectors" property whose values are all functions', function () {
    const selectors = this.createModule('name').selectors || {};
    expect(selectors).to.be.a('object');
    Object.keys(selectors).forEach((k) => {
      assert.isFunction(selectors[k], `selector ${k} must be a function`);
    });
  });
}
