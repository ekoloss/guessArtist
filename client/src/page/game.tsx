import React, {useCallback, useEffect, useState} from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from 'mdb-react-ui-kit';
import {Field, Form } from 'react-final-form';
// @ts-ignore
import ReactModal from 'react-modal';

import {checkResult, getQuestion, submitResult} from '../api';
import {IGameAlbumResponse, IGameCheckBody, IGameGetQuestionParams, IUserCreateBody} from "@models";
import {notificationManager} from '../components/notificationManager';

const Game: React.FC = () => {
  const [question, setQuestion] = useState<IGameAlbumResponse>();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { gameId } = useParams<'gameId'>();
  const { t } = useTranslation();

  ReactModal.setAppElement('#root');

  const defaultData: IGameCheckBody = {
    answer: "",
    albumId: "",
  };

  useEffect(() => {
    if(!gameId){
      return navigate('/', { replace: true });
    }
    if(!question?.album) {
      getNewQuestion().catch(console.error);
    }
  }, [gameId])

  const getNewQuestion = useCallback(async () => {
    try {
      const data = await getQuestion({gameId} as IGameGetQuestionParams);
      setQuestion(data);
    } catch (e) {
      notificationManager.pushError([t('game.error')]);
      return navigate('/', { replace: true });
    }
  }, [gameId]);

  const checkUserAnswer = useCallback(
    async (data: IGameCheckBody) => {
      try {
        if(!gameId){
          return navigate('/', { replace: true });
        }
        if(!data.answer){
          return;
        }
        const result = await checkResult( gameId, data);
        if(result.status === 'loose'){
          notificationManager.pushError([t('game.wrong')]);
          return navigate('/', { replace: true });
        }
        if(result.status === 'in_progress'){
          notificationManager.pushError([t('game.wrong')]);
          await getNewQuestion();
        }
        if(result.status === 'win'){
          notificationManager.pushSuccess([t('game.correct')]);
          setShowModal(true);
        }
      } catch (error) {
        console.log(error)
        notificationManager.pushError([t('game.error')]);
        return navigate('/', { replace: true });
      }
    },
    [navigate, t],
  );

  const setUserName = useCallback(
    async (data: IUserCreateBody) => {
      try {
        if(!gameId){
          return navigate('/', { replace: true });
        }
        await submitResult(gameId, data);
        setShowModal(false);
        return navigate('/top', { replace: true });
      } catch (e) {
        notificationManager.pushError([t('game.error')]);
        return navigate('/', { replace: true });
      }
    },
    [navigate, t]
  );
  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol md='12' lg='12' className="mb-4">
          <h1 className='mb-3 text-center mt-3'>{t('game.gameLabel')}</h1>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol md='12' lg='12' className="mb-4">
          <h2 className='mb-4 text-center mt-3'>{question?.album}</h2>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol md='12' lg='12' className="mb-4 text-center">
          <Form onSubmit={(val) => checkUserAnswer(val as IGameCheckBody)}>
            {({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit} id="quizAnswer">
                <MDBRow>
                  <MDBCol md='12' className="mb-4">
                    <Field
                      name='answer'
                      component='input'
                      defaultValue={defaultData.answer}
                      placeholder={t('game.artist')}
                      validate={value => (value ? undefined : "Required")}
                    />
                    <Field name='albumId' component='input' defaultValue={question?.albumId} type='hidden'/>
                    </MDBCol>
                 </MDBRow>
                <MDBRow>
                  <MDBCol md='12'>
                    <MDBBtn type="submit" className="xl">
                      {t('game.submit')}
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </form>
            )}
          </Form>
        </MDBCol>
      </MDBRow>
      <ReactModal
        isOpen={showModal}
        contentLabel="Winner!"
        style={{
          overlay: {
            backgroundColor: 'lightgreen',
          },
          content: {
            color: 'green',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            textAlign: 'center',
          },
        }}
      >
        <p>You are winner!</p>
        <p>Please enter your name</p>
        <Form onSubmit={(val) => setUserName(val as IUserCreateBody)}>
          {({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit} id="record">
              <MDBRow>
                <MDBCol md='12' className="mb-4">
                  <Field name='name' component='input' defaultValue={defaultData.answer} placeholder={t('game.username')}/>
                </MDBCol>
              </MDBRow>

              <MDBBtn type="submit" className="xl">Submit</MDBBtn>
            </form>
          )}
        </Form>
      </ReactModal>
    </MDBContainer>
  );
};

export default Game;
