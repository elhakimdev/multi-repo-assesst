'use client';

import * as echarts from 'echarts/core';

import { GeoComponentOption, TitleComponent, TitleComponentOption, ToolboxComponent, ToolboxComponentOption, TooltipComponent, TooltipComponentOption, VisualMapComponent, VisualMapComponentOption } from 'echarts/components';
import { HTMLAttributes, forwardRef, useEffect, useId, useRef, useState } from 'react';

import { GeoComponent } from 'echarts/components';
import { MapChart } from 'echarts/charts';
import { SVGRenderer } from 'echarts/renderers';

// Define supported options
type EchartConfigsOptions = echarts.EChartsCoreOption & echarts.ComposeOption<
  TooltipComponentOption | GeoComponentOption | ToolboxComponentOption | TitleComponentOption | VisualMapComponentOption
>;

export interface EchartConfigs {
  options: EchartConfigsOptions;
}

export interface GeoChartProps {
  echartConfigs: EchartConfigs;
  title?: string;
  subTitle?: string;
  styleProps?: HTMLAttributes<HTMLDivElement>["style"];
  geoJson?: {
    url?: string;
    name?: string;
  };
}

export interface GeoChartRefs {
  getInstance: () => echarts.ECharts | null;
}


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


export const GeoChart = forwardRef<GeoChartRefs, GeoChartProps>(
  ({ echartConfigs, title, subTitle, styleProps, geoJson }, ref) => {
    const id = useId();
    const chartRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<echarts.ECharts | null>(null);
    const [isClient, setIsClient] = useState(false); // Prevent SSR errors
    const [isGeoJsonLoaded, setIsGeoJsonLoaded] = useState(false);

    // Prevent SSR errors by ensuring execution happens only on the client side
    useEffect(() => {
      setIsClient(typeof window !== 'undefined');
    }, []);

    // Fetch and register GeoJSON map
    useEffect(() => {
      if (!geoJson?.url || !geoJson?.name || !isClient) return;

      const loadGeoJson = async () => {
        try {
          const response = await fetch(geoJson?.url!);
          if (!response.ok) throw new Error('Failed to load GeoJSON');
          const geoData = await response.json();
          echarts.registerMap(geoJson?.name!, geoData);
          setIsGeoJsonLoaded(true);
        } catch (error) {
          console.error('Error loading GeoJSON:', error);
        }
      };

      loadGeoJson();
    }, [geoJson, isClient]);

    // Initialize ECharts instance
    useEffect(() => {
      if (!chartRef.current || !isClient || !isGeoJsonLoaded) return;

      instanceRef.current = echarts.init(chartRef.current, null, { renderer: 'svg' });
      instanceRef.current.setOption(echartConfigs.options);

      const handleResize = () => instanceRef.current?.resize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        instanceRef.current?.dispose();
        instanceRef.current = null;
      };
    }, [isGeoJsonLoaded, isClient, echartConfigs]);

    return isClient ? (
      <div
        id={'geochart_' + id}
        ref={chartRef}
        style={styleProps}
        className="border border-gray-400 shadow-inner p-2 rounded-md"
      />
    ) : null;
  }
);

GeoChart.displayName = 'EchartGeoChartMaps';
