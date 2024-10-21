import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config();

export const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT || 587,
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

const Fecha = new Date().getFullYear();

export const configTransportVery = (nombre, apellido, email, token, id) => {
  return {
    from: `${process.env.MAIL_FROM_ADDRESS}`,
    to: `${email}`,
    subject: "Confirmar correo electrónico",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificación de correo electrónico</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f0f4f8;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 12px; /* Bordes más redondeados */
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Sombra más suave y extendida */
            border: 1px solid #e0e0e0; /* Color de borde más suave */
            text-align: center;
          }
          .header {
            padding: 20px;
            background-color: #f7f9fc;
            border-bottom: 1px solid #e0e0e0;
            border-radius: 12px 12px 0 0; /* Bordes redondeados en la parte superior */
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333333;
          }
          .content {
            padding: 30px;
          }
          .content h1 {
            color: #2c3e50;
            font-size: 22px;
            margin-bottom: 20px;
          }
          .content p {
            color: #7f8c8d;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #bdc3c7;
          }
          .footer a {
            color: #bdc3c7;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:jetcargologo" alt="JetCargo Logo" style="max-width: 200px;" />
          </div>
          <div class="content">
            <h1>Hola, ${nombre} ${apellido}</h1>
            <p>Gracias por registrarte en JetCargo. Para completar tu registro y acceder a tu cuenta, por favor haz clic en el botón de abajo para confirmar tu correo electrónico.</p>
            <!-- Estilo aplicado directamente al botón para asegurarnos de que el texto sea blanco -->
            <a href="${process.env.API_BACK}:${process.env.PORT_BACK}/api/verify/email?token=${token}" style="display: inline-block; padding: 14px 28px; margin-top: 20px; background-color: #808080; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 50px; transition: background-color 0.3s ease;">
              Confirmar mi cuenta
            </a>
            <p>Si no puedes hacer clic en el enlace, copia y pega esta URL en tu navegador:</p>
            <p style="color: #95a5a6;">${process.env.API_BACK}:${process.env.PORT_BACK}/api/verify/email?token=${token}</p>
            <p>Este enlace expira en 7 días.</p>
          </div>
          <div class="footer">
            <p>&copy; ${Fecha} ${process.env.NAME}. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: 'JetCargo.png',
        path: path.join(__dirname, '../assets/logo/JetCargo.png'),
        cid: 'jetcargologo',
      },
    ],
  };
};

export const getPackageInTransitEmailTemplate = (nombre, apellido, email, trackings, imagenes) => {
  const currentYear = new Date().getFullYear();

  const trackingList = Array.isArray(trackings) ? trackings : trackings.split(', ');
  const trackingHtml = trackingList.join(', ');

  const imageList = Array.isArray(imagenes) ? imagenes : (typeof imagenes === 'string' ? imagenes.split(',') : []);
  
  const imageAttachments = imageList.map((imagen, index) => {
    const fileName = path.basename(imagen.trim());
    return {
      filename: fileName,
      path: path.join(__dirname, '../assets/package', fileName),
      cid: `package_image_${index + 1}`
    };
  });

  const imageHtml = imageAttachments.map(img => 
    `<img src="cid:${img.cid}" alt="Imagen del paquete" style="max-width: 200px; margin: 10px; border: 1px solid #e0e0e0; border-radius: 4px;">`
  ).join('');

  const paquetesTexto = trackingList.length > 1 ? 'tus paquetes' : 'tu paquete';
  const paquetesTexto2 = trackingList.length > 1 ? 'han' : 'ha';
  const paquetesTexto3 = trackingList.length > 1 ? 'las imágenes' : 'la imágen';

  return {
    from: process.env.MAIL_FROM_ADDRESS,
    to: email,
    subject: "Actualización del Estado de tus Paquetes",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Actualización del Estado de tus Paquetes</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f0f4f8;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 12px; /* Bordes más redondeados */
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Sombra más suave y extendida */
            border: 1px solid #e0e0e0; /* Color de borde más suave */
            text-align: center;
          }
          .header {
            padding: 20px;
            background-color: #f7f9fc;
            border-bottom: 1px solid #e0e0e0;
            border-radius: 12px 12px 0 0; /* Bordes redondeados en la parte superior */
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333333;
          }
          .content {
            padding: 30px;
          }
          .content h1 {
            color: #2c3e50;
            font-size: 22px;
            margin-bottom: 20px;
          }
          .content p {
            color: #7f8c8d;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .package-images {
            margin-top: 20px;
            text-align: center;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #bdc3c7;
          }
          .footer a {
            color: #bdc3c7;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:jetcargologo" alt="JetCargo Logo" style="max-width: 200px;" />
          </div>
          <div class="content">
            <h1>Hola, ${nombre} ${apellido}</h1>
            <p>Nos complace informarte que ${paquetesTexto} con número de tracking: <strong>${trackingHtml}</strong> ${paquetesTexto2} salido de nuestra bodega de Miami y ahora están en camino a Honduras.
            ${imageHtml ? `
            <p>Aquí puedes ver ${paquetesTexto3} de ${paquetesTexto}:</p>
            <div class="package-images">
              ${imageHtml}
            </div>
            ` : ''}
            <p>Te mantendremos informado sobre el progreso de tus envíos.</p>
          </div>
          <div class="footer">
            <p>&copy; ${currentYear} ${process.env.NAME}. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: 'JetCargo.png',
        path: path.join(__dirname, '../assets/logo/JetCargo.png'),
        cid: 'jetcargologo',
      },
      ...imageAttachments
    ],
  };
};

