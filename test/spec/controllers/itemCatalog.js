'use strict';

describe('myRetailApp.itemCatalog module', function() {

  beforeEach(module('myRetailApp.itemCatalog'));

  it('should have a itemCatalog controller', function($controller) {
    var itemCatalog = $controller('ItemCatalogCtrl');
    expect(itemCatalog).toBeDefined();
  });

});
