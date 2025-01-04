import type { EIP1559Transaction, OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-sdk';
import { Box, Text, Bold, Heading, Image, Link} from '@metamask/snaps-sdk/jsx';

declare global {
  interface Window {
    ethereum: any;
  }
}

/**
 * On Transaction
 */
export const onTransaction: OnTransactionHandler = async (data) => {
  const { chainId, transactionOrigin } = data;
  const transaction = data.transaction as EIP1559Transaction;
  // Send Tx to bitfinding api
  // generate qr/hash/
  //const url = new URL(`https://wwwapi.bitfinding.com/unblind/qr`);
  console.log(`Tx: ${JSON.stringify(data.transaction)}`)

    // If nonce field is empty, get it from the rpc call
    // if(!transaction.nonce){
    //   const nonceRequest = await ethereum.request({
    //     method: 'eth_getTransactionCount',
    //     params: [transaction.from, 'latest'],
    //   });
    //   console.log(`Nonce: ${nonceRequest}`);
    // transaction.nonce = (parseInt(nonceRequest as string, 16) + 1).toString() || '0';
    // }

  const url = new URL(`https://localhost:3001/unblind/qr`);
  url.searchParams.append('chainId', chainId);
  url.searchParams.append('from', transaction.from);
  url.searchParams.append('to', transaction.to);
  url.searchParams.append('value', transaction.value);
url.searchParams.append('gas', transaction.gas);
  url.searchParams.append('maxFeePerGas', transaction.maxFeePerGas);
  url.searchParams.append('maxPriorityFeePerGas', transaction.maxPriorityFeePerGas);
  url.searchParams.append('data', transaction.data);
  url.searchParams.append('origin', transactionOrigin ?? '');
  url.searchParams.append('nonce', transaction.nonce);
    
  interface BitfindingData {
    url: string;
    svg: string;
}
  let bitfindingData: BitfindingData | undefined;
  console.log("AAA")
    const bitfindingRequest = await fetch(url.toString());
    console.log("BBB")
    bitfindingData = await bitfindingRequest.json();
    console.log("CCC")
    console.log("Bitfinding Data: ", bitfindingData);

  return {
    content: (
      <Box>
        <Heading>Bitfinding QR</Heading>
        <Text >{bitfindingData!.url}</Text>
        {bitfindingData ? <Image src={bitfindingData.svg} /> : null}
      </Box>
    ),
    severity: 'critical',
  };
};

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'eth_sendTransaction':
      return   await snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: (
            <Box>
              <Heading>Bitfinding Alert</Heading>
              <Text>Something happened in the system.</Text>
            </Box>
          ),
        },
      });
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: (
            <Box>
              <Text>
                Hello, <Bold>{origin}</Bold>!
              </Text>
              <Text>
                This custom confirmation is just for display purposes.
              </Text>
              <Text>
                But you can edit the snap source code to make it do something,
                if you want to!
              </Text>
            </Box>
          ),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