export const postPackageInTransitBodega = (nombre, apellido, email, tracking, imagePath) => {
  const currentYear = new Date().getFullYear();

  return {
    from: process.env.MAIL_FROM_ADDRESS,
    to: email,
    subject: "Actualización del Estado de tu Paquete",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Actualización del Estado del Paquete</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f0f4f8;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            border: 1px solid #e0e0e0;
            text-align: center;
          }
          .header {
            padding: 20px;
            background-color: #f7f9fc;
            border-bottom: 1px solid #e0e0e0;
            border-radius: 12px 12px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333333;
          }
          .content {
            padding: 30px;
          }
          .content h1 {
            color: #2c3e50;
            font-size: 22px;
            margin-bottom: 20px;
          }
          .content p {
            color: #7f8c8d;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #bdc3c7;
          }
          .footer a {
            color: #bdc3c7;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:jetcargologo" alt="JetCargo Logo" style="max-width: 200px;" />
          </div>
          <div class="content">
            <h1>Hola, ${nombre} ${apellido}</h1>
            <p>Nos complace informarte que tu paquete con número de tracking: <strong>${tracking}</strong> ahora mismo está en nuestra bodega de Miami.</p>
            <p>Aquí puedes ver la imagen de tu paquete:</p>
              <img src="cid:package_image" alt="Imagen del paquete" style="max-width: 200px; margin-top: 20px; border: 1px solid #e0e0e0; border-radius: 4px;">
            <p>Te mantendremos informado sobre el progreso de tu envío.</p>
          </div>
          </div>
          <div class="footer">
            <p>&copy; ${currentYear} ${process.env.NAME}. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: 'JetCargo.png',
        path: path.join(__dirname, '../assets/logo/JetCargo.png'),
        cid: 'jetcargologo',
      },
      {
        filename: 'package_image.jpg',
        path: imagePath,
        cid: 'package_image',
      },
    ],
  };
};

