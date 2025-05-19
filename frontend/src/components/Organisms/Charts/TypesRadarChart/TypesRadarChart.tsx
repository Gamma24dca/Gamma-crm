import {
  Label,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import DashboardContainerTitle from '../../../Atoms/DashboardContainerTitle/DashboardContainerTitle';
import styles from './TypesRadarChart.module.css';

function TypesRadarChart({ tasksTypeSummary }) {
  return (
    <div className={styles.radarChartContainer}>
      <DashboardContainerTitle>Typy aktywnych zleceń</DashboardContainerTitle>
      <ResponsiveContainer width="100%" height="85%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={tasksTypeSummary}>
          <Label value="any" />
          <PolarGrid />
          <PolarAngleAxis dataKey="taskType" />
          <PolarRadiusAxis />
          <Radar
            name="Mike"
            dataKey="count"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>{' '}
    </div>
  );
}

export default TypesRadarChart;
