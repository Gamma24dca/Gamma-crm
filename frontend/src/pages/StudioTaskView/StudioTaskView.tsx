import { Icon } from '@iconify/react';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import CTA from '../../components/Atoms/CTA/CTA';
// import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import UsersDisplay from '../../components/Organisms/UsersDisplay/UsersDisplay';
// import InfoBar from '../../components/Organisms/InfoBar/InfoBar';
import styles from './StudioTaskView.module.css';

const mockedTasks = [
  {
    title: 'Leaflet Design',
    client: 'Shell',
    clientPerson: 'Anna Kowalska',
    status: 'W trakcie',
    author: [
      {
        _id: '65608b6b1ad0aa5b987a8452',
        name: 'Marek',
        lastname: 'Kowal',
        email: 'marek.kowal@gamma24.pl',
        phone: 512345678,
        job: 'Project Manager',
        img: 'https://res.cloudinary.com/dpktrptfr/image/upload/v1679038449/AboutPage/Gamma_Marek-min.jpg',
      },
    ],
    TaskType: 'Marketing',
    participants: [
      {
        _id: '65608c451ad0aa5b987a8483',
        name: 'Elżbieta',
        lastname: 'Ciebień',
        email: 'elzbieta.ciebien@gamma24.pl',
        phone: 123456789,
        job: 'Creative director',
        img: 'https://res.cloudinary.com/dpktrptfr/image/upload/v1685627514/AboutPage/Gamma_Ela-min_xa19ip.jpg',
      },
      {
        _id: '655f423bf7ce6ff8c9b4f308',
        name: 'Weronika',
        lastname: 'Wisniewski',
        email: 'adam.wisniewski@gamma24.pl',
        phone: 502345678,
        job: 'Content Specialist',
        img: 'https://res.cloudinary.com/dpktrptfr/image/upload/v1679038451/AboutPage/Gamma_Wera-min.jpg',
      },
    ],
    description: 'Design a promotional leaflet for Shell’s new product line.',
    subtasks: [
      {
        content: 'Finalize layout design',
        done: false,
      },
      {
        content: 'Send for client review',
        done: true,
      },
      {
        content: 'testestest',
        done: true,
      },
    ],
    deadline: '25.11.2024',
  },
  {
    title: 'Annual Report 2024',
    client: 'Goodyear',
    clientPerson: 'Piotr Nowakowski',
    status: 'Do zrobienia',
    author: [
      {
        _id: '65608b6b1ad0aa5b987a8453',
        name: 'Monika',
        lastname: 'Lis',
        email: 'monika.lis@gamma24.pl',
        phone: 513456789,
        job: 'Coordinator',
        img: 'https://res.cloudinary.com/dpktrptfr/image/upload/v1679038452/AboutPage/Gamma_Monika-min.jpg',
      },
    ],
    TaskType: 'Corporate',
    participants: [
      {
        _id: '67059fb0dcfe272f6b1f1bb4',
        name: 'Bartek',
        lastname: 'Bialy',
        email: 'jan.bialy@gamma24.pl',
        phone: 503456789,
        job: 'Data Analyst',
        img: 'https://res.cloudinary.com/dpktrptfr/image/upload/v1679038453/AboutPage/Gamma_Bartek-min.jpg',
      },
      {
        _id: '655f423bf7ce6ff8c9b4f309',
        name: 'Dawid',
        lastname: 'Nowak',
        email: 'kasia.nowak@gamma24.pl',
        phone: 504567890,
        job: 'Editor',
        img: 'https://res.cloudinary.com/dpktrptfr/image/upload/v1679038454/AboutPage/Gamma_Dawid-min.jpg',
      },
    ],
    description:
      'Compile and design the annual report for Goodyear’s fiscal year 2024.',
    subtasks: [
      {
        content: 'Collect financial data',
        done: false,
      },
      {
        content: 'Prepare visualizations and charts',
        done: false,
      },
    ],
    deadline: '15.12.2024',
  },
  {
    title: 'Website Redesign',
    client: 'Axa',
    clientPerson: 'Elżbieta Kamińska',
    status: 'Do zrobienia',
    author: {
      _id: '65608b6b1ad0aa5b987a8454',
      name: 'Dawid',
      lastname: 'Cichy',
      email: 'dawid.cichy@gamma24.pl',
      phone: 505678901,
      job: 'Lead Developer',
      img: 'https://res.cloudinary.com/dpktrptfr/image/upload/v1679038455/AboutPage/Gamma_Dawid-min.jpg',
    },

    TaskType: 'Web Development',
    participants: [
      {
        _id: '67059fb0dcfe272f6b1f1bb5',
        name: 'Edyta',
        lastname: 'Radzka',
        email: 'paulina.radzka@gamma24.pl',
        phone: 506789012,
        job: 'Frontend Developer',
        img: 'https://res.cloudinary.com/dpktrptfr/image/upload/v1679038456/AboutPage/Gamma_Edyta-min.jpg',
      },
      {
        _id: '655f423bf7ce6ff8c9b4f310',
        name: 'Jurek',
        lastname: 'Nowicki',
        email: 'tomasz.nowicki@gamma24.pl',
        phone: 507890123,
        job: 'UX Designer',
        img: 'https://res.cloudinary.com/dpktrptfr/image/upload/v1679038457/AboutPage/Gamma_Jerzy-min.jpg',
      },
    ],
    description:
      'Complete overhaul of the Axa corporate website to improve UX and accessibility.',
    subtasks: [
      {
        content: 'Finalize wireframes',
        done: true,
      },
      {
        content: 'Implement responsive design',
        done: true,
      },
    ],
    deadline: '30.10.2024',
  },
];

