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
import { deflateSync } from 'fflate';

import { unblindLogo } from './assets';

/**
 * Helper for making requests to Unblind backend API.
 *
 * @param endpoint - The API endpoint to call.
 * @param method - The HTTP method to use.
 * @param body - The request body.
 * @param responseType - The expected response type.
 * @returns The response from the API.
 */
async function apiRequest(
  endpoint: string,
  method: string,
  body?: object,
  responseType: 'json' | 'text' = 'json',
) {
  const url = `https://api.unblind.app/unblind/${endpoint}`;
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

/**
 * Compresses transaction data using DEFLATE algorithm.
 *
 * @param data - The string data to compress.
 * @returns The compressed data as a base64 string.
 */
function compressData(data: string): string {
  // Convert string to byte array
  const byteArray = new TextEncoder().encode(data);

  // Compress using deflate
  const compressed = deflateSync(byteArray, { level: 9 });

  // Convert compressed byte array to a base64 string
  // eslint-disable-next-line no-restricted-globals
  return Buffer.from(compressed).toString('base64');
}

/**
 * Generates QR code SVG using a remote service.
 *
 * @param data - The data to encode.
 * @param mode - The QR code generation mode.
 * @returns A promise that resolves to the QR code SVG string.
 */
async function generateQRCode(data: string, mode: number): Promise<string> {
  const compressedData = compressData(data);

  // Try to get QR code from the endpoint
  return apiRequest('qr', 'POST', { data: compressedData, type: mode }, 'text');
}

/**
 * Gets the user ID from snap state.
 *
 * @returns A promise that resolves to the user ID, or undefined if not found.
 */
async function getUserId(): Promise<string | undefined> {
  const snapState = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'get',
    },
  });

  const userId = snapState?.userId;
  if (userId && typeof userId === 'string') {
    return userId;
  }
  return undefined;
}

/**
 * Gets the QR code link for account linking.
 *
 * @returns A promise that resolves to the QR code link, or undefined if not
 * applicable.
 */
async function getQrLink(): Promise<string | undefined> {
  const userId = await getUserId();

  let qrLinkAccount: string | undefined;
  if (userId) {
    try {
      // Check state of userId otherwise
      const userInfo = await getUserInfo(userId);
      if (!userInfo.tgLinked) {
        qrLinkAccount = userInfo.qrCode;
      }
    } catch (error) {
      // Ignore error
    }
  } else {
    try {
      // If no userId, call signupUser to get userId
      const userSignup = await signupUser();
      qrLinkAccount = userSignup.qrCode;
    } catch (error) {
      // Ignore error
    }
  }

  return qrLinkAccount;
}

const showDialogUnblind = async (
  svg: string,
  hash: string,
  linkAccount: boolean,
) => {
  // Split hash in half into hash1 and hash2
  const hash1 = hash.slice(0, hash.length / 2);
  const hash2 = hash.slice(hash.length / 2);

  return {
    content: (
      <Box alignment="center">
        {linkAccount && (
          <Box alignment="center">
            <Banner title="" severity="warning">
              <Link href="metamask://snap/npm:@bitfinding/unblind-second-factor-snap/home">
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
 * On Transaction.
 *
 * @param data - The transaction data.
 * @returns The transaction response.
 */
export const onTransaction: OnTransactionHandler = async (data) => {
  const { chainId, transaction, transactionOrigin } = data;

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
    origin: transactionOrigin,
    ...transaction,
    userId: snapState?.userId,
  }).catch((error) => {
    console.error('Non-critical API request failed:', error);
  });

  const [svg, hash, qrLinkAccount] = await Promise.all([
    generateQRCode(JSON.stringify({ chainId, ...transaction }), 1),
    getTransactionHash({
      chainId,
      ...transaction,
    }),
    getQrLink(),
  ]);
  const linkAccount = qrLinkAccount !== undefined;

  return (await showDialogUnblind(
    svg,
    hash,
    linkAccount,
  )) as OnTransactionResponse;
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
    origin: signatureOrigin,
    ...signature,
    userId: snapState?.userId,
  }).catch((error) => {
    console.error('Non-critical API request failed:', error);
  });

  const [svg, hash, qrLinkAccount] = await Promise.all([
    generateQRCode(JSON.stringify(signature), 1),
    getMessageHash(signature),
    getQrLink(),
  ]);
  const linkAccount = qrLinkAccount !== undefined;

  return (await showDialogUnblind(
    svg,
    hash,
    linkAccount,
  )) as OnSignatureResponse;
};

type UserInfo = {
  userId: string;
  qrCode: string;
  botLink: string;
  tgLinked: boolean;
};

/**
 * Creates new user account in Unblind system and persists credentials.
 *
 * @returns A promise that resolves to the user info.
 */
async function signupUser(): Promise<UserInfo> {
  const MAX_ATTEMPTS = 3;
  const BASE_DELAY = 300; // 300ms between attempts

  let lastError: Error;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
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
    } catch (error) {
      lastError = error as Error;
      if (attempt < MAX_ATTEMPTS - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, BASE_DELAY * (attempt + 1)),
        );
      }
    }
  }

  throw new Error(`Signup failed: ${lastError.message}`);
}

/**
 * Gets user info from the Unblind API.
 *
 * @param userId - The user's ID.
 * @returns A promise that resolves to the user info.
 */
async function getUserInfo(userId: string): Promise<UserInfo> {
  return await apiRequest(`userInfo/${userId}`, 'GET');
}

/**
 * Gets the hash of a message.
 *
 * @param message - The message object to hash.
 * @returns A promise that resolves to the message hash.
 */
async function getMessageHash(message: object): Promise<string> {
  const json = await apiRequest('messageHash', 'POST', message);
  return json.hash;
}

/**
 * Gets the hash of a transaction.
 *
 * @param transaction - The transaction object to hash.
 * @returns A promise that resolves to the transaction hash.
 */
async function getTransactionHash(transaction: object): Promise<string> {
  const json = await apiRequest('transactionHash', 'POST', transaction);
  return json.hash;
}

export const onInstall: OnInstallHandler = async () => {
  try {
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
  } catch (error) {
    await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: (
          <Box>
            <Text>⚠️ Connection Error</Text>
            <Text>
              Temporary service outage. You can still use Unblind, but Telegram
              linking will be available later through settings.
            </Text>
          </Box>
        ),
      },
    });
    // Rethrow to maintain error visibility in logs
    throw error;
  }
};

export const onHomePage: OnHomePageHandler = async () => {
  const userId = await getUserId();
  const qrLinkAccount = await getQrLink();

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
            Visit{' '}
            <Link href={`https://unblind.app?userId=${userId}`}>
              unblind.app
            </Link>{' '}
            to learn more.
          </Text>
        )}
      </Box>
    ),
  };
};
