import {
  StructuredMessage,
  StructuredMessageSignature,
  StructuredMessenger,
} from '@sqlpm/types-ts';

// TODO: A whole lot of work on this
export const sendMessage: StructuredMessageSignature = (
  message: StructuredMessage,
) => {
  // eslint-disable-next-line no-constant-condition
  if (true) {
    switch (message.level) {
      case 'debug':
        // eslint-disable-next-line no-console
        console.debug(message.message);
        break;
      case 'error':
        // eslint-disable-next-line no-console
        console.error(message.message);
        break;
      case 'info':
        // eslint-disable-next-line no-console
        console.info(message.message);
        break;
      case 'warn':
        // eslint-disable-next-line no-console
        console.warn(message.message);
        break;
      default:
        // eslint-disable-next-line no-console
        console.log(message.message);
        break;
    }
  }
};

export const structuredMessenger = (): StructuredMessenger => {
  const debugSend = (message: string) => sendMessage({ level: 'debug', message });
  const errorSend = (message: string) => sendMessage({ level: 'error', message });
  const infoSend = (message: string) => sendMessage({ level: 'info', message });
  const warnSend = (message: string) => sendMessage({ level: 'warn', message });

  return {
    debug: debugSend,
    error: errorSend,
    info: infoSend,
    warn: warnSend,
  };
};
