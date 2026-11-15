import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/** Ekranlar va ularga uzatiladigan parametrlar. */
export type RootStackParamList = {
  Canvas: { openDrawingId?: string } | undefined;
  Gallery: undefined;
  Viewer: { id: string };
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
