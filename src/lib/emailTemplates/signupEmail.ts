interface SignupEmailProps {
  name: string;
}

export const getSignupEmailHtml = ({ name }: SignupEmailProps): string => {
  return `
    <html>
      <head>
        <style>
          body { font-family: sans-serif; }
          .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Selamat Datang, ${name}!</h2>
          <p>Terima kasih telah mendaftar di layanan kami.</p>
          <p>Kami sangat senang Anda bergabung.</p>
          <hr/>
          <p>Hormat Kami,</p>
          <p>Tim Kami</p>
        </div>
      </body>
    </html>
  `;
};