import type { EIP1559Transaction, OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-sdk';
import { Box, Text, Bold, Heading, Image, Link} from '@metamask/snaps-sdk/jsx';
import qrIcon from './qr.svg';
import { QRCode } from './generateQr';

// const svgIcon = 'https://upload.wikimedia.org/wikipedia/commons/4/41/QR_Code_Example.svg';


declare global {
  interface Window {
    ethereum: any;
  }
}

function getBase64(file: Blob) : Promise<string> {
    const reader = new FileReader()
    return new Promise(resolve => {
      reader.onloadend = ev => {
        resolve(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    })
  }

/**
 * On Transaction
 */
export const onTransaction: OnTransactionHandler = async (data) => {
  const { chainId, transactionOrigin } = data;
  const transaction = data.transaction as EIP1559Transaction;

  // Send Tx to bitfinding api
  // generate qr/hash/
  const url = new URL(`https://bitfinding.com/simulate/`);
  url.searchParams.append('from', transaction.from);
  url.searchParams.append('to', transaction.to);
  url.searchParams.append('value', transaction.value);
  url.searchParams.append('gas', transaction.gas);
  url.searchParams.append('maxFeePerGas', transaction.maxFeePerGas);
  url.searchParams.append('maxPriorityFeePerGas', transaction.maxPriorityFeePerGas);
  url.searchParams.append('data', transaction.data);
  url.searchParams.append('origin', transactionOrigin ?? '');
  // const qr = new QRCode(url.toString(), { size: 256, padding: 20, background: '#ffffff', foreground: '#000000' });

  // const qrSvg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  //   <image href="${qr.toDataURL()}" height="200" width="200" />
  // </svg>`;

  // const qrUrlRequest = await fetch(`https://bitfinding.com/simulate/create-link`, {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     from: transaction.from,
  //     to: transaction.to,
  //     value: transaction.value,
  //     gas: transaction.gas,
  //     maxFeePerGas: transaction.maxFeePerGas,
  //     maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
  //     data: transaction.data,
  //     origin: transactionOrigin ?? '',
  //   }),
  // });
  // const body = await qrUrlRequest.json();
  
  // const qrSvgImage = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  //   <image href="data:image/png;base64,${qrUrlImage}" height="200" width="200" />
  // </svg>`;
  const body = { svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="1160px" height="1160px" viewBox="0 0 1160 1160" enable-background="new 0 0 1160 1160" xml:space="preserve">
<rect x="0" y="0" width="1160" height="1160" fill="rgb(255,255,255)"/><g transform="translate(80,80)"><g transform="translate(320,0) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,0) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,0) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,0) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,40) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,40) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,40) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,80) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,80) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,80) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,80) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,80) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,80) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,120) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,120) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,120) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,120) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,160) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,160) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,160) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,160) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,160) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,160) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,160) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,200) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,200) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,240) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,240) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,240) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,240) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,240) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,280) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,280) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,280) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,280) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(80,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(120,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(200,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(240,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,320) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(80,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(120,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(160,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(200,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,360) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(80,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(120,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(240,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,400) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(40,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(120,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(160,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(880,440) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(80,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(120,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(200,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(240,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(880,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,480) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(120,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(160,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,520) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(40,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(160,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(240,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(880,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,560) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(160,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(200,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,600) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(160,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(200,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(240,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(880,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,640) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,680) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,680) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,680) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,680) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,680) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(880,680) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,680) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(880,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,720) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(600,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,760) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,800) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(880,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,840) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(440,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(520,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(640,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(720,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(880,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,880) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(400,920) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(680,920) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,920) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(880,920) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(320,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(360,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(480,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(760,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(880,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(920,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(960,960) scale(0.4,0.4)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,0) scale(2.8, 2.8)"><g transform="" style="fill: rgb(0, 0, 0);">
<g>
	<rect x="15" y="15" style="fill:none;" width="70" height="70"/>
	<path d="M85,0H15H0v15v70v15h15h70h15V85V15V0H85z M85,85H15V15h70V85z"/>
</g>
</g></g><g transform="translate(720,0) scale(2.8, 2.8)"><g transform="" style="fill: rgb(0, 0, 0);">
<g>
	<rect x="15" y="15" style="fill:none;" width="70" height="70"/>
	<path d="M85,0H15H0v15v70v15h15h70h15V85V15V0H85z M85,85H15V15h70V85z"/>
</g>
</g></g><g transform="translate(0,720) scale(2.8, 2.8)"><g transform="" style="fill: rgb(0, 0, 0);">
<g>
	<rect x="15" y="15" style="fill:none;" width="70" height="70"/>
	<path d="M85,0H15H0v15v70v15h15h70h15V85V15V0H85z M85,85H15V15h70V85z"/>
</g>
</g></g><g transform="translate(80,80) scale(1.2, 1.2)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(800,80) scale(1.2, 1.2)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(80,800) scale(1.2, 1.2)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g></g></svg>`
};
  return {
    content: (
      <Box>
        <Heading>Bitfinding QR</Heading>
        <Link href={url.toString()}>Bitfinding</Link>
        <Image src={body.svg} />
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
