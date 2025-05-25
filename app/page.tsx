'use client';
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type SensorData = {
  temperature: number;
  humidity: number;
  timestamp: Date;
};

export default function Home() {
  const [data, setData] = useState<SensorData[]>([]);


  useEffect(() => {
    const socket = new WebSocket('wss://mqtt-ws-server.onrender.com');

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (typeof payload.temperature === 'number' && typeof payload.humidity === 'number') {
          const now = new Date();
          const newEntry: SensorData = {
            temperature: payload.temperature,
            humidity: payload.humidity,
            timestamp: now,
          };

          setData((prevData) => {
            const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
            const recentData = prevData.filter((d) => d.timestamp > tenMinutesAgo);
            return [...recentData, newEntry];
          });
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };
    socket.onopen = () => {
    console.log("✅ Conectado al servidor WebSocket");
  };

  socket.onmessage = (event) => {
    console.log("📡 Datos recibidos:", event.data);
  };

  socket.onerror = (error) => {
    console.error("❌ Error de WebSocket:", error);
  };

    return () => socket.close();
  }, []);
  

  const latest = data[data.length - 1];

  const chartData = data.map((d) => ({
    ...d,
    time: d.timestamp.toLocaleTimeString(),
  }));

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <h1 className="text-3xl text-white font-bold">
          Evaluación del Desempeño de Redes 5G en Entornos Urbanos
        </h1>

        <div className="text-xl text-white">
          <p>🌡️ Temperatura: {latest ? `${latest.temperature.toFixed(2)} °C` : 'Cargando...'}</p>
          <p>💧 Humedad: {latest ? `${latest.humidity.toFixed(2)} %` : 'Cargando...'}</p>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperatura (°C)" />
              <Line type="monotone" dataKey="humidity" stroke="#387908" name="Humedad (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
