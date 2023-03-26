import React, {useCallback, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPrefix, serverAddress } from '../config';
import { getTopRated, resetAlbums } from "../api";
import {IUserResponse} from "@models";
import {MDBCol, MDBRow, MDBContainer, MDBTable, MDBTableHead, MDBTableBody, MDBBtn} from "mdb-react-ui-kit";
import {useTranslation} from "react-i18next";
import {notificationManager} from "../components/notificationManager";

const TopScore: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [rate, setRate] = useState<IUserResponse[]>([]);

  useEffect(() => {
   if(rate){
     getTopUsers().catch(console.error);
   }
  }, []);

  const getTopUsers = useCallback(
    async () => {
      const topUsers = await getTopRated();
      setRate(topUsers);
    }, [rate]
  );

  const resetAlbumsList = useCallback(
    async () => {
      try{
        await resetAlbums();
        notificationManager.pushSuccess([t('game.successLoad')]);
      }
      catch (e) {
        notificationManager.pushError([t('game.error')]);
      }
    }, []
  );

  return (
    <MDBContainer className='w-50'>
      <MDBRow>
        <MDBCol className="mb-4">
          <h1 className='mb-3 text-center mt-3'>{t('game.gameLabel')}</h1>
        </MDBCol>
      </MDBRow>
      <h2 className='mb-3 text-center mt-3'>{t('game.topRated')}</h2>
      <hr />
      <MDBTable>
        <MDBTableHead>
          <tr className="text-center">
            <td >{t('game.place')}</td>
            <td >{t('game.name')}</td>
            <td >{t('game.score')}</td>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {rate && (
            rate.map((item, index) => (
              <tr className='text-center' key={`${index + item.id}`}>
                <td className="mb-2 ">{index + 1}</td>
                <td className="mb-2 ">{item.name}</td>
                <td className="mb-2">{item.score}</td>
              </tr>
            ))
          )}
        </MDBTableBody>
      </MDBTable>
      <MDBRow>
        <MDBCol md='4' ><MDBBtn onClick={() => navigate('/', { replace: true })}>{t('game.again')}</MDBBtn></MDBCol>
        <MDBCol md='4'><a className='btn btn-info' href={`${serverAddress}${apiPrefix}/user/top/exportCsv`}>{t('game.topLoad')}</a></MDBCol>
        <MDBCol md='4'><a className='btn btn-info' href={`${serverAddress}${apiPrefix}/album/exportCsv`}>{t('game.statistic')}</a></MDBCol>
      </MDBRow>
      <MDBRow >
        <MDBCol md='12' className='mt-3'><MDBBtn onClick={() => resetAlbumsList()}>{t('game.resetAlbums')}</MDBBtn></MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default TopScore;
