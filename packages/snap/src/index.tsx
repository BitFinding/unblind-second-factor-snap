/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type {
  OnRpcRequestHandler,
  OnTransactionHandler,
  OnSignatureHandler,
} from '@metamask/snaps-sdk';
import {
  Box,
  Text,
  Bold,
  Heading,
  Image,
  Copyable,
} from '@metamask/snaps-sdk/jsx';

import { deflate, DEFAULT_LEVEL } from './deflate.js';
import { qrcodegen } from './qrcodegen.js';

declare global {
  interface Window {
    ethereum: any;
  }
}

// Returns a string of SVG code for an image depicting the given QR Code, with the given number
// of border modules. The string always uses Unix newlines (\n), regardless of the platform.
/**
 *
 * @param qr
 * @param border
 * @param lightColor
 * @param darkColor
 */
function toSvgString(
  qr: qrcodegen.QrCode,
  border: number,
  lightColor: string,
  darkColor: string,
): string {
  if (border < 0) {
    throw new RangeError('Border must be non-negative');
  }
  const parts: string[] = [];
  for (let y = 0; y < qr.size; y++) {
    for (let x = 0; x < qr.size; x++) {
      if (qr.getModule(x, y)) {
        parts.push(`M${x + border},${y + border}h1v1h-1z`);
      }
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${
    qr.size + border * 2
  } ${qr.size + border * 2}" stroke="none">
  <rect width="100%" height="100%" fill="${lightColor}"/>
  <path d="${parts.join(' ')}" fill="${darkColor}"/>
</svg>
`;
}

/**
 *
 * @param data
 */
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

/**
 * @description Compress data
 * @param data
 */
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

/**
 *
 * @param data
 */
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
  console.log('Generating QR code');
  const qrCode = QRC.encodeText(compressedData, qrcodegen.QrCode.Ecc.LOW);
  console.log('after encodeText', qrCode);
  console.log(qrCode);

  // Convert to SVG
  const svg = toSvgString(qrCode, 4, 'white', 'black');
  console.log('after toSvgString');
  console.log(svg);

  return svg;
}

const bitfindingLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="155" height="30" viewBox="0 0 253 50" fill="none">
<path d="M20.7334 34.9495V41.08L0 29.1109V22.9607L13.5286 30.776L13.5393 30.7867L13.7076 30.8834H13.7273L20.7334 34.9495ZM0 31.9111L20.7334 43.8803V50L0 38.0219V31.9111Z" fill="#EF576E"/>
<path d="M12.2878 21.1709L13.0148 21.5881V27.6989L0 20.1647V14.0736L5.89773 17.4916C5.93712 17.5113 5.98188 17.531 6.02306 17.5489L12.2878 21.1709Z" fill="#EF576E"/>
<path d="M6.02306 17.547C5.98367 17.5238 5.9407 17.5041 5.89773 17.4897L0 14.0718L5.89773 17.5005C5.93354 17.5112 5.96577 17.5273 5.99441 17.5488L12.2789 21.1673L6.02306 17.547ZM13.5376 30.7856C13.5626 30.8107 13.5895 30.8304 13.6217 30.8429C13.6486 30.859 13.6772 30.8715 13.7059 30.8823L13.5376 30.7856ZM15.4265 21.5773L15.4372 21.5881V21.5684L15.4265 21.5773ZM6.02306 17.547C5.98367 17.5238 5.9407 17.5041 5.89773 17.4897L0 14.0718L5.89773 17.5005C5.93354 17.5112 5.96577 17.5273 5.99441 17.5488L12.2789 21.1673L6.02306 17.547Z" fill="#EF576E"/>
<path d="M28.4558 40.8204V46.9401L23.1543 50V43.8803L28.4558 40.8204ZM30.8729 39.4149L36.1744 36.364V42.4837L30.8729 45.5346V39.4346M43.9091 14.0711V20.1712L38.5825 23.2418V17.1507L43.9091 14.0711ZM43.9091 22.9714V29.1127L38.5933 32.1725V32.1636L38.5843 26.0528V26.042L43.9091 22.9714ZM43.9091 31.9111V38.0219L38.5933 41.0925V34.9728L43.9091 31.9111ZM42.6891 11.9691L37.3822 15.0487L16.6471 3.07062L21.9486 0L42.6891 11.9691ZM34.959 16.4444L29.6718 19.4845L22.6211 15.4166L22.5244 15.3593C22.5126 15.352 22.4989 15.3483 22.485 15.3486L8.92773 7.52435L14.2275 4.45553L34.959 16.4444Z" fill="#EF576E"/>
<path d="M19.5223 16.4163L14.2208 19.4869H14.2101L7.12348 15.3886C7.08946 15.3796 7.05723 15.3671 7.02679 15.3492L1.20605 11.9688L6.50757 8.89819L19.5223 16.4163Z" fill="#EF576E"/>
<path d="M7.0001 15.3312L1.20801 11.9706L7.02875 15.3509C7.06814 15.3617 7.08604 15.3796 7.12543 15.3903C7.08738 15.3635 7.04498 15.3436 7.0001 15.3312ZM7.0001 15.3312L1.20801 11.9706L7.02875 15.3509C7.06814 15.3617 7.08604 15.3796 7.12543 15.3903C7.08738 15.3635 7.04498 15.3436 7.0001 15.3312ZM22.5662 15.3688C22.5544 15.3615 22.5407 15.3578 22.5269 15.3581L22.6235 15.4154C22.611 15.3868 22.5913 15.3778 22.5627 15.3671H22.5662V15.3688ZM7.0001 15.3312L1.20801 11.9706L7.02875 15.3509C7.06814 15.3617 7.08604 15.3796 7.12543 15.3903C7.08738 15.3635 7.04498 15.3436 7.0001 15.3312Z" fill="#EF576E"/>
<path d="M15.4268 21.5765L15.4373 21.5659V21.5942L15.4268 21.5765Z" fill="#1E6799"/>
<path d="M27.2507 20.8802L21.9438 23.9401L16.6369 20.8802L21.9438 17.8096L27.2507 20.8802ZM15.4355 22.9911L20.7371 26.042V32.1528L15.4355 29.093V22.9911ZM28.4557 22.9911V29.1109L23.1542 32.1618V26.042L28.4557 22.9911Z" fill="white"/>
<path d="M28.4548 31.9111L28.4656 31.8914V38.0219H28.4548L23.1533 41.0818V34.962L28.4548 31.9111ZM36.1734 27.4458V33.5655L30.8952 36.6164L30.8755 36.6361V30.5164L30.8952 30.4967L36.1627 27.4458H36.1734ZM36.1609 18.5365V24.6473L30.8737 27.6982V21.5785L36.1609 18.5365Z" fill="#EF576E"/>
<path d="M20.7334 34.9495V41.08L0 29.1109V22.9607L13.5286 30.776L13.5393 30.7867L13.7076 30.8834H13.7273L20.7334 34.9495ZM0 31.9111L20.7334 43.8803V50L0 38.0219V31.9111Z" fill="#EF576E"/>
<path d="M12.2878 21.1709L13.0148 21.5881V27.6989L0 20.1647V14.0736L5.89773 17.4916C5.93712 17.5113 5.98188 17.531 6.02306 17.5489L12.2878 21.1709Z" fill="#EF576E"/>
<path d="M6.02306 17.547C5.98367 17.5238 5.9407 17.5041 5.89773 17.4897L0 14.0718L5.89773 17.5005C5.93354 17.5112 5.96577 17.5273 5.99441 17.5488L12.2789 21.1673L6.02306 17.547ZM13.5376 30.7856C13.5626 30.8107 13.5895 30.8304 13.6217 30.8429C13.6486 30.859 13.6772 30.8715 13.7059 30.8823L13.5376 30.7856ZM15.4265 21.5773L15.4372 21.5881V21.5684L15.4265 21.5773ZM6.02306 17.547C5.98367 17.5238 5.9407 17.5041 5.89773 17.4897L0 14.0718L5.89773 17.5005C5.93354 17.5112 5.96577 17.5273 5.99441 17.5488L12.2789 21.1673L6.02306 17.547Z" fill="#EF576E"/>
<path d="M28.4558 40.8204V46.9401L23.1543 50V43.8803L28.4558 40.8204ZM30.8729 39.4149L36.1744 36.364V42.4837L30.8729 45.5346V39.4346M43.9091 14.0711V20.1712L38.5825 23.2418V17.1507L43.9091 14.0711ZM43.9091 22.9714V29.1127L38.5933 32.1725V32.1636L38.5843 26.0528V26.042L43.9091 22.9714ZM43.9091 31.9111V38.0219L38.5933 41.0925V34.9728L43.9091 31.9111ZM42.6891 11.9691L37.3822 15.0487L16.6471 3.07062L21.9486 0L42.6891 11.9691ZM34.959 16.4444L29.6718 19.4845L22.6211 15.4166L22.5244 15.3593C22.5126 15.352 22.4989 15.3483 22.485 15.3486L8.92773 7.52435L14.2275 4.45553L34.959 16.4444Z" fill="#EF576E"/>
<path d="M19.5223 16.4163L14.2208 19.4869H14.2101L7.12348 15.3886C7.08946 15.3796 7.05723 15.3671 7.02679 15.3492L1.20605 11.9688L6.50757 8.89819L19.5223 16.4163Z" fill="#EF576E"/>
<path d="M7.0001 15.3312L1.20801 11.9706L7.02875 15.3509C7.06814 15.3617 7.08604 15.3796 7.12543 15.3903C7.08738 15.3635 7.04498 15.3436 7.0001 15.3312ZM7.0001 15.3312L1.20801 11.9706L7.02875 15.3509C7.06814 15.3617 7.08604 15.3796 7.12543 15.3903C7.08738 15.3635 7.04498 15.3436 7.0001 15.3312ZM22.5662 15.3688C22.5544 15.3615 22.5407 15.3578 22.5269 15.3581L22.6235 15.4154C22.611 15.3868 22.5913 15.3778 22.5627 15.3671H22.5662V15.3688ZM7.0001 15.3312L1.20801 11.9706L7.02875 15.3509C7.06814 15.3617 7.08604 15.3796 7.12543 15.3903C7.08738 15.3635 7.04498 15.3436 7.0001 15.3312Z" fill="#EF576E"/>
<path d="M15.4268 21.5765L15.4373 21.5659V21.5942L15.4268 21.5765Z" fill="#1E6799"/>
<path d="M27.2507 20.8802L21.9438 23.9401L16.6369 20.8802L21.9438 17.8096L27.2507 20.8802ZM15.4355 22.9911L20.7371 26.042V32.1528L15.4355 29.093V22.9911ZM28.4557 22.9911V29.1109L23.1542 32.1618V26.042L28.4557 22.9911Z" fill="white"/>
<path d="M28.4548 31.9111L28.4656 31.8914V38.0219H28.4548L23.1533 41.0818V34.962L28.4548 31.9111ZM36.1734 27.4458V33.5655L30.8952 36.6164L30.8755 36.6361V30.5164L30.8952 30.4967L36.1627 27.4458H36.1734ZM36.1609 18.5365V24.6473L30.8737 27.6982V21.5785L36.1609 18.5365Z" fill="#EF576E"/>
<path d="M70.6663 36.9719H60.4551V13.2908H70.2259C75.1787 13.2908 77.9271 15.8683 77.9271 19.3988C77.9271 22.2819 76.1967 24.0797 73.8888 24.8281C76.5697 25.3022 78.4685 27.781 78.4685 30.5607C78.4709 34.3246 75.5854 36.9719 70.6663 36.9719ZM69.5472 17.1222H65.2057V23.0593H69.5472C71.7854 23.0593 73.0753 22.0413 73.0753 20.1088C73.0753 18.2099 71.7854 17.1222 69.5472 17.1222ZM69.8866 26.7245H65.2057V33.102H69.9901C72.298 33.102 73.6553 31.983 73.6553 29.9807C73.6529 27.9471 72.1945 26.7245 69.8866 26.7245ZM83.1181 13.2884H87.8688V36.9695H83.1181V13.2884ZM92.1429 13.2884H109.514V17.1222H103.204V36.9695H98.453V17.1222H92.1429V13.2884ZM113.824 13.2884H128.447V17.1222H118.572V23.194H126.139V26.9604H118.572V36.9695H113.822V13.2884H113.824ZM132.653 13.2884H137.404V36.9695H132.653V13.2884ZM163.188 13.2547V36.9695H158.438L147.683 20.7176V36.9695H142.932V13.2547H147.683L158.438 29.5403V13.2547H163.188ZM189.483 25.165C189.483 32.3247 184.564 36.9719 176.997 36.9719H168.719V13.2908H176.997C184.561 13.2884 189.483 17.9717 189.483 25.165ZM176.827 32.9336C181.813 32.9336 184.629 30.0841 184.629 25.165C184.629 20.2459 181.813 17.293 176.827 17.293H173.467V32.9336H176.827ZM193.892 13.2884H198.643V36.9695H193.892V13.2884ZM224.427 13.2547V36.9695H219.676L208.921 20.7176V36.9695H204.171V13.2547H208.921L219.676 29.5403V13.2547H224.427ZM251.908 20.4144H246.445C245.36 18.4121 243.391 17.3604 240.881 17.3604C236.64 17.3604 233.688 20.3807 233.688 25.0952C233.688 29.9133 236.674 32.8975 241.083 32.8975C244.746 32.8975 247.088 30.7941 247.8 27.4345H239.658V23.8053H252.483V27.9447C251.533 32.7627 247.225 37.174 240.915 37.174C234.027 37.174 228.802 32.1875 228.802 25.0952C228.802 18.003 234.027 12.9828 240.881 12.9828C246.175 12.9852 250.382 15.6637 251.908 20.4144Z" fill="white"/>
</svg>`;

/**
 * On Transaction
 * @param data
 */
export const onTransaction: OnTransactionHandler = async (data) => {
  const { chainId, transactionOrigin, transaction } = data;

  const svg = await generateQRCode(JSON.stringify({ chainId, ...transaction }));

  return {
    content: (
      // <Container backgroundColor="default">
      <Box alignment="center">
        <Image src={bitfindingLogo} />
        <Text alignment="center">
          Scan the QR code with another device to understand your transaction.
        </Text>
        <Copyable value="https://bitfinding.com/unblind" />
        <Image src={svg} />
      </Box>
      // </Container>
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
      return await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
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
