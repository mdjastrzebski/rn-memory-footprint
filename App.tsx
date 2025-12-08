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
import { css, html } from 'react-strict-dom';
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
  'Text (Large Font)',
  'TextInput',
  'Switch',
  'RSD <div>',
  'RSD <span> with text',
  'RSD <span> with text (Large Font)',
];

const warmupMemoryFootprint = getMemoryFootprint();
console.log('Warmup memory footprint', warmupMemoryFootprint);

type ComponentType = (typeof COMPONENT_TYPES)[number];

export default function MemoryTestScreen() {
  const [baselineMemory, setBaselineMemory] = React.useState(0);
  const [finalMemory, setFinalMemory] = React.useState(0);
  const [measurementCount, setMeasurementCount] = React.useState(0);

  const [viewCount, setViewCount] = React.useState<number | null>(10000);
  const [selectedComponent, setSelectedComponent] =
    React.useState<ComponentType>('View');

  const [isRendering, startTransition] = React.useTransition();
  const [viewsToRender, setViewsToRender] = React.useState<
    React.ReactElement[]
  >([]);
  const [renderedViewCount, setRenderedViewCount] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      const currentMemory = getMemoryFootprint();
      setFinalMemory(currentMemory);
    }, 500);

    return () => clearInterval(id);
  }, []);

  const handleCreate = () => {
    const memoryFootprint = getMemoryFootprint();

    if (viewCount === null || viewCount <= 0) {
      console.log('Invalid view count');
      return;
    }

    const newViews = createViews(selectedComponent, viewCount);
    setBaselineMemory(memoryFootprint);
    setFinalMemory(memoryFootprint);
    setMeasurementCount(c => c + 1);

    startTransition(() => {
      setViewsToRender(newViews);
      setRenderedViewCount(viewCount);
    });

    console.log(`Created ${viewCount} ${selectedComponent} components`);
  };

  const handleClear = () => {
    const memoryUsage = getMemoryUsage() * 1024 * 1024;

    setBaselineMemory(memoryUsage);
    setFinalMemory(memoryUsage);
    setMeasurementCount(count => count + 1);
    startTransition(() => {
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
          <View style={styles.modeLabelContainer}>
            <Text style={styles.modeLabel}>
              {__DEV__ ? 'DEBUG' : 'RELEASE'}
            </Text>
          </View>
          <MemorySummary
            viewCount={renderedViewCount}
            value={finalMemory - baselineMemory}
            before={baselineMemory}
            after={finalMemory}
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
            onChangeValue={setViewCount}
            placeholder="Enter view count"
          />

          <View style={styles.buttonContainer}>
            <Button variant="primary" onPress={handleCreate}>
              {isRendering ? 'Creating views...' : 'Create Views'}
            </Button>
            <Button variant="secondary" onPress={handleClear}>
              Remove views
            </Button>
            <Button variant="secondary" onPress={() => globalThis.gc()}>
              Trigger GC
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
        return <View key={i} style={styles.testView} />;
      });

    case 'ViewNativeComponent':
      return Array.from({ length: count }, (_, i) => {
        return <ViewNativeComponent key={i} style={[styles.testView]} />;
      });

    case 'Text':
      return Array.from({ length: count }, (_, i) => {
        return (
          <Text key={i} style={styles.testText}>
            Text Component #{i + 1}
          </Text>
        );
      });

    case 'TextNativeComponent':
      return Array.from({ length: count }, (_, i) => {
        return (
          <NativeText key={i} style={[styles.testText]}>
            TextNative #{i + 1}
          </NativeText>
        );
      });

    case 'Text (Large Font)':
      return Array.from({ length: count }, (_, i) => {
        return (
          <Text key={i} style={styles.testTextLarge}>
            Text Component #{i + 1}
          </Text>
        );
      });

    case 'TextInput':
      return Array.from({ length: count }, (_, i) => {
        return (
          <RNTextInput
            key={i}
            style={styles.testTextInput}
            placeholder={`TextInput #${i + 1}`}
          />
        );
      });

    case 'Switch':
      return Array.from({ length: count }, (_, i) => {
        return (
          <RNSwitch
            key={i}
            value={false}
            disabled={true}
            trackColor={{ false: '#d6ebff', true: '#4a90e2' }}
            thumbColor="#ffffff"
          />
        );
      });

    case 'RSD <div>':
      return Array.from({ length: count }, (_, i) => {
        return <html.div key={i} style={cssStyles.testDiv} />;
      });

    case 'RSD <span> with text':
      return Array.from({ length: count }, (_, i) => {
        return (
          <html.span key={i} style={cssStyles.testSpan}>
            Span Component #{i + 1}
          </html.span>
        );
      });

    case 'RSD <span> with text (Large Font)':
      return Array.from({ length: count }, (_, i) => {
        return (
          <html.span key={i} style={cssStyles.testSpanLarge}>
            Span Component #{i + 1}
          </html.span>
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
  modeLabelContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  modeLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4a90e2',
    letterSpacing: 0.5,
    opacity: 0.8,
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
    fontSize: 16,
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

const cssStyles = css.create({
  testDiv: {
    backgroundColor: '#e8f4fd',
    minWidth: 100,
    minHeight: 50,
    borderColor: '#b8d9f5',
    margin: 4,
  },
  testSpan: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    fontSize: 16,
    color: '#2c5f8d',
    margin: 4,
  },
  testSpanLarge: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    fontSize: 28,
    color: '#2c5f8d',
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
