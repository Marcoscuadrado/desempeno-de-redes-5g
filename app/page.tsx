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
  time: string;
  temperature: number;
  humidity: number;
};

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://mqtt-ws-server.onrender.com"); // Asegúrate que esta URL sea la correcta de Render
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket conectado");
    };

    socket.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      const now = new Date();
      const newPoint: DataPoint = {
        time: now.toLocaleTimeString(),
        temperature: parsed.temperature,
        humidity: parsed.humidity,
      };

      setData((prev) => {
        const updated = [...prev, newPoint];
        // Filtrar datos para solo mostrar los últimos 10 minutos
        const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
        return updated.filter((point) => {
          const [h, m, s] = point.time.split(":").map(Number);
          const pointDate = new Date();
          pointDate.setHours(h, m, s, 0);
          return pointDate >= tenMinutesAgo;
        });
      });
    };

    socket.onerror = (error) => {
      console.error("❌ Error de WebSocket:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="min-h-screen p-8 font-sans bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Temperatura y Humedad (últimos 10 minutos)
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fill: "white" }} />
          <YAxis tick={{ fill: "white" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperatura (°C)" />
          <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humedad (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
