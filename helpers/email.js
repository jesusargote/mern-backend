import nodemailer from "nodemailer"

export const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos
    
var transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
}
  });
    
      // Información del email
      const info = await transport.sendMail({
        from: '"UpTask - Comprueba tu Cuenta" <cuentas@uptask.com>',
        to: email,
        text: "Comprueba tu cuenta en UpTask",
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
      <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:
      <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
      </p>
      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
      `
      })      
}

export const emailOlvidePassword = async (datos) => {
    const { email, nombre, token } = datos

var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
}

  });
    
      // Información del email
      const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "Uptask - Reestablece tu Password",
        text: "Reestablece tu Password de tu Cuenta en UpTask",
        html: `<p>Hola:${nombre} has solicitado reestablecer tu password</p>
        <p>Dar click en el siguiente enlace para generar un nuevo password:</p>
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
        <p>Si tu no solicitaste este email, puedes Ignorar el mensaje</p>`,
    })
    
    
}