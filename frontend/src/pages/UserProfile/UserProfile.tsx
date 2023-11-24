import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../../services/users-service';

type User = {
  emai: string;
  img: string;
  job: string;
  lastname: string;
  name: string;
  password: string;
  phone: number;
  _v: number;
  _id: string;
};

function UserProfile() {
  const params = useParams();
  const [user, setUser] = useState<User[]>([]);

  useEffect(() => {
    getUserById(params.id).then((signleUser) => {
      console.log(signleUser);
      setUser(signleUser);
    });
  }, [params.id]);

  return (
    <div>
      {user.map((it) => {
        return <h2 key={it._id}>{it.name}</h2>;
      })}
    </div>
  );
}

export default UserProfile;
