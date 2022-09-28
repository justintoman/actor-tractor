const map = new Map();

export function wrapAndMap<T extends Record<string, (...args: any[]) => any>>(api: T): T {
  return Object.keys(api).reduce((wrapped, key) => {
    return {
      ...wrapped,
      [key]: async function (...args: any[]) {
        const mapKey = `${key}.${JSON.stringify(args)}`;
        if (map.has(mapKey)) {
          return map.get(mapKey);
        }
        const data = await api[key](...args);
        map.set(mapKey, data);
        return data;
      }
    };
  }, {}) as T;
}

export function queryString(parameters: Record<string, any>) {
  const searchParams = new URLSearchParams();
  Object.entries(parameters).forEach(([key, value]) => {
    if (value != null) {
      if (Array.isArray(value)) {
        value.forEach(v => {
          searchParams.append(key, v);
        });
      } else {
        searchParams.append(key, value);
      }
    }
  });
  return searchParams.toString();
}
