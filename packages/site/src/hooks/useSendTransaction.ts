import { useRequest } from './useRequest';

export const useSendTransaction = () => {
  const request = useRequest();

  const getAccount = async (): Promise<string[]> => {
    const accounts = await request({
      method: 'eth_requestAccounts',
    });
    return accounts as string[];
  };

  const sendTransaction = async (params: any) => {
    try {
      const txHash = (await request({
        method: 'eth_sendTransaction',
        params: [params],
      })) as string;

      return txHash;
    } catch (error) {
      console.error('Error sending transaction: ', error);
      throw error;
    }
  };

  return { sendTransaction, getAccount };
};
