interface Node {
  label: string;
  id: string;
  properties?: Record<string, any>;
}

interface Edge {
  label: string;
  properties?: Record<string, any>;
}

export class CypherQuery {
  private args: Record<string, string | number> = {};
  private lines: string[] = [];
  private nodeCount = 0;
  private identifiers: string[] = [];

  private identifier(label: string): string {
    const i = `${label}${this.nodeCount++}`;
    this.identifiers.push(i);
    return i;
  }

  private matchNode(label: string, id: string): string {
    const identifier = this.identifier(label);
    this.lines.push(`MATCH (${identifier}:${label} { id: $${identifier}_id})`);
    this.args[`${identifier}_id`] = id;
    return identifier;
  }

  private mergeNode({properties: data, ...node}: Node): string {
    const identifier = this.identifier(node.label);
    this.lines.push(`MERGE (${identifier}:${node.label} { id: $${identifier}_id })`);
    this.args[`${identifier}_id`] = node.id;
    if (data) {
      const keys = Object.keys(data);
      this.lines.push(`    SET`);
      keys.forEach((key, index) => {
        const argKey = `${identifier}_${key}`;
        this.lines.push(`      ${identifier}.${key}=$${argKey}${index < keys.length - 1 ? ',' : ''}`);
        this.args[argKey] = data[key as keyof typeof node];
      });
    }
    return identifier;
  }

  private matchEdge(from: string, {label}: Edge, to: string): string {
    const identifier = this.identifier(label);
    this.lines.push(`MATCH (${from})-[${identifier}:${label}]->(${to})`);
    return identifier;
  }

  private mergeEdge(from: string, {properties: data, ...edge}: Edge, to: string): string {
    const identifier = this.identifier(edge.label);
    this.lines.push(`MERGE (${from})-[${identifier}:${edge.label}]->(${to})`);

    if (data) {
      const keys = Object.keys(data);
      this.lines.push(`    SET`);
      keys.forEach((key, index) => {
        const argKey = `${identifier}${key}`;
        this.lines.push(`      ${identifier}.${key}=$${argKey}${index < keys.length - 1 ? ',' : ''}`);
        this.args[argKey] = data[key as keyof typeof edge];
      });
    }
    return identifier;
  }

  node(node: Node): string {
    return this.mergeNode(node);
  }

  edge(from: string, edge: Edge, to: string): string {
    return this.mergeEdge(from, edge, to);
  }

  return(this: CypherQuery, ...identifiers: string[]): CypherQuery {
    if (identifiers.length === 1 && identifiers[0] === '*') {
      this.lines.push(`RETURN ${this.identifiers.join(',')}`);
    } else {
      this.lines.push(`RETURN ${identifiers.join(',')}`);
    }
    return this;
  }

  onCreateSet(identifier: string, data: Record<string, any>): CypherQuery {
    const keys = Object.keys(data);
    keys.forEach((key, index) => {
      const argKey = `${identifier}${key}`;
      this.lines.push(`SET ${argKey}=$${argKey}_${index < keys.length - 1 ? ',' : ''}`);
      this.args[argKey] = data[key];
    });
    return this;
  }

  onMatchDeleteRelationship(identifier: string): CypherQuery {
    this.lines.push(`DELETE ${identifier}`);
    return this;
  }

  merge(this: CypherQuery, from: Node, edge: Edge, to: string): CypherQuery;
  merge(this: CypherQuery, from: string, edge: Edge, to: string): CypherQuery;
  merge(this: CypherQuery, from: string, edge: Edge, to: Node): CypherQuery;
  merge(this: CypherQuery, from: Node, edge: Edge, to: Node): CypherQuery;
  merge(this: CypherQuery, node: Node): CypherQuery;
  merge(this: CypherQuery, from: Node | string, edge?: Edge, to?: Node | string): CypherQuery {
    const fromIdentifier = typeof from === 'string' ? from : this.mergeNode(from);
    const toIdentifier = typeof to === 'string' ? to : to != null ? this.mergeNode(to) : null;

    if (edge && toIdentifier) {
      this.mergeEdge(fromIdentifier, edge, toIdentifier);
    }
    return this;
  }

  match(this: CypherQuery, from: Node, edge: Edge, to: string): CypherQuery;
  match(this: CypherQuery, from: string, edge: Edge, to: string): CypherQuery;
  match(this: CypherQuery, from: string, edge: Edge, to: Node): CypherQuery;
  match(this: CypherQuery, from: Node, edge: Edge, to: Node): CypherQuery;
  match(this: CypherQuery, node: Node): CypherQuery;
  match(this: CypherQuery, from: Node | string, edge?: Edge, to?: Node | string): CypherQuery {
    const fromIdentifier = typeof from === 'string' ? from : this.matchNode(from.label, from.id);
    const toIdentifier = typeof to === 'string' ? to : !to ? null : this.matchNode(to.label, to.id);

    if (edge && toIdentifier) {
      this.matchEdge(fromIdentifier, edge, toIdentifier);
    }

    return this;
  }

  build(this: CypherQuery): [string, Record<string, any>] {
    return [this.lines.join('\n'), this.args];
  }

  with(this: CypherQuery, ...identifiers: string[]): CypherQuery {
    this.lines.push(`WITH ${identifiers.join(',')}`);
    return this;
  }
}
