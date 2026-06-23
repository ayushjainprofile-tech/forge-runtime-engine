import { componentRegistry } from "../registry";
import { CardComponent } from "./components/Card";
import { TextComponent } from "./components/Text";
import { DashboardComponent } from "./components/Dashboard";
import { FormComponent } from "./components/Form";

export function registerAllComponents() {
  componentRegistry.register("Card", CardComponent);
  componentRegistry.register("Text", TextComponent);
  componentRegistry.register("Dashboard", DashboardComponent);
  componentRegistry.register("Form", FormComponent);
  // Unknown components implicitly get the Fallback via the registry
}
