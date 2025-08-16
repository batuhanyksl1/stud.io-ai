import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Crop, Move, ZoomIn } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ImageEditorProps {
  imageUri: string;
  onCropComplete: (croppedUri: string) => void;
}

export default function ImageEditor({ imageUri, onCropComplete }: ImageEditorProps) {
  const [mode, setMode] = useState<'crop' | 'move' | 'zoom'>('crop');
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      if (mode === 'move') {
        translateX.value = context.startX + event.translationX;
        translateY.value = context.startY + event.translationY;
      }
    },
    onEnd: () => {
      translateX.value = withSpring(translateX.value);
      translateY.value = withSpring(translateY.value);
    },
  });

  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startScale = scale.value;
    },
    onActive: (event, context) => {
      if (mode === 'zoom') {
        scale.value = Math.max(0.5, Math.min(3, context.startScale * event.scale));
      }
    },
    onEnd: () => {
      scale.value = withSpring(scale.value);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const resetTransform = () => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    scale.value = withSpring(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'crop' && styles.modeButtonActive]}
          onPress={() => setMode('crop')}
        >
          <Crop size={20} color={mode === 'crop' ? '#FFFFFF' : '#6B7280'} strokeWidth={2} />
          <Text style={[styles.modeText, mode === 'crop' && styles.modeTextActive]}>Crop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, mode === 'move' && styles.modeButtonActive]}
          onPress={() => setMode('move')}
        >
          <Move size={20} color={mode === 'move' ? '#FFFFFF' : '#6B7280'} strokeWidth={2} />
          <Text style={[styles.modeText, mode === 'move' && styles.modeTextActive]}>Move</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, mode === 'zoom' && styles.modeButtonActive]}
          onPress={() => setMode('zoom')}
        >
          <ZoomIn size={20} color={mode === 'zoom' ? '#FFFFFF' : '#6B7280'} strokeWidth={2} />
          <Text style={[styles.modeText, mode === 'zoom' && styles.modeTextActive]}>Zoom</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.editorContainer}>
        <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
          <Animated.View style={styles.gestureContainer}>
            <PanGestureHandler onGestureEvent={panGestureHandler}>
              <Animated.View style={[styles.imageWrapper, animatedStyle]}>
                <Image source={{ uri: imageUri }} style={styles.image} />
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </PinchGestureHandler>

        <View style={styles.cropOverlay}>
          <View style={styles.cropCircle} />
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          {mode === 'crop' && 'Position your face within the circle'}
          {mode === 'move' && 'Drag to reposition the image'}
          {mode === 'zoom' && 'Pinch to zoom in or out'}
        </Text>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetTransform}>
        <Text style={styles.resetButtonText}>Reset Position</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: '#0077B5',
  },
  modeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  modeTextActive: {
    color: '#FFFFFF',
  },
  editorContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  gestureContainer: {
    flex: 1,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width - 48,
    height: width - 48,
    borderRadius: 20,
  },
  cropOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cropCircle: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    borderWidth: 3,
    borderColor: '#0077B5',
    borderStyle: 'dashed',
  },
  instructions: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0077B5',
  },
});
