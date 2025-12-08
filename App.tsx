import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput as RNTextInput,
  Switch as RNSwitch,
} from 'react-native';
import ViewNativeComponent from 'react-native/Libraries/Components/View/ViewNativeComponent';
import { NativeText } from 'react-native/Libraries/Text/TextNativeComponent';
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
  'Text - Large Font',
  'TextInput',
  'Switch',
];

const warmupMemoryFootprint = getMemoryFootprint();
console.log('Warmup memory footprint', warmupMemoryFootprint);

type ComponentType = (typeof COMPONENT_TYPES)[number];

export default function MemoryTestScreen() {
  const [memoryValue, setMemoryValue] = React.useState(0);
  const [beforeValue, setBeforeValue] = React.useState(0);
  const [afterValue, setAfterValue] = React.useState(0);
  const [measurementCount, setMeasurementCount] = React.useState(0);

  const [viewCount, setViewCount] = React.useState('5000');
  const [selectedComponent, setSelectedComponent] =
    React.useState<ComponentType>('View');

  const [viewsToRender, setViewsToRender] = React.useState<
    React.ReactElement[]
  >([]);
  const [baselineMemoryFootprint, setBaselineMemoryUsage] = React.useState(0);
  const [isLoading, startTransition] = React.useTransition();

  React.useEffect(() => {
    setTimeout(() => {
      if (baselineMemoryFootprint === 0 || isLoading) return;

      const currentMemoryFootprint = getMemoryFootprint();
      setBeforeValue(baselineMemoryFootprint);
      setAfterValue(currentMemoryFootprint);
      setMemoryValue(currentMemoryFootprint - baselineMemoryFootprint);
      setMeasurementCount(count => count + 1);
      setBaselineMemoryUsage(0);
    }, 10000);
  }, [isLoading, baselineMemoryFootprint]);

  const handleCreate = () => {
    const memoryFootprint = getMemoryFootprint();

    const count = parseInt(viewCount, 10);
    if (isNaN(count) || count <= 0) {
      console.log('Invalid view count');
      return;
    }

    startTransition(() => {
      const newViews = createViews(selectedComponent, count);
      setBaselineMemoryUsage(memoryFootprint);
      setViewsToRender(newViews);
    });

    console.log(`Created ${count} ${selectedComponent} components`);
  };

  const handleClear = () => {
    const memoryUsage = getMemoryUsage() * 1024 * 1024;

    startTransition(() => {
      setBaselineMemoryUsage(memoryUsage);
      setViewsToRender([]);
    });
    console.log('Cleared all views');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <MemorySummary
            viewCount={viewsToRender.length}
            value={memoryValue}
            before={beforeValue}
            after={afterValue}
            dirty={measurementCount >= 2}
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
              {isLoading ? 'Creating views...' : 'Create Views'}
            </Button>
            <Button variant="secondary" onPress={handleClear}>
              Remove views
            </Button>
            <Button variant="secondary" onPress={handleRefreshMemory}>
              Refresh memory
            </Button>
          </View>

          <View style={styles.viewsContainer}>{viewsToRender}</View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const createViews = (
  type: ComponentType,
  count: number,
): React.ReactElement[] => {
  switch (type) {
    case 'View':
      return Array.from({ length: count }, (_, i) => {
        const key = `${type}-${i}`;
        return <View key={key} style={styles.testView} />;
      });

    case 'ViewNativeComponent':
      return Array.from({ length: count }, (_, i) => {
        const key = `${type}-${i}`;
        return <ViewNativeComponent key={key} style={[styles.testView]} />;
      });

    case 'Text':
      return Array.from({ length: count }, (_, i) => {
        const key = `${type}-${i}`;
        return (
          <Text key={key} style={styles.testText}>
            Text Component #{i + 1}
          </Text>
        );
      });

    case 'TextNativeComponent':
      return Array.from({ length: count }, (_, i) => {
        const key = `${type}-${i}`;
        return (
          <NativeText key={key} style={[styles.testText]}>
            TextNative #{i + 1}
          </NativeText>
        );
      });

    case 'Text - Large Font':
      return Array.from({ length: count }, (_, i) => {
        const key = `${type}-${i}`;
        return (
          <Text key={key} style={styles.testTextLarge}>
            Text Component #{i + 1}
          </Text>
        );
      });

    case 'TextInput':
      return Array.from({ length: count }, (_, i) => {
        const key = `${type}-${i}`;
        return (
          <RNTextInput
            key={key}
            style={styles.testTextInput}
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
      throw new Error(`Unknown component type: ${type}`);
  }
};

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
  testView: {
    backgroundColor: '#e8f4fd',
    minWidth: 100,
    minHeight: 50,
    borderColor: '#b8d9f5',
    margin: 4,
  },
  testText: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    margin: 4,
  },
  testTextLarge: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    fontSize: 28,
    color: '#2c5f8d',
    margin: 4,
  },
  testTextInput: {
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

function getMemoryFootprint() {
  const warmup1 = getMemoryUsage() * 1024 * 1024;
  const warmup2 = getMemoryUsage() * 1024 * 1024;
  const result = getMemoryUsage() * 1024 * 1024;
  console.log('Memory footprint', warmup1, warmup2, result);
  return result;
}
