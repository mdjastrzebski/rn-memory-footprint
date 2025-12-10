import * as React from 'react';
import { View, Text, StyleSheet, TextInput, Switch, Image } from 'react-native';
import { css, html } from 'react-strict-dom';

// @ts-expect-error
// eslint-disable-next-line @react-native/no-deep-imports
import ViewNativeComponent from 'react-native/Libraries/Components/View/ViewNativeComponent';
// @ts-expect-error
// eslint-disable-next-line @react-native/no-deep-imports
import { NativeText } from 'react-native/Libraries/Text/TextNativeComponent';

export const viewFactory = {
  View: (count: number) => {
    return range(count).map(i => <View key={i} style={styles.view} />);
  },
  ViewNativeComponent: (count: number) => {
    return range(count).map(i => (
      <ViewNativeComponent key={i} style={styles.view} />
    ));
  },
  Text: (count: number) => {
    return range(count).map(i => (
      <Text key={i} style={styles.text}>
        Text Content #{i + 1}
      </Text>
    ));
  },
  TextNative: (count: number) => {
    return range(count).map(i => (
      <NativeText key={i} style={styles.text}>
        Text Content #{i + 1}
      </NativeText>
    ));
  },
  'Text (Large Font)': (count: number) => {
    return range(count).map(i => (
      <Text key={i} style={styles.textLarge}>
        Text Content #{i + 1}
      </Text>
    ));
  },
  TextInput: (count: number) => {
    return range(count).map(i => (
      <TextInput
        key={i}
        style={styles.textInput}
        placeholder={`Text Content #${i + 1}`}
        value={`Text Content #${i + 1}`}
      />
    ));
  },
  Switch: (count: number) => {
    return range(count).map(i => (
      <Switch
        key={i}
        value={false}
        disabled={true}
        trackColor={{ false: '#d6ebff', true: '#4a90e2' }}
        thumbColor="#ffffff"
      />
    ));
  },

  'Image (150x50@2x)': (count: number) => {
    return range(count).map(i => (
      <Image
        key={i}
        source={{
          uri: `https://placehold.co/150x50@2x.png?id=${i}`,
          width: 150,
          height: 50,
        }}
        style={styles.image}
      />
    ));
  },
  'Image (150x50@2x) - empty': (count: number) => {
    return range(count).map(i => (
      <Image
        key={i}
        source={require('../assets/res2-150x50.png')}
        style={styles.image}
      />
    ));
  },
  'Image (300x100)': (count: number) => {
    return range(count).map(i => (
      <Image
        key={i}
        source={require('../assets/res1-300x100.png')}
        style={styles.image}
      />
    ));
  },
  'Image (300x100@2x)': (count: number) => {
    return range(count).map(i => (
      <Image
        key={i}
        source={require('../assets/res2-300x100.png')}
        style={styles.image}
      />
    ));
  },
  'RSD <div>': (count: number) => {
    return range(count).map(i => <html.div key={i} style={cssStyles.view} />);
  },
  'RSD <span> with text': (count: number) => {
    return range(count).map(i => (
      <html.span key={i} style={cssStyles.text}>
        Span Component #{i + 1}
      </html.span>
    ));
  },
  'RSD <span> with text (Large Font)': (count: number) => {
    return range(count).map(i => (
      <html.span key={i} style={cssStyles.textLarge}>
        Span Component #{i + 1}
      </html.span>
    ));
  },
};

function range(count: number) {
  return Array.from({ length: count }, (_, i) => i);
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#e8f4fd',
    minWidth: 100,
    minHeight: 50,
    borderColor: '#b8d9f5',
    margin: 4,
  },
  text: {
    backgroundColor: '#f0f8ff',
    fontSize: 16,
    padding: 8,
    margin: 4,
  },
  textLarge: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    fontSize: 28,
    color: '#2c5f8d',
    margin: 4,
  },
  textInput: {
    backgroundColor: '#ffffff',
    padding: 10,
    fontSize: 12,
    color: '#2c5f8d',
    borderWidth: 1,
    borderColor: '#d6ebff',
    minWidth: 120,
    minHeight: 50,
    margin: 4,
  },
  image: {
    margin: 4,
  },
});

const cssStyles = css.create({
  view: {
    backgroundColor: '#e8f4fd',
    minWidth: 100,
    minHeight: 50,
    borderColor: '#b8d9f5',
    margin: 4,
  },
  text: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    fontSize: 16,
    color: '#2c5f8d',
    margin: 4,
  },
  textLarge: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    fontSize: 28,
    color: '#2c5f8d',
    margin: 4,
  },
});
