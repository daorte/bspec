'use strict';

require('es6-promise').polyfill();

var should = require('should');
var util = require('util');
var bspec = require('./../lib/bspec');

describe('Specification from functions that return a promise', function() {

  function alwaysTrue() { return new Promise(function(resolve, reject) { resolve(true); }); }
  function alwaysFalse() { return new Promise(function(resolve, reject) { resolve(false); }); }
  function alwaysError() { return new Promise(function(resolve, reject) { throw new Error('some error'); }); }

  var Spec = bspec.PromiseSpec;

  it('can be created with `new`', function(done) {
    var spec = new Spec(alwaysTrue);
    spec.isSatisfiedBy({}).then(function(flag) {
      flag.should.be.true;
      done();
    }, function(reason) {
      throw new Error(reason);
    });
  });

  it('can be created from `true`', function(done) {
    var spec = Spec(alwaysTrue);
    spec.isSatisfiedBy({}).then(function(flag) {
      flag.should.be.true;
      done();
    }, function(reason) {
      throw new Error(reason);
    });
  });

  it('can be created from `false`', function(done) {
    var spec = Spec(alwaysFalse);
    spec.isSatisfiedBy({}).then(function(flag) {
      flag.should.be.false;
      done();
    }, function(reason) {
      throw new Error(reason);
    });
  });

  it('can be created from `error`', function(done) {
    var spec = Spec(alwaysError);
    spec.isSatisfiedBy({}).then(function(flag) {
      throw new Error('should not be here');
    }, function(reason) {
      should.exist(reason);
      done();
    });
  });

  it('can be composed', function(done) {
    var spec = Spec(alwaysTrue).and(alwaysTrue).or(alwaysFalse).not();
    var flag = spec.isSatisfiedBy({}).then(function(flag) {
      flag.should.be.false;
      done();
    }, function(reason) {
      throw new Error(reason);
    });
  });

});
