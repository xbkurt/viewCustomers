import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import CustomerContainer from "../redux/containers/customerContainer";
import Animated, {
  add,
  clockRunning,
  cond,
  debug,
  divide,
  eq,
  floor,
  not,
  set,
  useCode,
} from "react-native-reanimated";
import {
  snapPoint,
  timing,
  useClock,
  usePanGestureHandler,
  useValue,
} from "react-native-redash";

const { width, height } = Dimensions.get("window");

export const assets = [];

const Swiper = (props) => {
  const snapPoints = props.assetsProps.map((_, i) => i * -width);

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "black",
    },
    pictures: {
      width: width * props.assetsProps.length,
      height,
      flexDirection: "row",
    },
    picture: {
      width,
      height,
      overflow: "hidden",
    },
    image: {
      ...StyleSheet.absoluteFillObject,
      width: undefined,
      height: undefined,
    },
  });

  const [assetData, setAssetData] = useState([]);
  const clock = useClock();
  const index = useValue(0);
  const offsetX = useValue(0);
  const translateX = useValue(0);
  const {
    gestureHandler,
    state,
    velocity,
    translation,
  } = usePanGestureHandler();

  const to = snapPoint(translateX, velocity.x, snapPoints);
  useCode(
    () => [
      cond(eq(state, State.ACTIVE), [
        set(translateX, add(offsetX, translation.x)),
      ]),
      cond(eq(state, State.END), [
        set(translateX, timing({ clock, from: translateX, to })),
        set(offsetX, translateX),
        cond(not(clockRunning(clock)), [
          set(index, floor(divide(translateX, -width))),
          debug("index", index),
        ]),
      ]),
    ],
    []
  );
  return (
    <View style={styles.container}>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[styles.pictures, { transform: [{ translateX }] }]}
          >
            {props.assetsProps.map((source) => (
              <View key={source} style={styles.picture}>
                <Image style={styles.image} {...{ source }} />
              </View>
            ))}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Swiper;
