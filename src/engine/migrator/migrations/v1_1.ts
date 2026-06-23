export function migrateFrom1_1_to_1_2(config: any): any {
  const newConfig = JSON.parse(JSON.stringify(config));
  newConfig.schemaVersion = "1.2";
  
  // Example migration: 'views' elements getting 'id' if missing
  if (Array.isArray(newConfig.views)) {
    newConfig.views = newConfig.views.map((view: any) => {
      if (!view.id && view.name) {
         view.id = view.name.toLowerCase().replace(/\s+/g, '-');
      }
      return view;
    });
  }

  return newConfig;
}
