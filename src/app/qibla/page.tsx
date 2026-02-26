'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Navigation, MapPin, RotateCcw } from 'lucide-react';

export default function QiblaPage() {
  const [direction, setDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Calculate Qibla direction from coordinates
  const calculateQiblaDirection = (lat: number, lon: number): number => {
    const meccaLat = 21.4225;
    const meccaLon = 39.8262;

    const latRad = (lat * Math.PI) / 180;
    const lonRad = (lon * Math.PI) / 180;
    const meccaLatRad = (meccaLat * Math.PI) / 180;
    const meccaLonRad = (meccaLon * Math.PI) / 180;

    const y = Math.sin(meccaLonRad - lonRad);
    const x =
      Math.cos(latRad) * Math.tan(meccaLatRad) -
      Math.sin(latRad) * Math.cos(meccaLonRad - lonRad);

    let qibla = Math.atan2(y, x);
    qibla = (qibla * 180) / Math.PI;
    qibla = (qibla + 360) % 360;

    return qibla;
  };

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          const qiblaDir = calculateQiblaDirection(latitude, longitude);
          setDirection(qiblaDir);
        },
        (err) => {
          setError('Не удалось определить местоположение. Разрешите доступ к геолокации.');
          console.error(err);
          // Default to Moscow
          const qiblaDir = calculateQiblaDirection(55.7558, 37.6173);
          setDirection(qiblaDir);
          setLocation({ lat: 55.7558, lon: 37.6173 });
        }
      );
    }

    // Device orientation for compass
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceHeading(event.alpha);
      }
    };

    if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const needleRotation = direction !== null ? direction - deviceHeading : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Кибла</h1>
          <p className="text-gray-600">Направление к Каабе в Мекке</p>
        </motion.div>

        {/* Compass */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          <div className="relative w-64 h-64 mx-auto">
            {/* Compass Background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
              {/* Cardinal Directions */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-gray-700">
                С
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-gray-700">
                Ю
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 font-bold text-gray-700">
                З
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-gray-700">
                В
              </div>

              {/* Compass marks */}
              {[...Array(36)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 bg-gray-400 left-1/2 -translate-x-1/2"
                  style={{
                    height: i % 3 === 0 ? '12px' : '6px',
                    top: '8px',
                    transformOrigin: 'bottom center',
                    transform: `translateX(-50%) rotate(${i * 10}deg) translateY(${
                      128 - (i % 3 === 0 ? 12 : 6) - 8
                    }px)`,
                  }}
                />
              ))}
            </div>

            {/* Qibla Needle */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: needleRotation }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <div className="relative w-full h-full">
                {/* Arrow to Qibla */}
                <div
                  className="absolute top-4 left-1/2 -translate-x-1/2"
                  style={{ transformOrigin: 'bottom center' }}
                >
                  <Navigation className="w-8 h-8 text-emerald-600 fill-emerald-600" />
                </div>
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-600 rounded-full shadow-lg" />
              </div>
            </motion.div>
          </div>

          {/* Direction Info */}
          <div className="text-center mt-6">
            {direction !== null && (
              <>
                <p className="text-4xl font-bold text-emerald-600 mb-2">
                  {Math.round(direction)}°
                </p>
                <p className="text-gray-600">от севера по часовой стрелке</p>
              </>
            )}
          </div>
        </motion.div>

        {/* Location Info */}
        {location && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-md mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Ваши координаты</p>
                <p className="text-gray-600 text-sm">
                  {location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4"
          >
            <p className="text-amber-700 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-purple-50 rounded-xl p-4 border border-purple-100"
        >
          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-medium text-purple-900 mb-1">Как использовать</p>
              <p className="text-purple-700 text-sm">
                Держите телефон горизонтально. Зелёная стрелка указывает
                направление киблы. На устройствах без компаса отображается
                фиксированное направление.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
