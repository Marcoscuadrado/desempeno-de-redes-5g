import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="tex-5x1 tex-white font-bold">Evaluación del Desempeño de Redes 5G en Entornos Urbanos</h1>
        <footer>
        La tecnología 5G representa un avance significativo en el campo de las telecomunicaciones, proporcionando mayor velocidad, baja latencia y la capacidad de conectar simultáneamente miles de dispositivos. Sin embargo, su implementación enfrenta desafíos que pueden agravar la brecha digital entre áreas urbanas y rurales. En zonas urbanas, la alta densidad de infraestructura facilita una cobertura más estable y eficiente. Por el contrario, en entornos rurales con baja densidad de población, las redes suelen ser menos robustas debido a la escasez de estaciones base, lo que genera problemas de cobertura, mayor latencia y un rendimiento inconstante.
        Este proyecto es relevante debido a que permitirá identificar las deficiencias en el despliegue de redes 5G en entornos rurales y proponer estrategias para su optimización. Al comparar los niveles de latencia, ancho de banda y cobertura en diferentes escenarios, se generarán datos útiles para empresas de telecomunicaciones y autoridades encargadas de dichas acciones. De esta forma, se podrán promover mejoras en infraestructura que garanticen una experiencia de usuario más accesible, fomentando la inclusión digital y el desarrollo tecnológico en áreas menos favorecidas
        </footer>

        
      </main>
    </div>
  );
}
