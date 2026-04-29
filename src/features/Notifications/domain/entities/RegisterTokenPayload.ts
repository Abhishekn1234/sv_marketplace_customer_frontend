export interface RegisterDeviceTokenPayload {
  token: string;
  platform: "ANDROID" | "IOS" | "WEB";
  roleId: string;
  deviceId: string;
  appId: string;
}