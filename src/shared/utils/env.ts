export const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (!value) {
      console.warn(`환경변수 ${key}를 불러올 수 없습니다.`);
      return defaultValue || '';
    }
    console.log(`Env Var - ${key}: ${value}`);
    return value;
  };
    
    // 각 환경변수별 getter 함수들
    export const getApiBaseUrl = (): string => {
      return getEnvVar('API_BASE_URL');
    };
    
    export const getOpenAIKey = (): string => {
      return getEnvVar('OPENAI_API_KEY');
    };
    
    export const getTossSecretKey = (): string  => {
      return getEnvVar('TOSS_SECRET_KEY');
    };

    export const getCloudinaryCloudName = (): string => {
        return getEnvVar('CLOUDINARY_CLOUD_NAME');
    };

    export const getCloudinaryApiKey = (): string => {
        return getEnvVar('CLOUDINARY_API_KEY');
    };

    export const getCloudinaryApiSecret = (): string => {
        return getEnvVar('CLOUDINARY_API_SECRET');
    };
      
    export const getFirebaseServiceAccount = (): string  => {
        return getEnvVar('FIREBASE_SERVICE_ACCOUNT');
    };
    
    // 개발 환경 체크
    export const isDevelopment = (): boolean => {
      return getEnvVar('NODE_ENV') === 'development';
    };
    
    export const isProduction = (): boolean => {
      return getEnvVar('NODE_ENV') === 'production';
    };
  
  