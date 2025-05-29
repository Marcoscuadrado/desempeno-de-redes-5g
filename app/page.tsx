'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

type SensorData = {
  time: number;
  temperature: number;
  humidity: number;
};

export default function Home() {
  const [data, setData] = useState<SensorData[]>([]);

  useEffect(() => {
    const socket = new WebSocket('wss://mqtt-ws-server.onrender.com'); // Cambia por tu URL real

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const temperature = parseFloat(parsed.temperature);
        const humidity = parseFloat(parsed.humidity);

        if (!isNaN(temperature) && !isNaN(humidity)) {
          const now = Date.now();
          const newEntry: SensorData = {
            time: now,
            temperature,
            humidity
          };

          setData(prev => {
            const updated = [...prev, newEntry];
            // Mantener solo los últimos 10 minutos de datos
            const tenMinutesAgo = now - 10 * 60 * 1000;
            return updated.filter(item => item.time >= tenMinutesAgo);
          });
        }
      } catch (error) {
        console.error("Error procesando mensaje WebSocket:", error);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-900 text-white">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <h1 className="text-5xl font-bold">
          Evaluación del Desempeño de Redes 5G en Entornos Urbanos
        </h1>

        <section className="w-full max-w-5xl bg-white text-black p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Temperatura y Humedad (últimos 10 minutos)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid stroke="#ccc" />
              <XAxis
                dataKey="time"
                tickFormatter={(time) => new Date(time).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(time) => new Date(time).toLocaleTimeString()}
              />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperatura (°C)" />
              <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humedad (%)" />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </main>
    </div>
  );
}
