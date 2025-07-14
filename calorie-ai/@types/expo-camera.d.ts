import 'expo-camera';
import { ComponentType } from 'react';
import { PermissionResponse } from 'expo-modules-core';
import { CameraProps } from 'expo-camera';

declare module 'expo-camera' {
  interface Camera extends import('expo-camera').Camera {
    takePictureAsync(options?: { quality?: number }): Promise<{ uri: string }>;
    getCameraPermissionsAsync(): Promise<PermissionResponse>;
    requestCameraPermissionsAsync(): Promise<PermissionResponse>;
    getMicrophonePermissionsAsync(): Promise<PermissionResponse>;
    requestMicrophonePermissionsAsync(): Promise<PermissionResponse>;
  }
}

declare const Camera: ComponentType<CameraProps> & import('expo-camera').Camera;

export default Camera;
