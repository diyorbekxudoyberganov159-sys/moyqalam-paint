import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Asbob tanlanganda yengil tebranish (telefonda sezilarli "premium" his beradi). Webda o'chiq. */
export function tapFeedback() {
  if (Platform.OS === 'web') {
    return;
  }
  Haptics.selectionAsync().catch(() => {});
}
