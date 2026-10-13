export function getId(): string {
  return Date.now().toString(36) + Math.random().toString(36);
}

export function findNestedValue(entireObj: Record<string, any>, keyToFind: string) {
  let foundObj;
  JSON.stringify(entireObj, (_, nestedValue) => {
    if (nestedValue && nestedValue[keyToFind]) {
      foundObj = nestedValue[keyToFind];
    }
    return nestedValue;
  });
  return foundObj;
}
