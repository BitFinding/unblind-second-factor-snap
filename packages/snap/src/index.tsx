import type { EIP1559Transaction, OnRpcRequestHandler, OnTransactionHandler, OnSignatureHandler } from '@metamask/snaps-sdk';
import { Box, Text, Bold, Heading, Image, Link} from '@metamask/snaps-sdk/jsx';

import { qrcodegen } from './qrcodegen.js';

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

// Returns a string of SVG code for an image depicting the given QR Code, with the given number
	// of border modules. The string always uses Unix newlines (\n), regardless of the platform.
	function toSvgString(qr: qrcodegen.QrCode, border: number, lightColor: string, darkColor: string): string {
		if (border < 0)
			throw new RangeError("Border must be non-negative");
		let parts: Array<string> = [];
		for (let y = 0; y < qr.size; y++) {
			for (let x = 0; x < qr.size; x++) {
				if (qr.getModule(x, y))
					parts.push(`M${x + border},${y + border}h1v1h-1z`);
			}
		}
		return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${qr.size + border * 2} ${qr.size + border * 2}" stroke="none">
	<rect width="100%" height="100%" fill="${lightColor}"/>
	<path d="${parts.join(" ")}" fill="${darkColor}"/>
</svg>
`;
	}

/**
 * On Transaction
 */
export const onTransaction: OnTransactionHandler = async (data) => {
  const { chainId, transactionOrigin, transaction } = data;
  const encodedTransaction = Buffer.from(JSON.stringify(transaction)).toString('base64');

  // TODO: remove me
  console.log(`Tx: ${JSON.stringify(transaction)}`)
  

  // Name abbreviated for the sake of these examples here
    const QRC = qrcodegen.QrCode;

  console.log("QRC!");
  console.log(QRC);
  console.log(qrcodegen.QrCode.Ecc.MEDIUM);

    // Simple operation
    const qr0 = "Hello, world!";

    console.log("before encodeText");
  const qrCode = QRC.encodeText(qr0, qrcodegen.QrCode.Ecc.MEDIUM);
  console.log("after encodeText");
  console.log(qrCode);

  const svg = toSvgString(qr0, 4, "white", "black");
  console.log("after toSvgString");
  console.log(svg);

  return {
    content: (
      <Box>
        <Heading>Bitfinding second factor</Heading>
              {/* <Text>{qr0}</Text> */}
        <Image src={svg} />
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
  
//   const bitfindingData = await getBitfindingQR({
//     signature: encodedSignature,
//     origin: signatureOrigin ?? '',
//   });
  
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
