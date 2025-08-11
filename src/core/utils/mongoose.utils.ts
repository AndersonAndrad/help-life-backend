export const formatMongoDocuments = <T>(document: any, propertiesToDelete?: (keyof T)[]): T => {
  const obj = JSON.parse(JSON.stringify(document));

  const deleteProperties = (obj: any, properties?: (keyof T)[]) => {
    if (Array.isArray(obj)) {
      return obj.map((item) => deleteProperties(item, properties));
    } else if (obj && typeof obj === 'object') {
      if (!properties || !properties.length) return obj;

      properties.forEach((prop) => delete obj[prop]);

      return obj;
    }
    return obj;
  };

  return deleteProperties(obj, propertiesToDelete);
};
