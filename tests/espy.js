(function() {

  var observer;
  var observed;

  beforeEach(function() {
    observed = {};
    observer = espy(observed);
  });

  afterEach(function() {
    observer.stop();
  });

  describe('Observing objects', function() {
    it('Should observe additions', function(done) {
      observer.on('add', function(change) {
        change.object.should.equal(observed);
        change.type.should.equal('add');
        change.name.should.equal('test');
        expect(change.oldValue).to.equal(undefined);
        change.newValue.should.equal(false);

        done();
      });

      observed.test = false;
    });

    it('Should observe updates', function(done) {
      observed.test = false;

      observer.on('update', function(change) {
        change.object.should.equal(observed);
        change.type.should.equal('update');
        change.name.should.equal('test');
        change.oldValue.should.equal(false);
        change.newValue.should.equal(true);

        done();
      });

      observed.test = true;
    });

    it('Should observe deletions', function(done) {
      observed.test = true;

      observer.on('delete', function(change) {
        change.object.should.equal(observed);
        change.type.should.equal('delete');
        change.name.should.equal('test');
        change.oldValue.should.equal(true);
        expect(change.newValue).to.equal(undefined);

        done();
      });

      delete observed.test;
    });

    it('Should observe any type of event', function() {
      observer.on('all', function(change) {
        change.object.should.equal(observed);
        change.type.should.equal('add');
        change.name.should.equal('test');
        change.oldValue.should.equal(undefined);
        expect(change.newValue).to.equal(true);

        done();
      });

      observed.test = true;
    });
  });

})();