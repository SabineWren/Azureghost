export type EmptyRecord = Record<PropertyKey, never>

export type NotMap<T> = T extends Map<any, any> ? never : T
