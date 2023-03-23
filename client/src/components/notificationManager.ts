import { Store, iNotification } from 'react-notifications-component';

interface IPushNotification {
  type: 'danger' | 'success';
  message: string;
  onRemoval?: () => void;
}

class NotificationManager {
  private messageTemplate: iNotification = {
    container: 'bottom-right',
    dismiss: {
      duration: 13000,
      onScreen: true,
    },
    insert: 'bottom',
    animationIn: ['animate__animated animate__fadeIn'],
    animationOut: ['animate__animated animate__fadeOut'],
  };

  public pushError(message: string | string[], onRemoval?: () => void) {
    if (message instanceof Array) {
      message.map((item) =>
        this.addNotification({
          type: 'danger',
          message: item,
          onRemoval,
        }),
      );
      return;
    }

    this.addNotification({
      type: 'danger',
      message,
      onRemoval,
    });
  }

  public pushSuccess(message: string | string[], onRemoval?: () => void) {
    if (message instanceof Array) {
      message.map((item) =>
        this.addNotification({
          type: 'success',
          message: item,
          onRemoval,
        }),
      );
      return;
    }

    this.addNotification({
      type: 'success',
      message,
      onRemoval,
    });
  }

  private addNotification({ message, onRemoval, type }: IPushNotification) {
    Store.addNotification({
      ...this.messageTemplate,
      type,
      message,
      onRemoval,
    });
  }
}

export const notificationManager = new NotificationManager();
