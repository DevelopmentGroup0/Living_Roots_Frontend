'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatBucketLabel, formatNumber, pluralize } from './format'
import type { ConsultationsTrend, TrendGranularity } from './types'

const COLOR_ACTIVE = '#0E3321'
const COLOR_EMPTY = 'rgba(14, 51, 33, 0.15)'

interface ConsultationsTrendChartProps {
  points: ConsultationsTrend
  granularity: TrendGranularity
}

interface TooltipPayloadEntry {
  bucket: string
  count: number
}

/**
 * Recharts tipa `content` de forma genérica (`ValueType | NameType`) difícil de
 * casar con un componente propio fuertemente tipado; se declara aquí solo el
 * subconjunto de props que este tooltip usa, y se hace el cast en el único punto
 * donde Recharts invoca esta función (ver `content={...}` más abajo).
 */
interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ payload: TooltipPayloadEntry }>
  granularity: TrendGranularity
}

function ChartTooltip({ active, payload, granularity }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload

  return (
    <div className='rounded-md border border-[#0E3321]/15 bg-white px-3 py-2 text-xs shadow-md'>
      <p className='font-medium text-[#0E3321]'>
        {formatBucketLabel(point.bucket, granularity)}
      </p>
      <p className='text-stone-600'>
        {formatNumber(point.count)}{' '}
        {pluralize(point.count, 'consulta', 'consultas')}
      </p>
    </div>
  )
}

/**
 * Días muy espaciados (90) saturan el eje X con una etiqueta por barra; se omiten
 * etiquetas intermedias según el volumen de puntos. La gráfica en sí muestra una
 * barra por punto siempre (esto solo afecta las etiquetas del eje).
 */
function tickInterval(pointCount: number): number {
  if (pointCount <= 14) return 0 // todas las etiquetas
  if (pointCount <= 31) return 3
  return Math.ceil(pointCount / 10)
}

/**
 * Gráfica de barras de consultas guardadas (Recharts). Con datos vacíos se ve el eje
 * completo del período en cero (E2, sin errores de render). El resumen accesible de
 * texto y la tabla `sr-only` dan la misma información a lectores de pantalla, porque
 * el SVG de Recharts no la expone por sí solo.
 */
export function ConsultationsTrendChart({
  points,
  granularity,
}: ConsultationsTrendChartProps) {
  const total = points.reduce((sum, p) => sum + p.count, 0)
  const peak = Math.max(0, ...points.map((p) => p.count))
  const unit = granularity === 'week' ? 'semana' : 'día'

  return (
    <div>
      <div className='mb-3 flex items-baseline justify-between gap-3 text-xs text-stone-500'>
        <span className='font-medium text-[#0E3321]'>
          Total del período: {formatNumber(total)}{' '}
          {pluralize(total, 'consulta', 'consultas')}
        </span>
        <span>máx. {formatNumber(peak)}</span>
      </div>

      <div
        role='img'
        aria-label={`Consultas guardadas por ${unit}. Total del período: ${total}.`}
        className='h-52'
      >
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={points}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke='rgba(14, 51, 33, 0.08)' />
            <XAxis
              dataKey='bucket'
              tickFormatter={(bucket: string) =>
                formatBucketLabel(bucket, granularity)
              }
              interval={tickInterval(points.length)}
              tick={{ fontSize: 11, fill: '#78716c' }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(14, 51, 33, 0.15)' }}
            />
            <YAxis
              allowDecimals={false}
              width={28}
              tick={{ fontSize: 11, fill: '#78716c' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={(props: any) => (
                <ChartTooltip {...props} granularity={granularity} />
              )}
              cursor={{ fill: 'rgba(14, 51, 33, 0.06)' }}
            />
            <Bar
              dataKey='count'
              radius={[3, 3, 0, 0]}
              // Un valor > 0 se ve aunque sea muy pequeño frente al máximo del período.
              minPointSize={(value) => ((value ?? 0) > 0 ? 3 : 0)}
              isAnimationActive={false}
              // El tipo de `shape` de Recharts no expone bien `payload` en sus genéricos;
              // se tipa como `any` aquí, en el único punto donde hace falta.
              shape={(props: any) => {
                const bar = props as {
                  x: number
                  y: number
                  width: number
                  height: number
                  payload: TooltipPayloadEntry
                }
                return (
                  <rect
                    data-testid='trend-bar'
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={Math.max(bar.height, 2)}
                    rx={3}
                    fill={bar.payload.count > 0 ? COLOR_ACTIVE : COLOR_EMPTY}
                  />
                )
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {total === 0 && (
        <p className='mt-3 text-sm text-stone-500'>
          Aún no hay consultas guardadas en este período.
        </p>
      )}

      <table className='sr-only'>
        <caption>Consultas guardadas por {unit}</caption>
        <thead>
          <tr>
            <th scope='col'>{granularity === 'week' ? 'Semana' : 'Fecha'}</th>
            <th scope='col'>Consultas</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.bucket}>
              <th scope='row'>
                {formatBucketLabel(point.bucket, granularity)}
              </th>
              <td>{point.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
