export interface Role {
  id: string;
  label: string;
  family: RoleFamily;
  active: boolean;
}

export type RoleFamily = "bar" | "service" | "management" | "kitchen";

export interface ResponsibilityGroup {
  name: string;
  items: Array<{
    id: string;
    label: string;
    tags: string[];
  }>;
}

export interface ScenarioItem {
  id: string;
  label: string;
  tags?: string[];
}

export interface VibeItem {
  id: string;
  label: string;
  tags?: string[];
}

export interface ContentPack {
  version: string;
  family: RoleFamily;
  shine: string[];
  scenarios: ScenarioItem[];
  vibe: VibeItem[];
  responsibilities: ResponsibilityGroup[];
}

