export interface Data {
  aValue: string;
  nestedValues: NestedData[];
}

export interface NestedData {
  aNestedValue: string;
  aDependantValue: string;
}
