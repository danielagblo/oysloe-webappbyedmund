const normalizePossibleFeatureValues = (raw: any, fid?: number): string[] => {
  const unwrap = (v: any) => {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      if ("data" in v) return v.data;
      if ("results" in v) return v.results;
    }
    return v;
  };

  const extract = (item: any): string | null => {
    if (item == null) return null;

    if (typeof item === "string") return item.trim();
    if (typeof item === "number") return String(item);

    if (typeof item === "object") {
      if (typeof item.value === "string") return item.value.trim();
      if (typeof item.name === "string") return item.name.trim();
    }

    return null;
  };

  const cleanArray = (arr: any[]): string[] => {
    const values = arr.map(extract).filter((v): v is string => !!v);
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
  };

  const res = unwrap(raw);

  if (res && typeof res === "object" && !Array.isArray(res)) {
    if (fid !== undefined && Array.isArray(res[String(fid)])) {
      return cleanArray(res[String(fid)]);
    }

    if (Array.isArray(res.values)) return cleanArray(res.values);
    if (Array.isArray(res.values_list)) return cleanArray(res.values_list);
    if (Array.isArray(res.options)) return cleanArray(res.options);
  }

  if (Array.isArray(res)) {
    return cleanArray(res);
  }

  return [];
}
export default normalizePossibleFeatureValues;