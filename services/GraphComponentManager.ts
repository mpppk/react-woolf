import isEqual from 'react-fast-compare';

// DiffResults represents [addedComponents, updatedComponents, removedComponents]
export type DiffResults<Component> = [Component[], Component[], Component[]];

export interface NamedComponent {
  name: string;
}

export class GraphComponentManager<Component extends NamedComponent> {
  private componentMap: Map<string, Component> = new Map();

  public sync(components: Component[]): DiffResults<Component> {
    const diff = this.diff(components);
    const [addedComponents, updatedComponents, removedComponents] = diff;
    addedComponents.forEach(c => this.add(c));
    updatedComponents.forEach(c => this.add(c));
    removedComponents.forEach(c => this.remove(c));
    return diff;
  }

  private add(component: Component) {
    this.componentMap.set(component.name, component);
  }

  private remove(component: Component): boolean {
    return this.componentMap.delete(component.name);
  }

  private diff(components: Component[]): DiffResults<Component> {
    const addedComponents = this.extractNonExisting(components);
    const updatedComponents = this.extractUpdate(components);
    const removedComponents = this.listNonExisting(components);
    return [addedComponents, updatedComponents, removedComponents];
  }

  private extractNonExisting(components: Component[]): Component[] {
    return components.filter(c => !this.hasName(c.name));
  }

  private extractUpdate(components: Component[]): Component[] {
    return components.filter(c => this.hasName(c.name) && !this.has(c));
  }

  private listNonExisting(components: Component[]): Component[] {
    const currentComponentNames = Array.from(this.componentMap.keys());
    const componentNames = components.map(c => c.name);
    const nonExistingComponentNames = currentComponentNames.filter(
      n => !componentNames.includes(n)
    );
    return nonExistingComponentNames.map(n => this.componentMap.get(n));
  }

  private has(component: Component): boolean {
    if (!this.hasName(component.name)) {
      return false;
    }
    const currentComponent = this.componentMap.get(component.name);
    return isEqual(component, currentComponent);
  }

  private hasName(componentName: string): boolean {
    return this.componentMap.has(componentName);
  }
}
