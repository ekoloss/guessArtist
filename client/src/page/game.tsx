import React, {useCallback, useEffect, useState} from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow} from 'mdb-react-ui-kit';
import { Form } from 'react-final-form';

import {checkResult, getQuestion} from '../api';
import {IGameAlbumResponse, IGameCheckBody, IGameGetQuestionParams} from "@models";
import {notificationManager} from '../components/notificationManager';

const Game: React.FC = () => {
  const [question, setQuestion] = useState<IGameAlbumResponse>();
  const navigate = useNavigate();
  const { gameId } = useParams<'gameId'>();
  const { t } = useTranslation();

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
    }
  }, [gameId]);

  const checkUserAnswer = useCallback(
    async (data: IGameCheckBody) => {
      try {
        console.log(question?.albumId)
        console.log(gameId)
        console.log(data)
        if(!gameId || !question?.albumId){
          return;
          // return navigate('/', { replace: true });
        }
        const result = await checkResult( gameId, {...data, albumId: question.albumId});
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
          // return navigate(`/${gameId}`, { replace: true }); @TODO navigate to stats page (get UserName)
        }
      } catch (error) {
        console.log(error)
        notificationManager.pushError([t('auth.loginError')]);
      }
    },
    [navigate, t],
  );

  console.log(question)
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
        <MDBCol md='12' lg='12' className="mb-4">
          <Form onSubmit={(val) => checkUserAnswer( val as IGameCheckBody)}>
            {({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit}>
                <MDBRow>
                  <MDBCol md='12' className="mb-4">
                      <MDBInput
                        name="answer"
                        type='text'
                        label={t('game.artist')}
                        defaultValue="123"
                      />
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

      {/*<Form onSubmit={(val) => sendUserData(val as ILoginBody)}>*/}
      {/*  {({ handleSubmit, submitting }) => (*/}
      {/*    <form onSubmit={handleSubmit}>*/}
      {/*      <MDBRow>*/}
      {/*        <MDBCol md='12' className="mb-4">*/}
      {/*          <MDBInput*/}
      {/*            name="login"*/}
      {/*            label={t('auth.login')}*/}
      {/*            value={defaultAccountData.login}*/}
      {/*          />*/}
      {/*        </MDBCol>*/}
      {/*      </MDBRow>*/}

      {/*      <MDBRow>*/}
      {/*        <MDBCol md='12' className="mb-4">*/}
      {/*          <MDBInput*/}
      {/*            name="password"*/}
      {/*            type="password"*/}
      {/*            label={t('auth.password')}*/}
      {/*            value={defaultAccountData.password}*/}
      {/*          />*/}
      {/*        </MDBCol>*/}
      {/*      </MDBRow>*/}

            {/*<MDBRow>*/}
            {/*  <MDBCol md='12'>*/}
            {/*    <MDBBtn type="submit" className="xl">*/}
            {/*      {t('auth.authorizeBtn')}*/}
            {/*    </MDBBtn>*/}
            {/*  </MDBCol>*/}
            {/*</MDBRow>*/}
      {/*    </form>*/}
      {/*  )}*/}
      {/*</Form>*/}
    </MDBContainer>
  );
};

export default Game;
