import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

const Main: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    return navigate(`/game/${uuid()}`, { replace: true });
  }, []);

  return (
    <></>
  );
};

export default Main;
