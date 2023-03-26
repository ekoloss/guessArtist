import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import {MDBBtn} from "mdb-react-ui-kit";
import {useTranslation} from "react-i18next";

const Main: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="text-center mt-5">
      <MDBBtn onClick={() => navigate(`/game/${uuid()}`, { replace: true })}>{t('game.start')}</MDBBtn>
    </div>
  );
};

export default Main;