const colums = [
  {
    class: 'columnTitleMark',
    title: 'Na później',
  },
  {
    class: 'columnTitleMarkToDo',
    title: 'Do zrobienia',
  },
  {
    class: 'columnTitleMarkInProgress',
    title: 'W trakcie',
  },
  {
    class: 'columnTitleMarkSent',
    title: 'Wysłane',
  },
];

function generateFourDigitRandom() {
  return Math.floor(1000 + Math.random() * 9000);
}

function StudioTaskView() {
  return (
    <>
      <ControlBar>
        <ControlBarTitle>Zlecenia</ControlBarTitle>
        <SearchInput />
        <div className={styles.buttonsWrapper}>
          <CTA onClick={() => {}}>Nowe zlecenie</CTA>
          <CTA onClick={() => {}}>Filtry</CTA>
        </div>
      </ControlBar>

      <ViewContainer>
        <div className={styles.columnsWrapper}>
          {colums.map((column) => {
            return (
              <div className={styles.taskColumnContainer} key={column.class}>
                <div className={styles.columnTitleWrapper}>
                  <div className={`${styles[`${column.class}`]}`} />
                  <h4>{column.title}</h4>
                </div>
                <div
                  className={`${styles.taskColumn} ${
                    mockedTasks.some((task) => task.status === column.title)
                      ? ''
                      : styles.taskColumnBorder
                  }`}
                >
                  {mockedTasks.map((task) => {
                    const subtasksLength = task.subtasks.length;
                    const searchID = generateFourDigitRandom();
                    let doneSubtasks = 0;

                    task.subtasks.forEach((subtask) => {
                      if (subtask.done) {
                        doneSubtasks += 1;
                      }
                    });

                    return (
                      task.status === column.title && (
                        <div className={styles.task}>
                          <p
                            className={`${styles.clientName} ${
                              styles[`${task.client}`]
                            }`}
                          >
                            {task.client}
                          </p>
                          <span className={styles.searchID}>#{searchID}</span>
                          <p>{task.title}</p>
                          <div className={styles.userDisplayWrapper}>
                            <UsersDisplay
                              data={task}
                              usersArray={task.participants}
                            />
                          </div>
                          <div className={styles.subtasksCountWrapper}>
                            <Icon
                              icon="material-symbols:task-alt"
                              width="12"
                              height="12"
                            />
                            <div>
                              <span>{doneSubtasks}/</span>
                              <span>{subtasksLength}</span>
                            </div>
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ViewContainer>
    </>
  );
}

export default StudioTaskView;
