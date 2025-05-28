"use client";

import { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

type DataPoint = {
  timestamp: number;
  timeLabel: string;
  temperature: number;
  humidity: number;
};

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://mqtt-ws-server.onrender.com"); // Asegúrate que esta URL coincida con la de Render
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket conectado");
    };

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log("📦 Datos recibidos:", parsed);

        const now = Date.now();
        const nowLabel = new Date(now).toLocaleTimeString();

        const newPoint: DataPoint = {
          timestamp: now,
          timeLabel: nowLabel,
          temperature: Number(parsed.temperature),
          humidity: Number(parsed.humidity),
        };

        setData((prev) => {
          const tenMinutesAgo = now - 10 * 60 * 1000;
          const filtered = [...prev, newPoint].filter(
            (point) => point.timestamp >= tenMinutesAgo
          );
          return filtered;
        });
      } catch (e) {
        console.error("❌ Error procesando mensaje:", e);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold text-center mb-6">
        Temperatura y Humedad (últimos 10 minutos)
      </h1>

      <div className="border border-white p-4 bg-gray-800 rounded">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis dataKey="timeLabel" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#8884d8"
              name="Temperatura (°C)"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#82ca9d"
              name="Humedad (%)"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
