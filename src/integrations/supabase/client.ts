// Enhanced Supabase client with proper fallback implementation
// This provides a complete mock interface when Supabase is not configured

interface MockSupabaseResponse<T = any> {
  data: T | null;
  error: any;
}

interface MockSupabaseAuth {
  getUser(): Promise<MockSupabaseResponse<{ user: any }>>;
  signOut(): Promise<MockSupabaseResponse>;
  getSession(): Promise<MockSupabaseResponse<{ session: any }>>;
  signInWithPassword(credentials: any): Promise<MockSupabaseResponse<{ user: any }>>;
  signUp(credentials: any): Promise<MockSupabaseResponse<{ user: any }>>;
  resetPasswordForEmail(email: string): Promise<MockSupabaseResponse>;
  onAuthStateChange(callback: (event: string, session: any) => void): { data: { subscription: { unsubscribe: () => void } } };
}

interface MockSupabaseQueryBuilder {
  select(columns?: string): MockSupabaseQueryBuilder;
  insert(values: any): MockSupabaseQueryBuilder;
  update(values: any): MockSupabaseQueryBuilder;
  delete(): MockSupabaseQueryBuilder;
  eq(column: string, value: any): MockSupabaseQueryBuilder;
  neq(column: string, value: any): MockSupabaseQueryBuilder;
  gt(column: string, value: any): MockSupabaseQueryBuilder;
  gte(column: string, value: any): MockSupabaseQueryBuilder;
  lt(column: string, value: any): MockSupabaseQueryBuilder;
  lte(column: string, value: any): MockSupabaseQueryBuilder;
  like(column: string, pattern: string): MockSupabaseQueryBuilder;
  ilike(column: string, pattern: string): MockSupabaseQueryBuilder;
  is(column: string, value: any): MockSupabaseQueryBuilder;
  in(column: string, values: any[]): MockSupabaseQueryBuilder;
  contains(column: string, value: any): MockSupabaseQueryBuilder;
  containedBy(column: string, value: any): MockSupabaseQueryBuilder;
  rangeGt(column: string, value: any): MockSupabaseQueryBuilder;
  rangeGte(column: string, value: any): MockSupabaseQueryBuilder;
  rangeLt(column: string, value: any): MockSupabaseQueryBuilder;
  rangeLte(column: string, value: any): MockSupabaseQueryBuilder;
  rangeAdjacent(column: string, value: any): MockSupabaseQueryBuilder;
  overlaps(column: string, value: any): MockSupabaseQueryBuilder;
  textSearch(column: string, query: string): MockSupabaseQueryBuilder;
  match(query: Record<string, any>): MockSupabaseQueryBuilder;
  not(column: string, operator: string, value: any): MockSupabaseQueryBuilder;
  or(filters: string): MockSupabaseQueryBuilder;
  filter(column: string, operator: string, value: any): MockSupabaseQueryBuilder;
  order(column: string, options?: { ascending?: boolean }): MockSupabaseQueryBuilder;
  limit(count: number): MockSupabaseQueryBuilder;
  range(from: number, to: number): MockSupabaseQueryBuilder;
  single(): Promise<MockSupabaseResponse>;
  maybeSingle(): Promise<MockSupabaseResponse>;
  csv(): Promise<MockSupabaseResponse<string>>;
  then<TResult1 = MockSupabaseResponse, TResult2 = never>(
    onfulfilled?: ((value: MockSupabaseResponse) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2>;
}

interface MockSupabaseClient {
  auth: MockSupabaseAuth;
  from(table: string): MockSupabaseQueryBuilder;
  rpc(fn: string, args?: any): Promise<MockSupabaseResponse>;
  storage: {
    from(bucketId: string): {
      upload(path: string, file: File): Promise<MockSupabaseResponse>;
      download(path: string): Promise<MockSupabaseResponse<Blob>>;
      remove(paths: string[]): Promise<MockSupabaseResponse>;
      list(path?: string): Promise<MockSupabaseResponse<any[]>>;
      getPublicUrl(path: string): { data: { publicUrl: string } };
    };
  };
}

// Create a comprehensive mock implementation
const createMockSupabaseClient = (): MockSupabaseClient => {
  const mockResponse = <T = any>(data: T | null = null, error: any = null): MockSupabaseResponse<T> => ({
    data,
    error
  });

  const createQueryBuilder = (): MockSupabaseQueryBuilder => {
    const builder: MockSupabaseQueryBuilder = {
      select: () => builder,
      insert: () => builder,
      update: () => builder,
      delete: () => builder,
      eq: () => builder,
      neq: () => builder,
      gt: () => builder,
      gte: () => builder,
      lt: () => builder,
      lte: () => builder,
      like: () => builder,
      ilike: () => builder,
      is: () => builder,
      in: () => builder,
      contains: () => builder,
      containedBy: () => builder,
      rangeGt: () => builder,
      rangeGte: () => builder,
      rangeLt: () => builder,
      rangeLte: () => builder,
      rangeAdjacent: () => builder,
      overlaps: () => builder,
      textSearch: () => builder,
      match: () => builder,
      not: () => builder,
      or: () => builder,
      filter: () => builder,
      order: () => builder,
      limit: () => builder,
      range: () => builder,
      single: () => Promise.resolve(mockResponse(null)),
      maybeSingle: () => Promise.resolve(mockResponse(null)),
      csv: () => Promise.resolve(mockResponse('')),
      then: (onfulfilled, onrejected) => {
        const promise = Promise.resolve(mockResponse([]));
        return promise.then(onfulfilled, onrejected);
      }
    };
    return builder;
  };

  return {
    auth: {
      getUser: () => Promise.resolve(mockResponse({ user: null })),
      signOut: () => Promise.resolve(mockResponse(null)),
      getSession: () => Promise.resolve(mockResponse({ session: null })),
      signInWithPassword: () => Promise.resolve(mockResponse({ user: null })),
      signUp: () => Promise.resolve(mockResponse({ user: null })),
      resetPasswordForEmail: () => Promise.resolve(mockResponse(null)),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      })
    },
    from: () => createQueryBuilder(),
    rpc: () => Promise.resolve(mockResponse(null)),
    storage: {
      from: () => ({
        upload: () => Promise.resolve(mockResponse(null)),
        download: () => Promise.resolve(mockResponse(new Blob())),
        remove: () => Promise.resolve(mockResponse(null)),
        list: () => Promise.resolve(mockResponse([])),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  };
};

// Export the mock client
export const supabase = createMockSupabaseClient();

export const isSupabaseConfigured = (): boolean => {
  // Always return false since this is a mock implementation
  return false;
};

// Legacy compatibility note
export const legacySupabaseNote = `
This project has been migrated to use Firebase as the primary authentication provider.
Supabase integration has been replaced with a comprehensive mock implementation for compatibility.
All authentication now flows through Firebase with comprehensive security features.
The mock Supabase client provides full API compatibility for existing code.
`;

// Type exports for compatibility
export type { MockSupabaseClient as SupabaseClient, MockSupabaseResponse as SupabaseResponse };