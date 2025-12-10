import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getMemoryUsage } from 'react-native-performance-toolkit';
import { Button } from './components/Button';
import { NumericTextInput } from './components/NumericTextInput';
import { MemorySummary } from './components/MemorySummary';
import { DropDown } from './components/DropDown';
import { viewFactory } from './view-factory';

getMemoryFootprint('warmup');

type ComponentType = keyof typeof viewFactory;
const componentTypes = Object.keys(viewFactory) as ComponentType[];

export default function MemoryTestScreen() {
  const [baselineMemory, setBaselineMemory] = React.useState(0);
  const [currentMemory, setCurrentMemory] = React.useState(0);
  const [measurementCount, setMeasurementCount] = React.useState(0);

  const [viewCount, setViewCount] = React.useState<number | null>(10000);
  const [selectedView, setSelectedView] = React.useState<ComponentType>('View');

  const [isUpdating, startTransition] = React.useTransition();
  const [viewsToRender, setViewsToRender] = React.useState<
    React.ReactElement[]
  >([]);
  const [renderedViewCount, setRenderedViewCount] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setCurrentMemory(getMemoryFootprint('current'));
    }, 500);

    return () => clearInterval(id);
  }, []);

  const createViews = () => {
    if (viewCount === null || viewCount <= 0) {
      console.log('Invalid view count');
      return;
    }

    const memoryFootprint = getMemoryFootprint('create views');
    const newViews = viewFactory[selectedView](viewCount);
    setBaselineMemory(memoryFootprint);
    setCurrentMemory(memoryFootprint);
    setMeasurementCount(count => count + 1);

    startTransition(() => {
      setViewsToRender(newViews);
      setRenderedViewCount(viewCount);
    });

    console.log(`Created ${viewCount} ${selectedView} elements`);
  };

  const removeViews = () => {
    const memory = getMemoryFootprint('remove views');
    setBaselineMemory(memory);
    setCurrentMemory(memory);
    setMeasurementCount(count => count + 1);

    startTransition(() => {
      setViewsToRender([]);
    });

    console.log('Removed all views');
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
              {getOS()} {__DEV__ ? 'DEBUG' : 'RELEASE'}
            </Text>
          </View>
          <MemorySummary
            viewCount={renderedViewCount}
            value={currentMemory - baselineMemory}
            before={baselineMemory}
            after={currentMemory}
            dirty={measurementCount >= 2}
          />

          <DropDown
            label="Component Type"
            value={selectedView}
            options={componentTypes}
            onSelect={setSelectedView}
          />

          <NumericTextInput
            label="View Count"
            value={viewCount}
            onChangeValue={setViewCount}
            placeholder="Enter view count"
          />

          <View style={styles.buttonContainer}>
            <Button variant="primary" onPress={createViews}>
              {isUpdating ? 'Updating...' : 'Create Views'}
            </Button>
            <Button variant="secondary" onPress={removeViews}>
              Remove views
            </Button>
            <Button variant="secondary" onPress={triggerGC}>
              Trigger GC
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
  modeLabelContainer: {
    alignItems: 'center',
    marginBottom: 8,
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
    paddingHorizontal: 20,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  viewsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 10,
    minHeight: 150,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8f4fd',
  },
});

function getOS() {
  switch (Platform.OS) {
    case 'ios':
      return 'iOS';
    case 'android':
      return 'Android';
    default:
      return Platform.OS;
  }
}

function getMemoryFootprint(name?: string) {
  const result = getMemoryUsage() * 1024 * 1024;
  console.log(`Memory footprint (${name ?? ''})`, result);
  return result;
}

function triggerGC() {
  // @ts-expect-error
  globalThis.gc();
}
