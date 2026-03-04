import {
  Accelerometer,
  type AccelerometerMeasurement,
  Barometer,
  DeviceMotion,
  Magnetometer,
  type MagnetometerMeasurement,
} from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';

import { Row, RowGroup, Table } from '../components/table';

DeviceMotion.setUpdateInterval(1000);
Accelerometer.setUpdateInterval(1000);
Magnetometer.setUpdateInterval(1000);

export function SensorsPage() {
  const selectedLang = useStorageValue('selectedLang');

  const [acceleration, setAcceleration] = useState<AccelerometerMeasurement>();
  const [magnetometer, setMagnetometer] = useState<MagnetometerMeasurement>();
  const [pressure, setPressure] = useState<number | null>(null);

  useEffect(() => {
    const accelerometerSubscription = Accelerometer.addListener((data) => {
      setAcceleration(data);
    });

    const magnetometerSubscription = Magnetometer.addListener((data) => {
      setMagnetometer(data);
    });

    let barometerListener: ReturnType<typeof Barometer.addListener> | null =
      null;
    (async () => {
      const { status } = await requestPermissions();
      if (status !== 'granted') {
        return;
      }
      if (await Barometer.isAvailableAsync()) {
        barometerListener = Barometer.addListener((data) => {
          setPressure(data.pressure);
        });
      }
    })();

    return () => {
      accelerometerSubscription.remove();
      magnetometerSubscription.remove();
      barometerListener?.remove();
    };
  }, []);

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader pageName={langs[selectedLang].page_names.sensors} />
        <Table>
          <RowGroup label={langs[selectedLang].pages.settings.acceleration}>
            <Row
              label={'X ' + langs[selectedLang].pages.settings.axis}
              value={accelerometerValueToText(acceleration?.x) ?? 'N/A'}
            />
            <Row
              label={'Y ' + langs[selectedLang].pages.settings.axis}
              value={accelerometerValueToText(acceleration?.y) ?? 'N/A'}
            />
            <Row
              label={'Z ' + langs[selectedLang].pages.settings.axis}
              value={accelerometerValueToText(acceleration?.z) ?? 'N/A'}
            />
          </RowGroup>
          <RowGroup label={langs[selectedLang].pages.settings.magnetic_field}>
            <Row
              label={'X ' + langs[selectedLang].pages.settings.axis}
              value={magnetometer?.x.toFixed(2) ?? 'N/A'}
            />
            <Row
              label={'Y ' + langs[selectedLang].pages.settings.axis}
              value={magnetometer?.y.toFixed(2) ?? 'N/A'}
            />
            <Row
              label={'Z ' + langs[selectedLang].pages.settings.axis}
              value={magnetometer?.z.toFixed(2) ?? 'N/A'}
            />
          </RowGroup>
          <RowGroup label={langs[selectedLang].pages.settings.barometer}>
            <Row
              label={langs[selectedLang].pages.settings.pressure}
              value={pressure ? `${pressure.toFixed(2)} hPa` : 'N/A'}
            />
          </RowGroup>
        </Table>
      </Container>
    </Page>
  );
}

const accelerometerValueToText = (value: number | undefined) =>
  value !== undefined
    ? (Platform.OS === 'ios' ? value * 9.8 : value).toFixed(2)
    : undefined;

const requestPermissions = async () => {
  const p = await Barometer.getPermissionsAsync();
  if (p.status === 'granted') {
    return p;
  }
  return await Barometer.requestPermissionsAsync();
};
