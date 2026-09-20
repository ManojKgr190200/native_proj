declare module 'react-native-config' {
  export interface NativeConfig {
    API_URL?: string;
    APP_NAME?: string;
    ENV?: string;
    [key: string]: string | undefined;
  }

  export const Config: NativeConfig;
  export default Config;
}
