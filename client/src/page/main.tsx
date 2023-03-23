import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MDBBtn, MDBInput, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { Form } from 'react-final-form';

import { ILoginBody } from '@models';

import { login } from '../api';
import { notificationManager } from '../components/notificationManager';

const defaultAccountData: ILoginBody = {
  login: '',
  password: '',
};

const Main: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sendUserData = useCallback(
    async (data: ILoginBody) => {
      try {
        const result = await login(data);
        notificationManager.pushSuccess(JSON.stringify(result));
        return navigate('/dashboard', { replace: true });
      } catch (error) {
        notificationManager.pushError([t('auth.loginError')]);
      }
    },
    [navigate, t],
  );

  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol md='12' className="mb-4">
          <h1 className='mb-3'>{t('auth.authorizationLabel')}</h1>
        </MDBCol>
      </MDBRow>

      <Form onSubmit={(val) => sendUserData(val as ILoginBody)}>
        {({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit}>
            <MDBRow>
              <MDBCol md='12' className="mb-4">
                <MDBInput
                  name="login"
                  label={t('auth.login')}
                  value={defaultAccountData.login}
                />
              </MDBCol>
            </MDBRow>

            <MDBRow>
              <MDBCol md='12' className="mb-4">
                <MDBInput
                  name="password"
                  type="password"
                  label={t('auth.password')}
                  value={defaultAccountData.password}
                />
              </MDBCol>
            </MDBRow>

            <MDBRow>
              <MDBCol md='12'>
                <MDBBtn type="submit" className="xl">
                  {t('auth.authorizeBtn')}
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </form>
        )}
      </Form>
    </MDBContainer>
  );
};

export default Main;
