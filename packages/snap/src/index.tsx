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

/** Helper for making requests to Unblind backend API */
async function apiRequest(
  endpoint: string,
  method: string,
  body?: object,
  responseType: 'json' | 'text' = 'json',
) {
  const url = `http://localhost:3002/unblind/${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return responseType === 'text' ? response.text() : response.json();
}

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

/** Compresses transaction data using DEFLATE algorithm */
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

/** Generates QR code SVG from data */
async function generateQRCodeRaw(data: string): Promise<string> {
  const QRC = qrcodegen.QrCode;
  const qrCode = QRC.encodeText(data, qrcodegen.QrCode.Ecc.LOW);

  const svg = toSvgString(qrCode, 1, 'white', '#1F2A35');

  return svg;
}

/** Generates QR code SVG for compressed transaction data with fallback to local generation */
async function generateQRCode(data: string, mode: number): Promise<string> {
  const compressedData = compressData(data);

  try {
    return generateQRCodeRemote(compressedData, mode);
  } catch (error) {
    // Fallback to basic QR code
    return generateQRCodeRaw(compressedData);
  }
}

async function generateQRCodeRemote(
  data: string,
  mode: number,
): Promise<string> {
  // Try to get QR code from the endpoint
  const svgText = await apiRequest('qr', 'POST', { data, type: mode }, 'text');
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
          <Text>Scan the QR code to understand your transaction with:</Text>
        </Box>

        <Copyable value="https://unblind.app/" />

        <Image src={svg} />
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

  // Persist user state in encrypted snap storage
  const snapState = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'get',
    },
  });

  // Fire-and-forget fetch - don't wait for response
  apiRequest('transaction', 'POST', {
    chainId,
    ...transaction,
    userId: snapState?.userId,
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

  // Persist user state in encrypted snap storage
  const snapState = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'get',
    },
  });

  // Fire-and-forget fetch - don't wait for response
  apiRequest('message', 'POST', {
    ...signature,
    userId: snapState?.userId,
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

/** Creates new user account in Unblind system and persists credentials */
async function signupUser(): Promise<UserInfo> {
  const userInfo = await apiRequest('userSignup', 'POST');

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
  return await apiRequest(`userInfo/${userId}`, 'GET');
}

async function getMessageHash(message: any): Promise<string> {
  const json = await apiRequest('messageHash', 'POST', { message });
  return json.hash;
}

async function getTransactionHash(transaction: any): Promise<string> {
  const json = await apiRequest('transactionHash', 'POST', transaction);
  return json.hash;
}

type UserState = {
  tgLinked: boolean;
};

async function getUserState(userId: string): Promise<UserState> {
  return await apiRequest(`userState/${userId}`, 'GET');
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
          <Text>Scan to link your second factor</Text>
          <Image src={qrCode} />
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
            <Image src={qrLinkAccount} />
          </Box>
        )}
        {qrLinkAccount === undefined && (
          <Text>
            Visit
            <Link href="https://unblind.app?userId={userId.toString()}">
              unblind.app
            </Link>
            to learn more.
          </Text>
        )}
      </Box>
    ),
  };
};
