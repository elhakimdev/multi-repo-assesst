'use client';

import * as echarts from 'echarts/core';

import { GeoComponentOption, TitleComponent, TitleComponentOption, ToolboxComponent, ToolboxComponentOption, TooltipComponent, TooltipComponentOption, VisualMapComponent, VisualMapComponentOption } from 'echarts/components';
import { HTMLAttributes, forwardRef, useEffect, useId, useRef } from 'react';

import { GeoComponent } from 'echarts/components'; // Required for geo-based charts
import { MapChart } from 'echarts/charts';
import { SVGRenderer } from 'echarts/renderers';

// Ensure the map chart is imported
type EchartConfigsOptions  = echarts.EChartsCoreOption & echarts.ComposeOption<
  TooltipComponentOption
  | GeoComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | TitleComponentOption
  | VisualMapComponentOption
>;
export interface EchartConfigs {
  options: EchartConfigsOptions;
}

export interface GeoChartProps {
  echartConfigs: EchartConfigs;
  title?: string;
  subTitle?: string;
  styleProps: HTMLAttributes<HTMLDivElement>["style"];
  geoJson?: {
    url?: string;
    name?: string;
  } 
}

export interface GeoChartRefs {
  getInstance: () => echarts.ECharts | null;
}

export const GeoChart = forwardRef<GeoChartRefs, GeoChartProps>(({ echartConfigs, title, subTitle, styleProps, geoJson, ...rest }, ref) => {
  const id = useId();
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);
  const {url, name} = geoJson!;
  let isMounted = false;

  // Resize listener
  const handleResize = () => {
    if (instanceRef.current && isMounted && chartRef.current) {
      instanceRef.current.resize();
    }
  };

  const initGeoJsonChart = async () => {
    const response = await fetch(url!);
    console.log(response);
    if (!response.ok) throw new Error("Failed to load GeoJSON");

    const geoJson = await response.json();
    echarts.registerMap(name!, geoJson); // Register map
    echarts.use([
      SVGRenderer
    ])

    echarts.use([
      ToolboxComponent,
      TooltipComponent,
      VisualMapComponent,
      TitleComponent
    ])

    echarts.use([
      MapChart,
      GeoComponent
    ])
  }

  useEffect(() => {

    const initializeChart = async () => {
      isMounted = true;

      await initGeoJsonChart();

      console.log(chartRef.current, isMounted);
      
      if(chartRef.current, isMounted) {
        instanceRef.current = echarts.init(chartRef.current, null, {
          renderer: "svg"
        });
        instanceRef.current.setOption({
          ...echartConfigs.options
        })

        window.addEventListener("resize", handleResize);
      }
    };

    initializeChart();

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
      instanceRef.current?.dispose();
    };
  }, [echartConfigs]);

  return (
      <div id={'geochart_' + id} ref={chartRef} style={styleProps} className='border border-gray-400 shadow-inner p-2 rounded-md' />
  );
});

GeoChart.displayName = 'EchartGeoChartMaps'