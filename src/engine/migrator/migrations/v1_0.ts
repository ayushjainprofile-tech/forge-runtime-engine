export function migrateFrom1_0_to_1_1(config: any): any {
  // Deep clone to ensure purity
  const newConfig = JSON.parse(JSON.stringify(config));
  newConfig.schemaVersion = "1.1";
  
  // Example migration: 'pages' -> 'views'
  if (newConfig.pages) {
    newConfig.views = newConfig.pages;
    delete newConfig.pages;
  }

  return newConfig;
}
