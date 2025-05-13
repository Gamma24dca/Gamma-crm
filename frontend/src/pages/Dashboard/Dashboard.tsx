import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
// import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
// import styles from './Dashboard.module.css';

function Dashboard() {
  return (
    <>
      <ControlBar>
        <ControlBarTitle>Pulpit</ControlBarTitle>
        <p>Miesięczne</p>
        <p>Roczne</p>
        <p>Graficy</p>
      </ControlBar>
      {/* <ViewContainer></ViewContainer> */}
    </>
  );
}

export default Dashboard;
