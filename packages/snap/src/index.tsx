/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type OnTransactionHandler,
  type OnSignatureHandler,
  type OnInstallHandler,
  type OnTransactionResponse,
  type OnSignatureResponse,
  type OnHomePageHandler,
  SeverityLevel,
} from '@metamask/snaps-sdk';

import {
  Box,
  Text,
  Image,
  Copyable,
  Link,
  Banner,
  Divider,
} from '@metamask/snaps-sdk/jsx';

import { deflate, DEFAULT_LEVEL } from './deflate.js';
import { qrcodegen } from './qrcodegen.js';

import { unblindLogo } from './assets';

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
async function generateQRCodeRaw(data: string): Promise<string> {
  // Generate QR code
  const QRC = qrcodegen.QrCode;
  const qrCode = QRC.encodeText(data, qrcodegen.QrCode.Ecc.LOW);

  // Convert to SVG
  const svg = toSvgString(qrCode, 1, 'white', '#1F2A35');

  return svg;
}

async function generateQRCode(data: string, mode: number): Promise<string> {
  // Compress data before generating QR code
  const compressedData = compressData(data);

  try {
    return generateQRCodeRemote(compressedData, mode);
  } catch (error) {
    // Fallback to basic QR code
    return generateQRCodeRaw(compressedData);
  }
}

/**
 *
 * @param data
 * @param mode
 */
async function generateQRCodeRemote(
  data: string,
  mode: number,
): Promise<string> {
  // Try to get QR code from the endpoint
  const response = await fetch('http://localhost:3002/unblind/qr', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data,
      type: mode, // Add type parameter
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get QR code from endpoint');
  }

  // Get the SVG text directly from the response
  const svgText = await response.text();

  return svgText;
}

const showDialogUnblind = async (svg: string, hash: string) => {
  const snapState = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'get',
    },
  });

  const userId = snapState?.userId;
  let qrLinkAccount: string | undefined;
  if (!userId) {
    // If no userId, call signupUser to get userId
    const userSignup = await signupUser();
    qrLinkAccount = userSignup.qrCode;
  } else {
    const userIdStr = userId.toString();
    // Check state of userId otherwise
    const userState = await getUserState(userIdStr);
    if (!userState.tgLinked) {
      const userInfo = await getUserInfo(userIdStr);
      qrLinkAccount = userInfo.qrCode;
    }
  }
  //   <Text alignment="center">
  //   Scan the QR code to review your transaction:
  // </Text>
  // <Box alignment="center" center>
  // <Image src={unblindLogo} />
  // </Box>

  // Split hash in half into hash1 and hash2
  const hash1 = hash.slice(0, hash.length / 2);
  const hash2 = hash.slice(hash.length / 2);

  return {
    content: (
      <Box alignment="center">
        {qrLinkAccount !== undefined && (
          <Box alignment="center">
            <Banner title="" severity="warning">
              <Link href="metamask://snap/local:http://localhost:8080/home">
                Connect your telegram
              </Link>
            </Banner>
          </Box>
        )}

        <Box alignment="center">
          <Text alignment="center">{hash1}</Text>
          <Text alignment="center">{hash2}</Text>
        </Box>
        <Divider />
        <Box direction="horizontal">
          {/* <Icon name="qr-code" ></Icon> */}
          {/* <Heading>Scan the QR code to understand your transaction with:</Heading> */}
          <Text>Scan the QR code to understand your transaction with:</Text>
        </Box>

        <Copyable value="https://unblind.app/" />

        {/* <Tooltip content={<Text>Scan with https://unblind.app/ to review your sign request</Text>}> */}
        <Image src={svg} />
        {/* </Tooltip> */}
      </Box>
    ),
    severity: SeverityLevel.Critical,
  };
};

/**
 * On Transaction
 *
 * @param data
 */
export const onTransaction: OnTransactionHandler = async (data) => {
  const { chainId, transaction } = data;

  // Get userId from snap state
  const snapState = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'get',
    },
  });

  // Fire-and-forget fetch - don't wait for response
  fetch('http://localhost:3002/unblind/transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chainId,
      ...transaction,
      userId: snapState?.userId,
    }),
  }).catch(() => {});

  const svg = await generateQRCode(
    JSON.stringify({ chainId, ...transaction }),
    1,
  );

  const hash = await getTransactionHash({
    chainId,
    ...transaction,
  });

  return (await showDialogUnblind(svg, hash)) as OnTransactionResponse;
};

