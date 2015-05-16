import Observer from './observer';
import registry from './registry';

function witness (obj) {
  var observer = Observer.find(obj);

  if (!observer) {
    observer = new Observer(obj);
    registry.objects.push(obj);
    registry.observers.push(observer);
  }

  return observer;
}

export default window.witness = witness;
