import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import InfoBar from '../../components/Atoms/InfoBar/InfoBar';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';

function StudioTaskView() {
  return (
    <>
      <ControlBar>
        <ControlBarTitle>Roliczenie</ControlBarTitle>
      </ControlBar>
      <ViewContainer>
        <ListContainer>
          <InfoBar>
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
          </InfoBar>
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default StudioTaskView;