export const onSignature: OnSignatureHandler = async (data) => {
  const { signature, signatureOrigin } = data;

  // Get userId from snap state
  const snapState = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'get',
    },
  });

  // Fire-and-forget fetch - don't wait for response
  fetch('http://localhost:3002/unblind/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...signature,
      userId: snapState?.userId,
    }),
  }).catch(() => {});

  const svg = await generateQRCode(JSON.stringify(signature), 1);

  const hash = await getMessageHash(signature);

  return (await showDialogUnblind(svg, hash)) as OnSignatureResponse;
};

type UserInfo = {
  userId: string;
  qrCode: string;
  botLink: string;
};

// Add return type to signupUser
async function signupUser(): Promise<UserInfo> {
  const response = await fetch('http://localhost:3002/unblind/userSignup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to signup user');
  }

  const userInfo = await response.json();

  // Save in snap
  await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'update',
      newState: {
        userId: userInfo.userId,
        qrCode: userInfo.qrCode,
        botLink: userInfo.botLink,
      },
    },
  });

  return userInfo;
}

async function getUserInfo(userId: string): Promise<UserInfo> {
  const response = await fetch(
    `http://localhost:3002/unblind/userInfo/${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to get user state');
  }

  return await response.json();
}

async function getMessageHash(message: any): Promise<string> {
  const response = await fetch('http://localhost:3002/unblind/messageHash', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error('Failed to get message hash');
  }

  let json = await response.json();
  return json.hash;
}

async function getTransactionHash(transaction: any): Promise<string> {
  const response = await fetch(
    'http://localhost:3002/unblind/transactionHash',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to get transaction hash');
  }

  let json = await response.json();
  return json.hash;
}

type UserState = {
  tgLinked: boolean;
};

async function getUserState(userId: string): Promise<UserState> {
  const response = await fetch(
    `http://localhost:3002/unblind/userState/${userId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to get user state');
  }
  return await response.json();
}

export const onInstall: OnInstallHandler = async () => {
  const { userId, qrCode, botLink } = await signupUser();

  await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'update',
      newState: {
        userId,
        qrCode,
        botLink,
      },
    },
  });

  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: (
        <Box>
          {/* <Tooltip content={<Text>Connect to the telegram bot to receive 2nd factor notifications</Text>}> */}
          {/* <Banner title="" severity="info"> */}
          <Text>Scan to link your second factor</Text>
          {/* </Banner> */}
          <Image src={qrCode} />
          {/* </Tooltip> */}
        </Box>
      ),
    },
  });
};

export const onHomePage: OnHomePageHandler = async () => {
  const snapState = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'get',
    },
  });

  const userId = snapState?.userId;
  let qrLinkAccount: string | undefined;
  if (!userId) {
    // If no userId, call signupUser to get userId
    const userSignup = await signupUser();
    qrLinkAccount = userSignup.qrCode;
  } else {
    const userIdStr = userId.toString();
    // Check state of userId otherwise
    const userState = await getUserState(userIdStr);
    if (!userState.tgLinked) {
      const userInfo = await getUserInfo(userIdStr);
      qrLinkAccount = userInfo.qrCode;
    }
  }

  return {
    content: (
      <Box>
        {/* <Heading>Welcome to Unblind</Heading> */}
        <Box alignment="center" center>
          <Image src={unblindLogo} />
        </Box>
        {qrLinkAccount !== undefined && (
          <Box>
            <Text>
              Link your Telegram account to receive Second Factor messages.
              Visit <Link href="https://unblind.app">unblind.app</Link> to learn
              more.
            </Text>
            {/* <Tooltip content={<Text>Scan with your phone camera to connect to the telegram bot and receive 2nd factor notifications</Text>}> */}
            <Image src={qrLinkAccount} />
            {/* </Tooltip> */}
          </Box>
        )}
        {qrLinkAccount === undefined && (
          <Text>
            Visit{' '}
            <Link href="https://unblind.app?userId={userId.toString()}">
              unblind.app
            </Link>{' '}
            to learn more.
          </Text>
        )}
      </Box>
    ),
  };
};