export const getPackageInTransitLlegada = (nombre, apellido, email, trackings, imagenes) => {
  const currentYear = new Date().getFullYear();

  const trackingList = Array.isArray(trackings) ? trackings : trackings.split(', ');
  const trackingHtml = trackingList.join(', ');

  const imageList = Array.isArray(imagenes) ? imagenes : (typeof imagenes === 'string' ? imagenes.split(',') : []);
  
  const imageAttachments = imageList.map((imagen, index) => {
    const fileName = path.basename(imagen.trim());
    return {
      filename: fileName,
      path: path.join(__dirname, '../assets/package', fileName),
      cid: `package_image_${index + 1}`
    };
  });

  const imageHtml = imageAttachments.map(img => 
    `<img src="cid:${img.cid}" alt="Imagen del paquete" style="max-width: 200px; margin: 10px; border: 1px solid #e0e0e0; border-radius: 4px;">`
  ).join('');

  const paquetesTexto = trackingList.length > 1 ? 'tus paquetes' : 'tu paquete';
  const paquetesTexto3 = trackingList.length > 1 ? 'las imágenes' : 'la imágen';
  const paquetesTexto4 = trackingList.length > 1 ? 'estan' : 'esta';

  return {
    from: process.env.MAIL_FROM_ADDRESS,
    to: email,
    subject: "Actualización del Estado de tus Paquetes",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Actualización del Estado de tus Paquetes</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f0f4f8;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 12px; /* Bordes más redondeados */
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Sombra más suave y extendida */
            border: 1px solid #e0e0e0; /* Color de borde más suave */
            text-align: center;
          }
          .header {
            padding: 20px;
            background-color: #f7f9fc;
            border-bottom: 1px solid #e0e0e0;
            border-radius: 12px 12px 0 0; /* Bordes redondeados en la parte superior */
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333333;
          }
          .content {
            padding: 30px;
          }
          .content h1 {
            color: #2c3e50;
            font-size: 22px;
            margin-bottom: 20px;
          }
          .content p {
            color: #7f8c8d;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .package-images {
            margin-top: 20px;
            text-align: center;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #bdc3c7;
          }
          .footer a {
            color: #bdc3c7;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:jetcargologo" alt="JetCargo Logo" style="max-width: 200px;" />
          </div>
          <div class="content">
            <h1>Hola, ${nombre} ${apellido}</h1>
            <p>Nos complace informarte que ${paquetesTexto} con número de tracking: <strong>${trackingHtml}</strong> ya ${paquetesTexto4} aqui en nuestras intalaciones de Honduras.
            ${imageHtml ? `
            <p>Aquí puedes ver ${paquetesTexto3} de ${paquetesTexto}:</p>
            <div class="package-images">
              ${imageHtml}
            </div>
            ` : ''}
            <p>Te mantendremos informado sobre el progreso de tus envíos.</p>
          </div>
          <div class="footer">
            <p>&copy; ${currentYear} ${process.env.NAME}. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: 'JetCargo.png',
        path: path.join(__dirname, '../assets/logo/JetCargo.png'),
        cid: 'jetcargologo',
      },
      ...imageAttachments
    ],
  };
};

export const configTransportResetPassword = (nombre, apellido, email, token) => {
  return {
    from: `${process.env.MAIL_FROM_ADDRESS}`,
    to: `${email}`,
    subject: "Restablecer contraseña",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecer contraseña</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #f0f4f8;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            border: 1px solid #e0e0e0;
            text-align: center;
          }
          .header {
            padding: 20px;
            background-color: #f7f9fc;
            border-bottom: 1px solid #e0e0e0;
            border-radius: 12px 12px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333333;
          }
          .content {
            padding: 30px;
          }
          .content h1 {
            color: #2c3e50;
            font-size: 22px;
            margin-bottom: 20px;
          }
          .content p {
            color: #7f8c8d;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #bdc3c7;
          }
          .footer a {
            color: #bdc3c7;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:jetcargologo" alt="JetCargo Logo" style="max-width: 200px;" />
          </div>
          <div class="content">
            <h1>Hola, ${nombre} ${apellido}</h1>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el botón de abajo para continuar con el proceso.</p>
            <a href="${process.env.API_FRONT}/resetPassword/${token}" style="display: inline-block; padding: 14px 28px; margin-top: 20px; background-color: #808080; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 50px; transition: background-color 0.3s ease;">
              Restablecer contraseña
            </a>
            <p>Este enlace expira en 15 miutos.</p>
          </div>
          <div class="footer">
            <p>&copy; ${Fecha} ${process.env.NAME}. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: 'JetCargo.png',
        path: path.join(__dirname, '../assets/logo/JetCargo.png'),
        cid: 'jetcargologo',
      },
    ],
  };
};