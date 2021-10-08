export interface Data {
  aValue: string;
  nestedValues: NestedData[];
}

export interface NestedData {
  id: number;
  aNestedValue: string;
  aDependantValue: string;
}
