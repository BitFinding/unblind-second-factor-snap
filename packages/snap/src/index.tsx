import type { EIP1559Transaction, OnRpcRequestHandler, OnTransactionHandler, OnSignatureHandler } from '@metamask/snaps-sdk';
import { Box, Text, Bold, Heading, Image, Link} from '@metamask/snaps-sdk/jsx';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface BitfindingData {
  url: string;
  svg: string;
}

async function getBitfindingQR(params: {
  chainId?: string;
  transaction?: string;
  signature?: string;
  origin: string;
}): Promise<BitfindingData> {
  const url = new URL(`https://wwwapi.bitfinding.com/unblind/qr`);
  
  if (params.chainId) {
    url.searchParams.append('chainId', params.chainId);
  }
  if (params.transaction) {
    url.searchParams.append('transaction', params.transaction);
  }
  if (params.signature) {
    url.searchParams.append('signature', params.signature);
  }
  url.searchParams.append('origin', params.origin);

  const bitfindingRequest = await fetch(url.toString());
  return await bitfindingRequest.json();
}

/**
 * On Transaction
 */
export const onTransaction: OnTransactionHandler = async (data) => {
  const { chainId, transactionOrigin, transaction } = data;
  const encodedTransaction = Buffer.from(JSON.stringify(transaction)).toString('base64');

  // TODO: remove me
  console.log(`Tx: ${JSON.stringify(transaction)}`)
  
  const bitfindingData = await getBitfindingQR({
    chainId,
    transaction: encodedTransaction,
    origin: transactionOrigin ?? '',
  });

  return {
    content: (
      <Box>
        <Heading>Bitfinding second factor</Heading>
        <Text>{bitfindingData.url}</Text>
        <Image src={bitfindingData.svg} />
      </Box>
    ),
    severity: 'critical',
  };
};

export const onSignature: OnSignatureHandler = async (data) => {
  const { signature, signatureOrigin } = data;

  const encodedSignature = Buffer.from(JSON.stringify(signature)).toString('base64');
  
  // TODO: remove me
  console.log(`Tx: ${JSON.stringify(signature)}`);
  
  const bitfindingData = await getBitfindingQR({
    signature: encodedSignature,
    origin: signatureOrigin ?? '',
  });
  
  return {
    content: (
      <Box>
        <Heading>Bitfinding second factor</Heading>
        <Text>{bitfindingData.url}</Text>
        <Image src={bitfindingData.svg} />
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
