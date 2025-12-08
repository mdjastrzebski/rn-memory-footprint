import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput as RNTextInput,
  Switch as RNSwitch,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getMemoryUsage } from 'react-native-performance-toolkit';
import { Button } from './src/Button';
import { NumericTextInput } from './src/NumericTextInput';
import { MemorySummary } from './src/MemorySummary';
import { DropDown } from './src/DropDown';

const COMPONENT_TYPES = [
  'View',
  'ViewNativeComponent',
  'Text',
  'TextNativeComponent',
  'TextInput',
  'Switch',
];

type ComponentType = (typeof COMPONENT_TYPES)[number];

const warmupMemoryUsage = getMemoryUsage() * 1024 * 1024;
console.log('Warmup memory usage', warmupMemoryUsage);

export default function MemoryTestScreen() {
  const [memoryValue, setMemoryValue] = React.useState(0);
  const [beforeValue, setBeforeValue] = React.useState(0);
  const [afterValue, setAfterValue] = React.useState(0);
  const [isDirty, setIsDirty] = React.useState(false);
  const [viewCount, setViewCount] = React.useState('1000');
  const [selectedComponent, setSelectedComponent] =
    React.useState<ComponentType>('View');

  const [viewsToRender, setViewsToRender] = React.useState<
    React.ReactElement[]
  >([]);

  const handleCreate = () => {
    console.log('Creating views', getMemoryUsage() * 1024 * 1024);
    const initialMemoryUsage = getMemoryUsage() * 1024 * 1024;

    const count = parseInt(viewCount, 10);
    if (isNaN(count) || count <= 0) {
      console.log('Invalid view count');
      return;
    }

    const newViews = createViews(selectedComponent, count);
    setViewsToRender(newViews);
    console.log(`Created ${count} ${selectedComponent} components`);

    setTimeout(() => {
      const currentMemoryUsage = getMemoryUsage() * 1024 * 1024;
      setBeforeValue(initialMemoryUsage);
      setAfterValue(currentMemoryUsage);
      setMemoryValue(currentMemoryUsage - initialMemoryUsage);
    }, 1000);
  };

  const handleClear = () => {
    const initialMemoryUsage = getMemoryUsage() * 1024 * 1024;
    setViewsToRender([]);
    console.log('Cleared all views');

    setTimeout(() => {
      const currentMemoryUsage = getMemoryUsage() * 1024 * 1024;
      setBeforeValue(initialMemoryUsage);
      setAfterValue(currentMemoryUsage);
      setMemoryValue(currentMemoryUsage - initialMemoryUsage);
    }, 1000);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <MemorySummary
            value={memoryValue}
            before={beforeValue}
            after={afterValue}
            dirty={isDirty}
          />

          <DropDown
            label="Component Type"
            value={selectedComponent}
            options={COMPONENT_TYPES}
            onSelect={setSelectedComponent}
          />

          <NumericTextInput
            label="View Count"
            value={viewCount}
            onChangeText={setViewCount}
            placeholder="Enter view count"
          />

          <View style={styles.buttonContainer}>
            <Button variant="primary" onPress={handleCreate}>
              Create Views
            </Button>
            <Button variant="secondary" onPress={handleClear}>
              Clear
            </Button>
          </View>

          <View style={styles.viewsContainer}>{viewsToRender}</View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  viewsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e8f4fd',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 14,
    color: '#9bb8d3',
    fontStyle: 'italic',
  },
  createdView: {
    backgroundColor: '#e8f4fd',
    minWidth: 100,
    minHeight: 50,
    borderColor: '#b8d9f5',
    margin: 4,
  },
  createdText: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    margin: 4,
  },
  createdTextInput: {
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
});

const createViews = (
  type: ComponentType,
  count: number,
): React.ReactElement[] => {
  switch (type) {
    case 'View':
      return Array.from({ length: count }, (_, i) => {
        const key = `${type}-${i}`;
        return <View key={key} style={styles.createdView} />;
      });

    case 'ViewNativeComponent':
      return Array.from({ length: count }, (_, i) => {
        const key = `${type}-${i}`;
        return <View key={key} style={[styles.createdView]} />;
      });

    case 'Text':
      return Array.from({ length: count }, (_, i) => {
        const key = `${type}-${i}`;
        return (
          <Text key={key} style={styles.createdText}>
            Text Component #{i + 1}
          </Text>
        );
      });

    case 'TextNativeComponent':
      return Array.from({ length: count }, (_, i) => {
        const key = `${type}-${i}`;
        return (
          <Text key={key} style={[styles.createdText]}>
            TextNative #{i + 1}
          </Text>
        );
      });

    case 'TextInput':
      return Array.from({ length: count }, (_, i) => {
        const key = `${type}-${i}`;
        return (
          <RNTextInput
            key={key}
            style={styles.createdTextInput}
            placeholder={`TextInput #${i + 1}`}
            placeholderTextColor="#9bb8d3"
            editable={false}
          />
        );
      });

    case 'Switch':
      return Array.from({ length: count }, (_, i) => {
        const key = `${type}-${i}`;
        return (
          <RNSwitch
            key={key}
            value={false}
            disabled={true}
            trackColor={{ false: '#d6ebff', true: '#4a90e2' }}
            thumbColor="#ffffff"
          />
        );
      });

    default:
      return [];
  }
};
