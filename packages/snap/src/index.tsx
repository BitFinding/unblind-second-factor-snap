import type { EIP1559Transaction, OnRpcRequestHandler, OnTransactionHandler, OnSignatureHandler } from '@metamask/snaps-sdk';
import { Box, Text, Bold, Heading, Image, Link} from '@metamask/snaps-sdk/jsx';

import { qrcodegen } from './qrcodegen.js';
import { deflate, DEFAULT_LEVEL } from './deflate.js';

declare global {
  interface Window {
    ethereum: any;
  }
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

function runLengthEncoding(data: string): string {

    let result = '';
    let count = 1;

    for (let i = 0; i < data.length; i++) {
        let j = i + 1;
        while (data[i] === data[j]) {
            count++;
            if (count === 9) {
                j++;
                break;
            } else {
                j++;
            }
        }
        result = result.concat(`${count}${data[i]}`);
        count = 1;
        i = j - 1;
    }
    return result;
}

function compressData(data: string): string {
  // Convert string to byte array
  const byteArray = new TextEncoder().encode(data);
  
  // Convert Uint8Array to regular array for deflate
  const array = Array.from(byteArray);
  
  // Compress using deflate
  const compressed = deflate(array, DEFAULT_LEVEL);
  
  // Convert compressed array to Uint8Array for base64 encoding
  const compressedArray = new Uint8Array(compressed);
  
  // Convert to base64
  return btoa(String.fromCharCode.apply(null, compressedArray));
}

async function generateQRCode(data: string): Promise<string> {
  // Compress and encode the data
  // const compressedData = runLengthEncoding(jsonData);
  console.log(`Original: ${data}`);
  const compressedData = compressData(data);
    /* const encodedData = Buffer.from(compressedData).toString('base64'); */

    console.log(`Original: ${data}`);
  console.log(`Compressed and encoded: ${compressedData}`);

  // Generate QR code
  const QRC = qrcodegen.QrCode;
  console.log("Generating QR code");
  const qrCode = QRC.encodeText(compressedData, qrcodegen.QrCode.Ecc.LOW);
  console.log("after encodeText", qrCode);
  console.log(qrCode);

  // Convert to SVG
  const svg = toSvgString(qrCode, 4, "white", "black");
  console.log("after toSvgString");
  console.log(svg);

  return svg;
}

/**
 * On Transaction
 */
export const onTransaction: OnTransactionHandler = async (data) => {
    const { chainId, transactionOrigin, transaction } = data;
  // const encodedTransaction = Buffer.from(JSON.stringify(transaction)).toString('base64');

  const svg = await generateQRCode(JSON.stringify(transaction));

  return {
    content: (
      <Box>
        <Heading>Bitfinding second factor</Heading>
        <Image src={svg} />
      </Box>
    ),
    severity: 'critical',
  };
};

export const onSignature: OnSignatureHandler = async (data) => {
  const { signature, signatureOrigin } = data;

  const svg = await generateQRCode(JSON.stringify(signature));
  
  return {
    content: (
      <Box>
        <Heading>Bitfinding second factor</Heading>
        <Image src={svg} />
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
