export interface CloudCredentials {
  id: string;
  provider: string;
  name: string;
  credentials: Record<string, string>;
  isConfigured: boolean;
  createdAt: Date;
}

export const getConfiguredProviders = (): CloudCredentials[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedCredentials = localStorage.getItem("cloudCredentials");
    if (savedCredentials) {
      const parsed = JSON.parse(savedCredentials);
      return parsed.map((cred: any) => ({
        ...cred,
        createdAt: new Date(cred.createdAt)
      }));
    }
  } catch (error) {
    console.error("Error parsing saved credentials:", error);
  }
  
  return [];
};

export const isProviderConfigured = (providerId: string): boolean => {
  const configuredProviders = getConfiguredProviders();
  return configuredProviders.some(provider => 
    provider.provider.toLowerCase() === providerId.toLowerCase()
  );
};

export const getProviderCredentials = (providerId: string): CloudCredentials | null => {
  const configuredProviders = getConfiguredProviders();
  return configuredProviders.find(provider => 
    provider.provider.toLowerCase() === providerId.toLowerCase()
  ) || null;
};
