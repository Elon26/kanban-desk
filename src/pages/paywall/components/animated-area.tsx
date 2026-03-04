import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { useEffect, useRef, useState } from 'react';
import { View, Animated } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import AppIconImage from '@/images/paywall/app-icon.png';
import BroomstickImage from '@/images/paywall/broomstick.png';
import ContactsIconImage from '@/images/paywall/contacts-icon.png';
import FourStarsImage from '@/images/paywall/four-stars.png';
import ImageIconImage from '@/images/paywall/image-icon.png';
import NoteIconImage from '@/images/paywall/note-icon.png';
import OneBigStarImage from '@/images/paywall/one-big-star.png';
import OneSmallStarImage from '@/images/paywall/one-small-star.png';
import PhotosIconImage from '@/images/paywall/photos-icon.png';
import { Image } from 'expo-image';

export default function AnimatedArea() {
  const strokeWidth = scaleX(12);
  const size = scaleY(180);
  const duration = 3000;
  const bgColor = '#F1F1F11F';

  const animatedBroomstick = useRef(new Animated.Value(-10));
  const animatedScale = useRef(new Animated.Value(0.7));
  const animatedAppIconTop = useRef(new Animated.Value(0));
  const animatedImageIconTop = useRef(new Animated.Value(-10));
  const animatedImageIconLeft = useRef(new Animated.Value(0));
  const animatedImageIconRotate = useRef(new Animated.Value(0));
  const animatedNoteIconTop = useRef(new Animated.Value(0));
  const animatedNoteIconLeft = useRef(new Animated.Value(0));
  const animatedContactsIconTop = useRef(new Animated.Value(0));
  const animatedContactsIconLeft = useRef(new Animated.Value(0));
  const animatedPhotosIconTop = useRef(new Animated.Value(0));
  const animatedPhotosIconLeft = useRef(new Animated.Value(0));
  const animatedPhotosIconRotate = useRef(new Animated.Value(0));
  const animatedOneSmallStarTop = useRef(new Animated.Value(0));
  const animatedOneSmallStarLeft = useRef(new Animated.Value(0));
  const animatedOneBigStarTop = useRef(new Animated.Value(0));
  const animatedOneBigStarLeft = useRef(new Animated.Value(0));
  const animatedFourStarsTop = useRef(new Animated.Value(0));
  const animatedFourStarsLeft = useRef(new Animated.Value(0));
  const animatedPercent = useRef(new Animated.Value(93));
  const [currentPercent, setCurrentPercent] = useState(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(animatedBroomstick.current, {
        toValue: 50,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(animatedBroomstick.current, {
        toValue: -10,
        duration: duration / 2,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(animatedScale.current, {
      toValue: 1.5,
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedAppIconTop.current, {
      toValue: scaleY(80),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedImageIconTop.current, {
      toValue: scaleY(20),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedImageIconLeft.current, {
      toValue: scaleY(-90),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedImageIconRotate.current, {
      toValue: scaleY(120),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedNoteIconTop.current, {
      toValue: scaleY(-40),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedNoteIconLeft.current, {
      toValue: scaleY(20),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedContactsIconTop.current, {
      toValue: scaleY(-20),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedContactsIconLeft.current, {
      toValue: scaleY(30),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedPhotosIconTop.current, {
      toValue: scaleY(-80),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedPhotosIconLeft.current, {
      toValue: scaleY(-80),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedPhotosIconRotate.current, {
      toValue: scaleY(170),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedOneSmallStarTop.current, {
      toValue: scaleY(-50),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedOneSmallStarLeft.current, {
      toValue: scaleY(70),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedOneBigStarTop.current, {
      toValue: scaleY(-100),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedOneBigStarLeft.current, {
      toValue: scaleY(-20),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedFourStarsTop.current, {
      toValue: scaleY(60),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedFourStarsLeft.current, {
      toValue: scaleY(90),
      duration: duration,
      useNativeDriver: true,
    }).start();

    Animated.timing(animatedPercent.current, {
      toValue: 20,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [duration]);

  useEffect(() => {
    const listener = animatedPercent.current.addListener(({ value }) => {
      setCurrentPercent(value);
    });
    return () => animatedPercent.current.removeListener(listener);
  }, [animatedPercent]);

  const broomstickRotate = animatedBroomstick.current.interpolate({
    inputRange: [-10, 50],
    outputRange: ['-10deg', '50deg'],
  });

  const imageIconRotate = animatedImageIconRotate.current.interpolate({
    inputRange: [0, 120],
    outputRange: ['0deg', '120deg'],
  });

  const photosIconRotate = animatedPhotosIconRotate.current.interpolate({
    inputRange: [0, 170],
    outputRange: ['0deg', '170deg'],
  });

  return (
    <View
      className="items-center justify-center mt-5"
      style={{ height: scaleY(232) }}
    >
      <View
        className="rounded-full border border-blue bg-[#449CF526]"
        style={{ height: scaleY(232), width: scaleY(232) }}
      />

      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          size={size}
          width={strokeWidth}
          fill={currentPercent}
          tintColor={
            currentPercent > 75
              ? '#E53C3C'
              : currentPercent > 50
                ? '#F7BE63'
                : '#30D079'
          }
          backgroundColor={bgColor}
          rotation={0}
        />
      </View>

      <View
        className="insets-0 absolute rounded-full bg-[#180d26]"
        style={{ height: scaleY(156), width: scaleY(156) }}
      />

      <View className="insets-0 absolute">
        <Animated.View
          style={{
            transform: [{ rotate: broomstickRotate }],
          }}
        >
          <Image
            source={BroomstickImage}
            contentFit="contain"
            style={{
              width: scaleX(61),
              height: scaleY(81),
              left: scaleY(-10),
            }}
          />
        </Animated.View>
      </View>

      <View className="insets-0 absolute">
        <Animated.View
          style={{
            transform: [
              { scale: animatedScale.current },
              { translateY: animatedAppIconTop.current },
            ],
          }}
        >
          <Image
            source={AppIconImage}
            contentFit="contain"
            style={{
              width: scaleY(30),
              height: scaleY(30),
              left: scaleX(10),
            }}
          />
        </Animated.View>
      </View>

      <View className="insets-0 absolute">
        <Animated.View
          style={{
            transform: [
              { scale: animatedScale.current },
              { translateY: animatedImageIconTop.current },
              { translateX: animatedImageIconLeft.current },
              { rotate: imageIconRotate },
            ],
          }}
        >
          <Image
            source={ImageIconImage}
            contentFit="contain"
            style={{
              width: scaleY(30),
              height: scaleY(30),
              left: scaleX(10),
              top: scaleY(-20),
            }}
          />
        </Animated.View>
      </View>

      <View className="insets-0 absolute">
        <Animated.View
          style={{
            transform: [
              { scale: animatedScale.current },
              { translateY: animatedNoteIconTop.current },
              { translateX: animatedNoteIconLeft.current },
            ],
          }}
        >
          <Image
            source={NoteIconImage}
            contentFit="contain"
            style={{
              width: scaleY(30),
              height: scaleY(30),
              left: scaleX(30),
              top: scaleY(-20),
            }}
          />
        </Animated.View>
      </View>

      <View className="insets-0 absolute">
        <Animated.View
          style={{
            transform: [
              { scale: animatedScale.current },
              { translateY: animatedContactsIconTop.current },
              { translateX: animatedContactsIconLeft.current },
            ],
          }}
        >
          <Image
            source={ContactsIconImage}
            contentFit="contain"
            style={{
              width: scaleY(30),
              height: scaleY(30),
              left: scaleX(50),
              top: scaleY(10),
            }}
          />
        </Animated.View>
      </View>

      <View className="insets-0 absolute">
        <Animated.View
          style={{
            transform: [
              { scale: animatedScale.current },
              { translateY: animatedPhotosIconTop.current },
              { translateX: animatedPhotosIconLeft.current },
              { rotate: photosIconRotate },
            ],
          }}
        >
          <Image
            source={PhotosIconImage}
            contentFit="contain"
            style={{
              width: scaleY(30),
              height: scaleY(30),
              left: scaleX(0),
              top: scaleY(-40),
              borderRadius: 40,
            }}
          />
        </Animated.View>
      </View>

      <View className="insets-0 absolute">
        <Animated.View
          style={{
            transform: [
              { translateY: animatedOneSmallStarTop.current },
              { translateX: animatedOneSmallStarLeft.current },
            ],
          }}
        >
          <Image
            source={OneSmallStarImage}
            contentFit="contain"
            style={{
              width: scaleY(5),
              height: scaleY(5),
              left: scaleX(40),
              top: scaleY(-10),
            }}
          />
        </Animated.View>
      </View>

      <View className="insets-0 absolute">
        <Animated.View
          style={{
            transform: [
              { translateY: animatedOneBigStarTop.current },
              { translateX: animatedOneBigStarLeft.current },
            ],
          }}
        >
          <Image
            source={OneBigStarImage}
            contentFit="contain"
            style={{
              width: scaleY(10),
              height: scaleY(10),
              left: scaleX(-10),
              top: scaleY(-30),
            }}
          />
        </Animated.View>
      </View>

      <View className="insets-0 absolute">
        <Animated.View
          style={{
            transform: [
              { translateY: animatedFourStarsTop.current },
              { translateX: animatedFourStarsLeft.current },
            ],
          }}
        >
          <Image
            source={FourStarsImage}
            contentFit="contain"
            style={{
              width: scaleY(20),
              height: scaleY(20),
              left: scaleX(20),
              top: scaleY(20),
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
}
