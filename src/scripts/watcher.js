export class ClassWatcher {
  constructor(
    targetNode,
    targetClass,
    onAddCallback = () => {},
    onRemoveCallback = () => {},
  ) {
    this.targetNode = targetNode;
    this.targetClass = targetClass;
    this.onAddCallback = onAddCallback;
    this.onRemoveCallback = onRemoveCallback;
    this.lastClassState = this.targetNode.classList.contains(this.targetClass);

    this.observer = new MutationObserver(this.mutationCallback);
    this.observe();
  }

  observe() {
    this.observer.observe(this.targetNode, { attributes: true });
  }

  disconnect() {
    this.observer.disconnect();
  }

  mutationCallback = (mutationsList) => {
    for (let mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        let currentClassState = mutation.target.classList.contains(
          this.targetClass,
        );
        if (this.lastClassState != currentClassState) {
          this.lastClassState = currentClassState;

          if (currentClassState) this.onAddCallback();
          else this.onRemoveCallback();
        }
      }
    }
  };
}
